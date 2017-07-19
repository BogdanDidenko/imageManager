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
    var indexImage = 0;
    function printImages(index) {
        index = (index >= 0) ? index : 0;
        var imageObj = images[index],
            imageHtml = $('.slick-current').find('.mainImg').get(0);
        imageHtml.src = 'images/' + imageObj.file;
        imageHtml.setAttribute('data-name', imageObj.name);
        imageHtml.setAttribute('data-labeles', imageObj.labeles);
    }
    var images;
    $.ajax({
        url: "/imagesList",
        method: "POST",
        success: function(data) {
            images = data;
            $(".regular").slick({
                //dots: true,
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 0
            });
            printImages(indexImage);
            outLables();
        }
    });
    function sendLabeles() {
        var newData = {};
        $.ajax({
            url: "/data",
            method: "POST",
            dataType: "json",
            data: {data:images},
            success: function() {
                $("#message").html('File saved.');
                $("#message").show(0).delay(1000).fadeOut();
            }
        });
    }
    function getCurLabeles() {
        return $('.slick-current').find('.mainImg').get(0).getAttribute('data-labeles');
    }
    function setCurLabeles(labeles) {
        var image = images[indexImage]
        image.labeles = labeles;
        $('.slick-current').find('.mainImg').get(0).setAttribute('data-labeles', labeles);
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
            $(".regular").slick('slickNext');
            printImages(indexImage +=1 );
        }
        else {
            $(".regular").slick('slickPrev');
            printImages(indexImage -=1 );
        }
        outLables();
    });
    $(document).on('click', '.variable-label', function() {
        var label = $(this).html();
        curLabeles = getCurLabeles();
        curLabeles = curLabeles.replace(label, '').trim();
        setCurLabeles(curLabeles);
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
 

});