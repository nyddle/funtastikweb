$(document).ready(function() {

var userid = $('#hlogin').data('userid') || 'anonymous';

$('#demotivator').click(function(event) {

    event.preventDefault();

    $('a').removeClass('on');
    $('a').removeClass('off');

    data = {};
    $.ajax({
        type: "GET",
        url: "/api/next",
        data: data,
        success: function(r) {
            if (r.data) {
                console.log(r.data);
                $('#demotivator').attr('src', r.data[0].url);
                $('#demotivator').data('picid', r.data[0].public_id);
             } else {
                alert('not ok');
            }
        }
    });


});


$('#like').click(function(event) {

    event.preventDefault();

    if ($('#hate').removeClass('on'));

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
                $('#like').toggleClass("on");
             } else {
                alert('not ok');
            }
        }
    });
});

$('#hate').click(function(event) {

    event.preventDefault();

    $('#like').removeClass('on');

    var hateswitch = $(this).hasClass('on') ? 'off' : 'on';

    data = {
            "picid" : $('#demotivator').data('picid'),
            "user"  : userid,
            "hateswitch": hateswitch
            };
    $.ajax({
        type: "POST",
        url: "/api/hate",
        data: data,
        success: function(r) {
            if (r.status == "ok") {
                $('#hate').toggleClass("on");
             } else {
                alert('not ok');
            }
        }
    });
});

$('#next').click(function(event) {

    event.preventDefault();

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

    event.preventDefault();

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

