$(document).ready(function() {


var userid = $('#hlogin').data('userid') || 'anonymous';
var likes = [];
var hates = [];

var loaded = [];
var current = -1;

var data = { 'user' : userid };
$.ajax({
    type: "GET",
    url: "/api/user",
    data: data,
    success: function(r) {
        if (r) {
            console.log(JSON.parse(r));
            var user = JSON.parse(r);
            likes = user['like'];
            hate = user['hate'];
         } else {
            alert('not ok');
        }
    }
});

function load_pic(pic) {

    pic = pic['cloudinary'];
    $('#demotivator').attr('src', pic.url);
    $('#demotivator').data('picid', pic.public_id);
    $('#upvotes').html(pic.fun_like || '');
    $('#downvotes').html(pic.fun_hate || '');
    $('#abslink').html('link to this demotivator: <a href="http://funtastiq.ru/' + pic.public_id + '">http://funtastiq.ru/' + pic.public_id + '</a>' );

    if (_.indexOf(likes, pic.public_id) > -1) {
        $('#like').addClass('on');
    }
    if (_.indexOf(hates, pic.public_id) > -1) {
        $('#hate').addClass('on');
    }

}

function next_demotivator(incr) {

    $('a').removeClass('on');
    $('a').removeClass('off');

    current = current + incr;
    if (current < 0) {
        current = 0;
    }

    if ((current == loaded.length) || (loaded.length - current == 3)) {

        data = {};
        $.ajax({
            type: "GET",
            url: "/api/next",
            data: data,
            success: function(r) {
                if (r.data) {
                    loaded.push.apply(loaded, r.data);
                    $.each(r.data,function(){(new Image).src=this['cloudinary'].url});        
                    //console.log(loaded);
                    var pic = loaded[current];
                
                    load_pic(pic);
                 } else {
                    alert('not ok');
                }
            }
        });

    } else {
        load_pic(loaded[current]);
    }


}


Mousetrap.bind('right', function() { next_demotivator(1); });
Mousetrap.bind('d', function() { next_demotivator(1); });
Mousetrap.bind('left', function() { next_demotivator(-1); });
Mousetrap.bind('a', function() { next_demotivator(-1); });
$('#demotivator').click(function(event) {
    event.preventDefault();
    next_demotivator(1);
});


$('#like').click(function(event) {

    event.preventDefault();

    if ($('#hate').hasClass('on')) {
        $('#hate').removeClass('on');
        var downvotes = $('#downvotes').html() || 0;
        $('#downvotes').html(--downvotes);
    }

    var likeswitch = $(this).hasClass('on') ? 'off' : 'on';

    var upvotes = $('#upvotes').html() || 0;
    $('#upvotes').html(likeswitch == 'on' ? ++upvotes : --upvotes);

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
                if ($('#like').hasClass('on')) {
                    likes = _.without(likes, $('#demotivator').data('picid'));
                } else {
                    likes.push($('#demotivator').data('picid'));
                }
                $('#like').toggleClass("on");
             } else {
                alert('not ok');
            }
        }
    });
});

$('#hate').click(function(event) {

    event.preventDefault();

    if ($('#like').hasClass('on')) {
        $('#like').removeClass('on');
        var upvotes = $('#upvotes').html() || 0;
        $('#upvotes').html(--upvotes);
    }


    var hateswitch = $(this).hasClass('on') ? 'off' : 'on';

    var downvotes = $('#downvotes').html() || 0;
    $('#downvotes').html( hateswitch == 'on' ? ++downvotes : --downvotes);


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
                if ($('#hate').hasClass('on')) {
                    hates = _.without(hates, $('#demotivator').data('picid'));
                } else {
                    hates.push($('#demotivator').data('picid'));
                }
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
                console.log('data:');
                console.log(r.data);
                $('#demotivator').attr('src', r.data[0]['cloudinary'].url);
                $('#demotivator').data('picid', r.data[0]['cloudinary'].public_id);
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

