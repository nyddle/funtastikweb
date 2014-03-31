var yourid;


function draw_friend(uid, name, photo) {

    return '<a href="/' + uid + '" class="friend"> \
        <div class="friend__avatar"> \
            <img src="' + photo + '" alt="" width="30" /> \
        </div> \
        <div class="friend__name"> \
            ' + name + '\
        </div>\
    </a>';

}


$(document).ready(function() {

  //$('.like__types').children().find('a').text('sdvsdvds');
  $("[class^=like--]").click(function() {
    var like_type = $(this).attr('class');
    var public_id = $(this).parent().parent().find('.post__social').data('id');
    data = {
        public_id : public_id,
        like_type : like_type
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

  var ids = [];
  $('.post').each(function(i, val) {
    //alert($(this).attr('id')); 
    ids.push($(this).data('sender'));
    ids.push($(this).data('receiver'));
  });
  var allnames = new Array();
  VK.Api.call('users.get',  {fields: ['uid', 'first_name', 'last_name' ], order: 'name', uids: ids.join(',')}, function(r){
     if(r.response){
      r = r.response;
      for (x in r) {
        h = r[x];
        //h[x.uid] = x.first_name + ' ' + x.last_name;
        name = h.first_name + ' ' + h.last_name;
        allnames[h.uid] = name;
      }
      $('.post').each(function(i, val) {
        var sender = $(this).data('sender');
        var receiver = $(this).data('receiver');
        $(this).find('.post__people a').text('posted by ' + allnames[sender] + ' to ' + allnames[receiver]);
      });

    } else {
        //alert('no response (');
    }
  });


  $('#sender').attr('value', yourid);

  VK.Api.call('friends.get', {fields: ['uid', 'first_name', 'last_name', 'photo'], order: 'name'}, function(r){
   if(r.response){
    r = r.response;

    var rids = [];
    for(var i = 0; i < r.length; ++i){
       var name = r[i].first_name+' '+ r[i].last_name;
       var uid = r[i].uid;
       var photo = r[i].photo;
       rids.push(uid)
       $('#friends').append(draw_friend(uid, name, photo));
    }
   data = { friends : rids, me : yourid };
   $.ajax({
            type: "POST",
            url: "/api/friends",
            data: data,
            success: function(r) {
                if (r.status == "ok") {
                 } else {
                    alert('not ok');
                }
            }
        });


   } else alert("Не удалось получить список ваших друзей");
  });


  $('.like').click(function() {
      public_id = $(this).parent().parent().attr('id');
      like_type = $(this).attr('value');

        var data = {
            public_id : public_id,
            like_type : like_type,
        };
        $.ajax({
            type: "POST",
            url: "/api/like",
            data: data,
            success: function(r) {
                if (r.status == "ok") {
                    alert('Лайк засчитан.');
                     } else {
                    alert('no luck (');
                }
            }
        });
  })
    
});

