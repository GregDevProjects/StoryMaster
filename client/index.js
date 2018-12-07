 //client socket -- connects to the host that calls the page by default
$(function () {
    var socket = io('http://localhost:3000');
    
    socket.on('roundOver', function(stats){
        showHideWriter(3)
        clearStats();
        showStats();
        
        stats.results.forEach(function(aStat){
            //console.log(aStat.user, stats.winner.user);
            const isWinner = aStat.user == stats.winner.user;
            addStat( isWinner ? "<b>WINNER " + aStat.user + "</b>": aStat.user, aStat.message, aStat.votes ? aStat.votes : 0);
        })
    })

    socket.on('waiting', function(msg) {
        $('#name').text(socket.id);
        $('#gameStatus').text(msg);
        showHideWriter(3);
    });

    socket.on('results', function(msg) {
        debugger;
        $('#story').text(msg.story);
        let html = '';
        for (var property in msg.score) {
            html+='<p>';
            html+=String(property);
            html+= ' : ';
            html+=String(msg.score[property]);
            html+='</p>'
        }
        
        $('#round-winners').html(html);
    });

    socket.on('turnTimer', function(msg){
        $('#gameStatus').text(
            msg.seconds + 
            ' left to ' +
            getTurnTypeText(msg.type)
        );
        showHideWriter(msg.type);
    }); 

    socket.on('vote', function(votes){
        console.log(votes)
        clearVotes();
        votes.forEach(aVote => {
            addVoteForUser(aVote.user, aVote.message) 
        });
    })

    $('#submit-msg').click(function(){   
        socket.emit(  
            'msg',
            $('textarea').val()
        );
    });
    
    $('#voting').on('click', 'button', function(e) {
        console.log(this.value);
        socket.emit(
            'vote',
            this.value
        )
    });

    function showHideWriter(type) {
        $('#writing').hide();
        $('#voting').hide();
        $('#end-round-display').hide();
        if (type == 1) {
            $('#writing').show();
            return;
        } else if (type == 2){
            $('#voting').show();
            return;
        } else if (type == 3) {
            $('#end-round-display').show();
        }


    }

    function clearVotes() {
        $('#voting table tbody').html("<tr><th>Writing</th><th>Vote</th></tr>");
    }

    function clearStats() {
        $('#end-round-display tbody').html("<table><tr><th>User</th><th>Writing</th><th>Votes</th></tr></table>");
    }

    function showStats() {
        $('#end-round-display').show();
    }

    function addStat(user, writing, votes) {
        $('#end-round-display table tbody')
        .append(
        "<tr> \
            <td> \
                " + user + "\
            </td> \
            <td> \
                " + writing + " \
            </td> \
            <td> \
                " + votes + "\
            </td> \
        <tr>"
        );       
    }

    function addVoteForUser(userId, writing) {
        $('#voting table tbody')
            .append(
            "<tr> \
            <td> \
                    " + writing + "\
                </td> \
                <td> \
                    <button value=" +userId+ "> \
                        VOTE \
                    </button> \
                </td> \
            <tr>"
            ); 
    }

    function getTurnTypeText(type) {
        if (type == 1) {
            return 'write';
        } else if (type == 2) {
            return 'vote';
        }  else if (type == 3) {
            return 'next round'
        }
        
    }
  });