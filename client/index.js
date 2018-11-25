 //client socket -- connects to the host that calls the page by default
$(function () {
    var socket = io('http://localhost:3000');

    $('.send').click(function(){   
        socket.emit(  
            'msg',
            $('textarea').val()
        );
    });

    socket.on('waiting', function(msg) {
       // alert('yo');
        $('#gameStatus').text(msg);
        showHideWriter(2)
    });

    socket.on('turnTimer', function(msg){
        $('#gameStatus').text(
            msg.seconds + 
            ' left to ' +
            getTurnTypeText(msg.type)
        );
        showHideWriter(msg.type);
    }); 

    function showHideWriter(type) {
        if (type == 1) {
            $('.send').show();
            return;
        }

        $('.send').hide();
    }

    function getTurnTypeText(type) {
        if (type == 1) {
            return 'write';
        }
        return 'vote';
    }
  });