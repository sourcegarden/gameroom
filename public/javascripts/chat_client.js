/**
 * Created by jackiezhang on 15/5/31.
 */
/**
 * Created by jackiezhang on 15/5/24.
 */


function divEscapedContentElement(message) {
    return $('<div></div>').text(message);
}

function divSystemContentElement(message) {
    return $('<div></div>').html('<i>' + message + '</i>');
}

function processUserInput(chatApp, socket) {
    var message = $('#send-message').val();
    var systemMessage;

    if (message.charAt(0) == '/') {
        systemMessage = chatApp.processCommand(message);
        if (systemMessage) {
            $('#messages').append(divSystemContentElement(systemMessage));
        }
    } else {
        chatApp.sendMessage($('#room').text(), message);
        $('#messages').append(divEscapedContentElement(message));
        $('#messages').scrollTop($('#messages').prop('scrollHeight'));
    }

    $('#send-message').val('');
}

function processUserTouch(chatApp, socket)
{
    var leftdiv = document.getElementById("leftdiv");
    leftdiv.ontouchstart = function(e){
        chatApp.sendTouch($('#room').text(), socket.id, 65, true);
        e.stopPropagation();
        e.preventDefault();
    };
    leftdiv.ontouchend = function(e){
        chatApp.sendTouch($('#room').text(), socket.id, 65, false);
        e.stopPropagation();
        e.preventDefault();
    };

    var rightdiv = document.getElementById("rightdiv");
    rightdiv.ontouchstart = function(e){
        chatApp.sendTouch($('#room').text(), socket.id, 68, true);
        e.stopPropagation();
        e.preventDefault();
    };

    rightdiv.ontouchend = function(e){
        chatApp.sendTouch($('#room').text(), socket.id, 68, false);
        e.stopPropagation();
        e.preventDefault();
    };


    var updiv = document.getElementById("updiv");
        updiv.ontouchstart = function(e){
        chatApp.sendTouch($('#room').text(), socket.id, 87, true);
            e.stopPropagation();
            e.preventDefault();
        };

    updiv.ontouchend = function(e){
        chatApp.sendTouch($('#room').text(), socket.id, 87, false);
        e.stopPropagation();
        e.preventDefault();
    };


    var downdiv = document.getElementById("downdiv");
        downdiv.ontouchstart = function(e){
        chatApp.sendTouch($('#room').text(), socket.id, 83, true);
            e.stopPropagation();
            e.preventDefault();
        };

    downdiv.ontouchend = function(e){
        chatApp.sendTouch($('#room').text(), socket.id, 83, false);
        e.stopPropagation();
        e.preventDefault();
    };


    var adiv = document.getElementById("adiv");
    adiv.ontouchstart = function(e){
        chatApp.sendTouch($('#room').text(), socket.id, 85, true);
        e.stopPropagation();
        e.preventDefault();
    };

    adiv.ontouchend = function(e){
        chatApp.sendTouch($('#room').text(), socket.id, 85, false);
        e.stopPropagation();
        e.preventDefault();
    };


    var bdiv = document.getElementById("bdiv");
    bdiv.ontouchstart = function(e){
        chatApp.sendTouch($('#room').text(), socket.id, 73, true);
        e.stopPropagation();
        e.preventDefault();
    };

    bdiv.ontouchend = function(e){
        chatApp.sendTouch($('#room').text(), socket.id, 73, false);
        e.stopPropagation();
        e.preventDefault();
    };


    var xdiv = document.getElementById("xdiv");
    xdiv.ontouchstart = function(e){
        chatApp.sendTouch($('#room').text(), socket.id, 74, true);
        e.stopPropagation();
        e.preventDefault();
    };

    xdiv.ontouchend = function(e){
        chatApp.sendTouch($('#room').text(), socket.id, 74, false);
        e.stopPropagation();
        e.preventDefault();
    };


    var ydiv = document.getElementById("ydiv");
    ydiv.ontouchstart = function(e){
        chatApp.sendTouch($('#room').text(), socket.id, 75, true);
        e.stopPropagation();
        e.preventDefault();
    };

    ydiv.ontouchend = function(e){
        chatApp.sendTouch($('#room').text(), socket.id, 75, false);
        e.stopPropagation();
        e.preventDefault();
    };

};


function processUserMotion(chatApp, socket)
{
    if(window.DeviceMotionEvent)
    {
        window.addEventListener("devicemotion", function(){
            chatApp.sendmotion($('#room').text(), socket.id,event.accelerationIncludingGravity.x,
                event.accelerationIncludingGravity.y,
                event.accelerationIncludingGravity.z,
                event.rotationRate.alpha,
                event.rotationRate.beta,
                event.rotationRate.gamma,
                window.innerWidth/window.innerHeight > 1
            );
        }, false);
    }else{
        console.log("DeviceMotionEvent is not supported");
    }

}

var x = 0, y = 0,
    vx = 0, vy = 0,
    ax = 0, ay = 0;

var sphere = document.getElementById("sphere");

function boundingBoxCheck(){
    if (x<0) { x = 0; vx = -vx; }
    if (y<0) { y = 0; vy = -vy; }
    if (x>document.documentElement.clientWidth-20) { x = document.documentElement.clientWidth-20; vx = -vx; }
    if (y>document.documentElement.clientHeight-20) { y = document.documentElement.clientHeight-20; vy = -vy; }

}

function processSphere(message)
{
    ax = message.accelerationX * 5;
    ay = message.accelerationY * 5;

}
var socket = io.connect();
var client_id = 0;

$(document).ready(function() {
    var chatApp = new Chat(socket);
    var uri = window.location.pathname;
    var urlAux = uri.split('/');
    var room = urlAux[2];


    chatApp.changeRoom(room);

    socket.on('joinResult', function(result) {
        $('#room').text(result.room);
        $('#messages').append(divSystemContentElement('Room changed.'));
    });
    socket.on('rooms', function(rooms) {
        $('#room-list').empty();
        for (var room in rooms) {
            room = room.substring(1, room.length);
            if (room != '') {
                $('#room-list').append(divEscapedContentElement(room));
            }
        }
        $('#room-list div').click(function() {
            chatApp.processCommand('/join ' + $(this).text());
            $('#send-message').focus();
        });
    });

    setInterval(function() {
        socket.emit('rooms');
    }, 1000);
    $('#send-message').focus();

    $('#send-form').submit(function() {
        processUserInput(chatApp, socket);
        return false;
    });



    //processUserMotion(chatApp, socket);
   processUserTouch(chatApp, socket);
});