/**
 * Created by jackiezhang on 15/5/24.
 */

var socketio = require('socket.io');

var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};

var roomNum = 0;

exports.listen = function(server){
    io = socketio.listen(server);

    io.sockets.on('connection', function(socket){
            guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
            handlingAutoCreateRoom(socket);
            handleMessageBroadcasting(socket, nickNames);
            handleNameChangeAttempts(socket, nickNames, namesUsed);
            handleRoomJoining(socket);
            handleMotionBroadcasting(socket);
            socket.on('rooms', function() {
                socket.emit('rooms', io.sockets.adapter.rooms)
            });

            handleClientDisconnection(socket, nickNames, namesUsed);
        });
};

function handlingAutoCreateRoom(socket)
{
    socket.on('createRoom', function(msg) {
        var room = "room" + roomNum;
        console.log("client created room:" + room)
        joinRoom(socket, room);
        roomNum++;
        sendServerAddress(socket);
    });
}

function getLocalIp(name, family) {
    //���е�����
    var os = require('os');
    var ifaces = os.networkInterfaces();

    //�Ƴ�loopback,û�������
    for (var dev in ifaces) {
        if (dev.toLowerCase().indexOf('loopback') != -1 ||
            dev.toLowerCase().indexOf('lo') != -1) {
            delete  ifaces[dev];
            continue;
        }
    }

    var ip = null;
    family = family.toUpperCase();

    var iface = null;
    if (name == null) {
        for (var dev in ifaces) {
            ifaces[dev].forEach(function (details) {
                if (details.family.toUpperCase() === family) {
                    ip = details.address;
                }
            });
            break;
        }
        return ip;
    }
    var nameList = name.split(',');
    for (var i = 0, j = nameList.length; i < j; i++) {
        var key = nameList[i];
        //ָ�������Ӳ�����
        if (ifaces[key] == null) {
            continue;
        }


        ifaces[key].forEach(function (details) {
            if (details.family.toUpperCase() === family) {
                ip = details.address;
            }
        });
        if (ip != null) {
            break;
        }
    }
    if (ip == null) {
        ip = '127.0.0.1';
        logger.error('get ip error, return 127.0.0.1, please check');
    }


    return ip;
}

function sendServerAddress(socket)
{

    var IPv4 = getLocalIp(null, 'IPV4');
    if (IPv4 != null)
    {
        socket.emit('serverIpRoom', {
            ip: IPv4,
            room: currentRoom[socket.id]
        });
    }
}


function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
    var name = 'Guest' + guestNumber;
    nickNames[socket.id] = name;
    socket.emit('nameResult', {
        success: true,
        name: name
    });
    namesUsed.push(name);
    return guestNumber + 1;
}

function joinRoom(socket, room){
    socket.join(room);
    currentRoom[socket.id] = room;
    socket.emit('joinResult', {room: room});
   socket.broadcast.to(room).emit('message', {
        text: nickNames[socket.id] + ' has joined ' + room + '.'
    });
    socket.broadcast.to(currentRoom[socket.id]).emit('clientJoined', {
        socketid: socket.id
    });

    if (io.nsps["/"].adapter.rooms[room].length > 1) {
        var usersInRoomSummary = 'Users currently in ' + room + ": ";
        for (var userSocketId in io.nsps["/"].adapter.rooms[room]) {
            if (userSocketId != socket.id) {
                if (index > 0) {
                    usersInRoomSummary += ', ';
                }
                usersInRoomSummary += nickNames[userSocketId];
            }
        }
        usersInRoomSummary += '.';
        socket.emit('message', {text: usersInRoomSummary});
    }


}

function handleNameChangeAttempts(socket, nickNames, namesUsed){
    socket.on('nameAttempt', function(name) {
        if (name.indexOf('Guest') == 0) {
            socket.emit('nameResult', {
                success: false,
                message: 'Names cannot begin with "guest".'
            })
        } else {
            if (namesUsed.indexOf(name) == -1) {
                var previousName = nickNames[socket.id];
                var previousNameIndex = namesUsed.indexOf(previousName);
                namesUsed.push(name);
                nickNames[socket.id] = name;
                delete namesUsed[previousNameIndex];
                socket.emit('nameResult', {
                    success: true,
                    name: name
                });
                socket.broadcast.to(currentRoom[socket.id]).emit('message', {
                    text: previousName + 'is now rename as ' + name + '.'
                });

            }
            else {
                socket.emit('nameResult', {
                    success: false,
                    message: 'That name is already in use.'
                });
            }
        }
    });
}


function handleMessageBroadcasting(socket) {
    socket.on('message', function(message) {
        socket.broadcast.to(message.room).emit('message', {
            text:nickNames[socket.id] + ':' + message.text
        });
    });
}

function handleMotionBroadcasting(socket) {
    socket.on('motion', function(message) {
        socket.broadcast.to(currentRoom[socket.id]).emit('motion', {
            room: message.room,
            socketid: socket.id,
            accelerationX: message.accelerationX,
            accelerationY: message.accelerationY,
            accelerationZ: message.accelerationZ,
            rotationAlpha: message.rotationAlpha,
            rotationBeta: message.rotationBeta,
            rotationGamma: message.rotationGamma,
            landscape: message.landscape
        });
        console.log("client:" + socket.id + " motion : x:" + message.accelerationX + " y:" + message.accelerationY);
    });
}


function handleRoomJoining(socket) {
    socket.on('join', function(room) {
        socket.leave(currentRoom[socket.id]);
        joinRoom(socket, room.newRoom);
        console.log('client joined room:' + room.newRoom);
    });

}

function handleClientDisconnection(socket) {
    socket.on('disconnect', function() {
        var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
        delete namesUsed[nameIndex];
        delete nickNames[socket.id];
    });
}
