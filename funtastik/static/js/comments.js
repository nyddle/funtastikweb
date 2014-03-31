    $(document).ready(function() {
        news_id = $('article').data('news-id');
        $('.commnets-list-icons').each(function(i,comment) { 
            comment = $(comment);
            comment.find('.topic-rating').click(function() {

                comment_id = comment.find('input').val();
                var data = {
                    comment_id: news_id+'-'+comment_id,
                    vote_type: "up",
                };


                up = $(this);
                $.ajax({
                        type: "POST",
                        url: "/api/votecomment",
                        data: data,
                        success: function(r) {
                            if (r.status == "ok") {
                                if (up.html() != null) {
                                    up_count = up.find('.comment-upvote-count').html();
                                    up_count++;
                                    up.find('.comment-upvote-count').html(up_count);
                                }
                                //alert('You successfuly voted!!!111');
                                n = $("article[data-news-id="+news_id+"]");
                                n.find(".uparrow").addClass("voted");
                                n.find(".downarrow").addClass("disabled");
                            } else {
                                humane.log(r.error, { timeout: 1000, clickToClose: true, addnCls: 'humane-error' });
                            }
                        }
                    });
             });
        });
    });

