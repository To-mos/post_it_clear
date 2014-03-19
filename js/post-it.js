$(function(){
    "use strict";
    var index = 2;

    var PostIt = function(e) {
        var $post_it = $("#master").clone().fadeIn(500);
        $post_it.css({
            'top': e.pageY + 'px',
            'left': e.pageX + 'px',
            display: 'block',
            'z-index': ++index
        })
        .draggable({
            handle: ".header"
        })
        .resizable();
        $post_it.on('mousedown', '.close', function() {
            var $sticky = $(this).parent().parent();
            $sticky.fadeOut(500, function() {
                $sticky.remove();
            });
        });
        $post_it.on("mousedown", function(e) {
            e.stopPropagation();
            $(this).css({
                'z-index': ++index
            });
        });
        $post_it.find(".colors").spectrum({
            change: function(color) {
                $post_it.find('.header').css('background-color', color.toRgbString().slice(0, -1) + ",0.3)");
                console.log(color.toRgbString().slice(0, -1) + ",0.3)");
            }
        });
        $("#workspace0").append($post_it);
    };
    var workspaceTable = [];
    var WorkSpace = function(e) {
        var $workspace = "<div id='workspace"+Math.rand(10.0)+"'></div>"
        $('body').append($workspace);
    };

    $(".workspace").on("mousedown", function(e) {
        if(e.target.className == 'workspace')
            new PostIt(e);
    });
    $('#UI_side').on('mousedown',function(e){
        switch(e.target.id){
            case 'UI_createWS':
                workspaceTable.push(new WorkSpace(e));
                break;
            case 'UI_delWS':
                alert("Delete");
                break;
        }
    });
});

