/**
 * Created by jackiezhang on 15/5/31.
 */
/**
 * Created by jackiezhang on 15/5/24.
 */

function sendTouchMsg(app, key, bDown)
{
    app.sendTouch($('#room').text(), socket.id, key, true);
}

function processUserTouch(chatApp, socket)
{
    var controller = document.getElementById("controller");
    var leftStartX;
    var leftStartY;
    var rightStartX;
    var rightStartY;
    var leftStartXDelta;
    var leftStartYDelta;
    var rightStartXDelta;
    var rightStartYDelta;

    controller.ontouchstart = function(e){
        var maxw = controller.clientWidth;
        var maxh = controller.clientHeight;
        $("#leftmsg").html("");
        $("#rightmsg").html("");

        for (var i = 0; i < 2; i++)
        {
            var startX = e.touches[i].pageX;
            var startY = e.touches[i].pageY;
            if (startX)
            {
                if (startX < maxw / 2) //left part
                {
                    leftStartX = startX;
                    leftStartY = startY;
                }
                else
                {
                    rightStartX = startX;
                    rightStartY = startY;
                }
            }
        }

        e.stopPropagation();
        e.preventDefault();
    };

    controller.ontouchmove = function(e){
        var maxw = controller.clientWidth;
        var maxh = controller.clientHeight;
        for (var i = 0; i < 2; i++) {
            var x = e.touches[i].pageX;
            var y = e.touches[i].pageY;
            if (x)
            {
                if (x < maxw / 2) //left part
                {
                    leftStartXDelta = x - leftStartX;
                    leftStartYDelta = y - leftStartY;
                    if (leftStartXDelta < 0 && Math.abs(leftStartXDelta) > 20)
                    {
                        sendTouchMsg(chatApp, 65, true);
                        $("#leftmsg").html("<p>left</p>");

                    }
                    else if (leftStartXDelta > 0 && Math.abs(leftStartXDelta) > 20)
                    {
                        sendTouchMsg(chatApp, 68, true);
                        $("#leftmsg").html("<p>right</p>");

                    }
                    if (leftStartYDelta < 0 && Math.abs(leftStartYDelta) > 20)
                    {
                        sendTouchMsg(chatApp, 87, true);
                      ////  $("#leftmsg").html("<p>up</p>");

                    }
                    else if (leftStartYDelta > 0 && Math.abs(leftStartYDelta) > 20)
                    {
                        sendTouchMsg(chatApp, 83, true);
                      ////  $("#leftmsg").html("<p>down</p>");

                    }

                }
                else
                {
                    rightStartXDelta = x - rightStartX;
                    rightStartYDelta = y - rightStartY;
                    $("#rightmsg").html("<p>right: " + rightStartXDelta + ":" + rightStartYDelta +"</p>");
                }
            }
        }

        chatApp.sendTouch($('#room').text(), socket.id, 65, false);
        e.stopPropagation();
        e.preventDefault();
    };
    controller.ontouchend = function(e){
        var maxw = controller.clientWidth;
        var maxh = controller.clientHeight;
        for (var i = 0; i < 2; i++) {
            var x = e.touches[i].pageX;
            var y = e.touches[i].pageY;
            if (x)
            {
                if (x < maxw / 2) //left part
                {
                    leftStartXDelta = x - leftStartX;
                    leftStartYDelta = y - leftStartY;
                    if (leftStartXDelta < 0)
                    {
                        sendTouchMsg(chatApp, 65, false);

                    }
                    else
                    {
                        sendTouchMsg(chatApp, 68, false);

                    }
                    if (leftStartYDelta < 0)
                    {
                        sendTouchMsg(chatApp, 87, false);

                    }
                    else
                    {
                        sendTouchMsg(chatApp, 83, false);

                    }

                }
                else
                {
                    rightStartXDelta = x - rightStartX;
                    rightStartYDelta = y - rightStartY;
                    $("#rightmsg").html("<p>right: " + rightStartXDelta + ":" + rightStartYDelta +"</p>");
                }
            }
        }

        chatApp.sendTouch($('#room').text(), socket.id, 65, false);
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
    });
    socket.on('rooms', function(rooms) {
        $('#room-list').empty();
        for (var room in rooms) {
            room = room.substring(1, room.length);

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