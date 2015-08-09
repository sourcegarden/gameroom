/**
 * Created by jackiezhang on 15/5/31.
 */
/**
 * Created by jackiezhang on 15/5/24.
 */


function processUserTouch(chatApp, socket)
{
    var controller = document.getElementById("controller");
    controller.ontouchstart = function(e){
        $("#msg").html("");
        $("#msg").html("<p>ontouchstart</p>");

        chatApp.sendTouch($('#room').text(), socket.id, 65, true);
        e.stopPropagation();
        e.preventDefault();
    };
    controller.ontouchmove = function(e){
        $("#msg").html("");
        $("#msg").html("<p>ontouchmove</p>");

        chatApp.sendTouch($('#room').text(), socket.id, 65, false);
        e.stopPropagation();
        e.preventDefault();
    };
    controller.ontouchend = function(e){
        $("#msg").html("");
        $("#msg").html("<p>ontouchend</p>");

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