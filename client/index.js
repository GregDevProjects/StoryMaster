 //client socket -- connects to the host that calls the page by default
$(function () {
    var socket = io('http://localhost:3000/lobby');
    
    $('form').submit(function(){
      socket.emit('chat message', $('#m').val());
      $('#m').val('');
      return false;
    });

    socket.on('chat message', function(msg){
      $('#messages').append($('<li>').text(msg));
      window.scrollTo(0, document.body.scrollHeight);
    });

    socket.on('connected', function(totalUsers){
        $('#total').text(totalUsers);
        
    });     

    socket.on('create room', function(roomName){
        $('#gameStatus').text('in room: ' + roomName);
        
    }); 

    socket.on('in_room', function(msg){
        console.log(msg);
        
    }); 
  });