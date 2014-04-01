$(document).ready(function() {

var yourid = 'someuser';


$('#like').click(function() {
    event.stopPropagation();
    data = {};
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
            if (r.status == "ok") {
                alert('Ваш голос засчитан!');
             } else {
                alert('not ok');
            }
        }
    });
});


   
});

