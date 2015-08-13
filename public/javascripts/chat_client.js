/**
 * Created by jackiezhang on 15/5/31.
 */
/**
 * Created by jackiezhang on 15/5/24.
 */

function sendTouchMsg(app, key, bDown)
{
    app.sendTouch($('#room').text(), socket.id, key, bDown);
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
    var leftPressed = false;
    var rightPressed = false;
    var upPressed = false;
    var downPressed = false;
    var directionThreshold = 20;
    controller.ontouchstart = function(e){
        var maxw = controller.clientWidth;
        var maxh = controller.clientHeight;
        var clienth = maxh - 80;

        for (var i = 0; i < e.touches.length; i++)
        {
            var startX = e.touches[i].pageX;
            var startY = e.touches[i].pageY;
            if (startX)
            {
                if (startX < maxw / 2) //left part
                {
                    leftStartX = startX;
                    leftStartY = startY;
                    $('#controller').append($('<button id="directSphere"></button>'));
                    var sphere = document.getElementById("directSphere");
                    sphere.style.marginTop = startY - 40 + "px";
                    sphere.style.marginLeft = startX - 20 + "px";

                }
                else
                {
                    rightStartX = startX;
                    rightStartY = startY;
                    if (rightStartY < clienth / 2) //upper part
                    {
                        $('#controller').append($('<button id="XSphere"></button>'));
                        var sphere = document.getElementById("XSphere");
                        sphere.style.marginTop = startY - 40 + "px";
                        sphere.style.marginLeft = startX - 20 + "px";
                        sendTouchMsg(chatApp, 74, true);

                    }
                    else
                    {
                        $('#controller').append($('<button id="YSphere"></button>'));
                        var sphere = document.getElementById("YSphere");
                        sphere.style.marginTop = startY - 40 + "px";
                        sphere.style.marginLeft = startX - 20 + "px";
                        sendTouchMsg(chatApp, 85, true);

                    }

                }
            }
        }

        e.stopPropagation();
        e.preventDefault();
    };

    controller.ontouchmove = function(e){
        var maxw = controller.clientWidth;
        var maxh = controller.clientHeight;
        for (var i = 0; i < e.touches.length; i++) {
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
                        if (Math.abs(leftStartXDelta) > directionThreshold && !leftPressed)
                        {
                            sendTouchMsg(chatApp, 65, true);
                            leftPressed = true;
                        }
                        else if (Math.abs(leftStartXDelta) < directionThreshold && leftPressed)
                        {
                            sendTouchMsg(chatApp, 65, false);
                            leftPressed = false;
                        }


                    }
                    else if (leftStartXDelta > 0)
                    {
                        if (Math.abs(leftStartXDelta) > directionThreshold && !rightPressed)
                        {
                            sendTouchMsg(chatApp, 68, true);
                            rightPressed = true;
                        }
                        else if (Math.abs(leftStartXDelta) < directionThreshold && rightPressed)
                        {
                            sendTouchMsg(chatApp, 68, false);
                            rightPressed = false;
                        }

                    }
                    if (leftStartYDelta < 0)
                    {
                        if (Math.abs(leftStartYDelta) > directionThreshold && !upPressed)
                        {
                            sendTouchMsg(chatApp, 87, true);
                            upPressed = true;
                        }
                        else if (Math.abs(leftStartYDelta) < directionThreshold && upPressed)
                        {
                            sendTouchMsg(chatApp, 87, false);
                            upPressed = false;
                            $('#directSphere').remove();

                        }

                    }
                    else if (leftStartYDelta > 0)
                    {
                        if (Math.abs(leftStartYDelta) > directionThreshold && !downPressed)
                        {
                            sendTouchMsg(chatApp, 83, true);
                            downPressed = true;
                        }
                        else if (Math.abs(leftStartYDelta) < directionThreshold && downPressed)
                        {
                            sendTouchMsg(chatApp, 83, false);
                            downPressed = false;
                            $('#directSphere').remove();

                        }


                    }

                }
                else
                {
                    rightStartXDelta = x - rightStartX;
                    rightStartYDelta = y - rightStartY;
                    if (leftPressed)
                    {
                        sendTouchMsg(chatApp, 65, false);
                        leftPressed = false;
                    }
                    if (rightPressed)
                    {
                        sendTouchMsg(chatApp, 68, false);
                        rightPressed = false;
                    }
                    if (upPressed)
                    {
                        sendTouchMsg(chatApp, 87, false);
                        upPressed = false;
                    }
                    if (downPressed)
                    {
                        sendTouchMsg(chatApp, 83, false);
                        downPressed = false;
                    }

                    $('#directSphere').remove();
                    $('#XSphere').remove();
                    $('#YSphere').remove();

                }
            }
        }

        e.stopPropagation();
        e.preventDefault();
    };
    controller.ontouchend = function(e){
        var maxw = controller.clientWidth;
        var maxh = controller.clientHeight;
        var clienth = maxh - 80;
        for (var i = 0; i < 2; i++) {
            var x = e.changedTouches[i].pageX;
            var y = e.changedTouches[i].pageY;
            if (x)
            {
                if (x < maxw / 2) //left part
                {
                    leftStartXDelta = x - leftStartX;
                    leftStartYDelta = y - leftStartY;
                    $('#directSphere').remove();
                    if (leftStartXDelta < 0)
                    {
                        sendTouchMsg(chatApp, 65, false);

                    }
                    else
                    {
                        sendTouchMsg(chatApp, 68, false);

                    }
                    if (y)
                    {
                        if (leftStartYDelta < 0)
                        {
                            sendTouchMsg(chatApp, 87, false);

                        }
                        else
                        {
                            sendTouchMsg(chatApp, 83, false);

                        }
                    }


                }
                else
                {
                    if (y < clienth / 2)
                    {
                        $('#XSphere').remove();
                        sendTouchMsg(chatApp, 74, false);
                    }
                    else
                    {
                        $('#YSphere').remove();
                        sendTouchMsg(chatApp, 85, false);
                    }

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