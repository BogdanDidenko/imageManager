$(document).on('ready', function() {
    var possibleClasses = [
        'slash_burn',
        'habitation',
        'conventional_mine',
        'primary', 'water',
        'cultivation',
        'artisinal_mine',
        'blooming',
        'bare_ground',
        'blow_down',
        'agriculture',
        'road',
        'selective_logging',
        'clear',
        'partly_cloudy',
        'cloudy',
        'haze'
    ]
    function sendLabeles() {
        var newData = {};
        $('.slick-slide:not(.slick-cloned) .mainImg').each(function(i, el) {

            var name = el.getAttribute('data-name');
            var labeles = el.getAttribute('data-labeles');
            newData[name] = labeles.trim();
        })
        $.ajax({
            url: "/data",
            method: "POST",
            dataType: "json",
            data: newData
        })
    }
    function getCurLabeles() {
        return $('.slick-current').find('.mainImg').get(0).getAttribute('data-labeles');
    }
    function setCurLabeles(labeles) {
        $('.slick-current').find('.mainImg').get(0).setAttribute('data-labeles', labeles)
        var c = getCurLabeles();
        c
    }
    function outLables() {
        var curLabeles = getCurLabeles();
        var labelesList = curLabeles.split(' ');
        $('.labeles-container').empty();
        labelesList.forEach(function(element) {
            $('.labeles-container').append('<li class="variable-label label">' +element+ '</li>')
        }, this);
    }



    $(window).bind('mousewheel', function(event) {
        if (event.originalEvent.wheelDelta >= 0) {
            $(".regular").slick('slickNext')
        }
        else {
            $(".regular").slick('slickPrev');
        }
        outLables();
    });
    $(document).on('click', '.variable-label', function() {
        var label = $(this).html();
        curLabeles = getCurLabeles();
        curLabeles = curLabeles.replace(label, '');
        setCurLabeles(curLabeles.trim());
        $(this).remove();
    })
    $(document).on('click', '.main-label', function() {
        var label = $(this).html();
        curLabeles = getCurLabeles();
        if(curLabeles.indexOf(label) === -1) {
            setCurLabeles(curLabeles + ( (curLabeles !== '') ? ' ' : '' ) + label);
            outLables();
        }
    })
    $('.finish').on('click', sendLabeles);
    
    $(".regular").slick({
        //dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 0
    });

    outLables();
});