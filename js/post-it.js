$(function(){
    "use strict";
    //////////////////////////////////CLOCK AT TOP CODE//////////////////////////////////
    // Cache some selectors

    var clock = $('#clock'),
        alarm = clock.find('.alarm'),
        ampm = clock.find('.ampm');

    // Map digits to their names (this will be an array)
    var digit_to_name = 'zero one two three four five six seven eight nine'.split(' ');

    // This object will hold the digit elements
    var digits = {};

    // Positions for the hours, minutes, and seconds
    var positions = [
        'h1', 'h2', ':', 'm1', 'm2', ':', 's1', 's2'
    ];

    // Generate the digits with the needed markup,
    // and add them to the clock

    var digit_holder = clock.find('.digits');

    $.each(positions, function(){
        if(this == ':'){
            digit_holder.append('<div class="dots">');
        }else{
            var pos = $('<div>');
            for(var i=1; i<8; i++){
                pos.append('<span class="d' + i + '">');
            }
            // Set the digits as key:value pairs in the digits object
            digits[this] = pos;
            // Add the digit elements to the page
            digit_holder.append(pos);
        }
    });

    // Run a timer every second and update the clock

    (function update_time(){
        var time = new Date();
        var hour = time.getHours();
        var now = String(time.getHours())+String(time.getMinutes());
        if(hour > 12)
            now += String(time.getSeconds()-12)+"AM";
        else
            now += String(time.getSeconds())+"PM";

        digits.h1.attr('class', digit_to_name[now[0]]);
        digits.h2.attr('class', digit_to_name[now[1]]);
        digits.m1.attr('class', digit_to_name[now[2]]);
        digits.m2.attr('class', digit_to_name[now[3]]);
        digits.s1.attr('class', digit_to_name[now[4]]);
        digits.s2.attr('class', digit_to_name[now[5]]);

        // Set the am/pm text:
        ampm.text(now[6]+now[7]);

        // Schedule this function to be run again in 1 sec
        setTimeout(update_time, 1000);
    })();

    var workspaceCurrent = 0;
    //workspace 0 is already there
    var workspaceIndex = 1;
    var workspaceTable = [];

    var stickyDepth = 2;
    //////////////////////////////////POST IT CODE//////////////////////////////////
    var PostIt = function(e) {
        var $post_it = $('#master').clone().fadeIn(500);
        $post_it.css({
            'top': e.pageY-$post_it.width()*0.1 + 'px',
            'left': e.pageX-$post_it.height()*0.5 + 'px',
            display: 'block',
            'z-index': ++stickyDepth
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
        $post_it.on('mousedown', function(e) {
            e.stopPropagation();
            $(this).css({
                'z-index': ++stickyDepth
            });
        });
        $post_it.find(".colors").spectrum({
            change: function(color) {
                $post_it.find('.header').css('background-color', color.toRgbString().slice(0, -1) + ",0.3)");
                console.log(color.toRgbString().slice(0, -1) + ",0.3)");
            }
        });
        $('#workspace'+workspaceCurrent).append($post_it);
    };
    //////////////////////////////////WORK SPACE CODE//////////////////////////////////
    var WorkSpace = function() {
        this.num = workspaceIndex++;
        var $workspace = "<div id='workspace"+this.num+"'class='workspace-disabled'></div>"
        workspaceCurrent = this.num;
        $('body').append($workspace);
        $('#UI_side div ul').append(
            "<li>"+
                "<span id='UI_workspace"+workspaceCurrent+"' class='UI_workspaceButton'>Workspace "+workspaceCurrent+"</span>"+
            "</li>"
        );
    };

    $('.workspace').on('mousedown', function(e) {
        if(e.target.className == 'workspace')
            new PostIt(e);
    });
    $('#UI_side').on('mousedown',function(e){
        switch(e.target.id){
            case 'UI_createWS':
                workspaceTable.push(new WorkSpace());
                break;
            case 'UI_delWS':
                if(workspaceCurrent == 0) break;
                $('#workspace'+workspaceCurrent).remove();
                $('#UI_workspace'+workspaceCurrent).parent().remove();
                workspaceTable.splice(workspaceCurrent,1);
                --workspaceCurrent;
                break;
            case 'UI_workspace'+workspaceCurrent:
                $('.workspace').hide();
                $('#workspace'+workspaceCurrent).show();
                //workspaceTable
                break;
        }
    }).hover(function(){
    //enter
        $(this).animate({
            'left': '+=185px'
            }, "medium"
        );
    },function(){
    //leave
        $(this).animate({
            'left': '-=185px'
            }, "medium"
        );
    });
});

