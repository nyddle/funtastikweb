$(document).ready(function() {

var userid = $('#hlogin').data('userid') || 'anonymous';


$('#like').click(function() {

    event.stopPropagation();
    var likeswitch = $(this).hasClass('on') ? 'off' : 'on';

    data = {
            "picid" : $('#demotivator').data('picid'),
            "user"  : userid,
            "likeswitch": likeswitch
            };
    $.ajax({
        type: "POST",
        url: "/api/like",
        data: data,
        success: function(r) {
            if (r.status == "ok") {
                alert('swith to ' + likeswitch);
                $('#like').toggleClass("on");
             } else {
                alert('not ok');
            }
        }
    });
});

$('#like').click(function() {

    event.stopPropagation();
    var likeswitch = $(this).hasClass('on') ? 'off' : 'on';

    data = {
            "picid" : $('#demotivator').data('picid'),
            "user"  : userid,
            "likeswitch": likeswitch
            };
    $.ajax({
        type: "POST",
        url: "/api/like",
        data: data,
        success: function(r) {
            if (r.status == "ok") {
                alert('swith to ' + likeswitch);
                $('#like').toggleClass("on");
             } else {
                alert('not ok');
            }
        }
    });
});

$('#next').click(function() {
    event.stopPropagation();
    data = {};
    $.ajax({
        type: "GET",
        url: "/api/next",
        data: data,
        success: function(r) {
            if (r.data) {
                $('#demotivator').attr('src', r.data[0].url);
                $('#demotivator').data('picid', r.data[0].public_id);
             } else {
                alert('not ok');
            }
        }
    });
});

$('#favorites').click(function() {
    event.stopPropagation();
    data = {
            "user"  : userid
            };
    $.ajax({
        type: "GET",
        url: "/api/favorites",
        data: data,
        success: function(r) {
            alert(r);
        }
    });
});


   
});

