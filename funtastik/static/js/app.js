$(document).ready(function() {

var userid = 'someuser';

$('#like').click(function() {
    event.stopPropagation();
    data = {
            "picid" : $('#demotivator').data('picid'),
            "user"  : userid
            };
    $.ajax({
        type: "POST",
        url: "/api/like",
        data: data,
        success: function(r) {
            if (r.status == "ok") {
                alert('Ваш голос засчитан!');
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
            if (r.url) {
                $('#demotivator').attr('src', r.url);
                $('#demotivator').data('picid', r.public_id);
             } else {
                alert('not ok');
            }
        }
    });
});


   
});

