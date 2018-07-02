// --------------------------------------------------------------------------------
// hash location + smooth scrolling
// 모든 anchor에 이벤트 바인딩하자. internal link로 판명될 경우 smooth scrolling 처리
// 최초 로딩,URL에서 hash가 변경될 경우 smooth scrolling 하지 않기로
// --------------------------------------------------------------------------------
(function ($) {
    var _isSetClassName = true;

    function smoothScrollTo(hash, e) {
        if (hash === '') { return false; } 

        if ($(hash).length > 0) {

            if(typeof e !== 'undefined') {
                if ('scrollRestoration' in history) {
                    history.scrollRestoration = 'manual';
                }

                e.preventDefault();
                var insertQuery;

                if (e.type === 'click') {

                    insertQuery = $(e.target).attr('href');
                    history.pushState(null, null, insertQuery);
                }
            }

            _isSetClassName = false;

            $('html,body').animate({
                scrollTop: $(hash).offset().top
            }, 350, function() {
                _isSetClassName = true;
            });
        }
    }

    $(function() {
        $('#header nav a[href*="#"]').not('[href="#"]').not('[href="#0"]').click(function(e) {
            $('#header a[href*="#"]').removeClass('viewing');
            $(this).addClass('viewing');
            smoothScrollTo(this.hash, e);
        });

        smoothScrollTo(location.hash);

        $(window).on('hashchange',function (e){
            smoothScrollTo(location.hash, e);
        });
    });


    $(function (){
        // 스크롤 위치에 따른 GNB color changing (by class binding)
        // function headerInteraction (target,window,wall) {
        //     var target = $(target)
        //     ,   scrollPosition = parseInt($(window).scrollTop())
        //     ,   changeScrollPosition = parseInt($(wall).outerHeight())
        //     ;

        //     scrollPosition > changeScrollPosition - 40 ?  target.addClass('invert') : target.removeClass('invert');
        // }

        // // 로딩시 바인딩
        // headerInteraction($('#header'),$(window),$('#summary'))

        // $(document).on('scroll', function(e) {
        //     headerInteraction($('#header'),$(window),$('#summary'))

        // }); 
        
        // 스크롤 위치에 따라서 link에 클래스 바인딩을 한다.
        var sectionHeight = (function (sectionGroup) {
            var sectionGroup
            ,   max = sectionGroup.length
            ;

            var result = [];

            // 미리 선처리를 해서 각 섹션의 길이를 가져오는 방법을 취해야겠구나.
            $.each(sectionGroup, function(i, section) {
                if (!!$(section).attr('id')) {
                    result.push({
                        id : $(section).attr('id'),
                        position : {
                            from : $(section).offset().top,
                            to : (function (section) {
                                console.log(section)
                                // 지금 엘리먼트의 offset.top에서 다음 엘리먼트의 offset.top까지.
                                // 만일 다음 엘리먼트가 없으면 문서 길이 전체를 취하면 된다.
                                $(section).offset().top + $(section).outerHeight()
                            })(section)
                        },
                        hash : (function (id){
                            return id === 'summary' ? null : '#'+id
                        })($(section).attr('id'))
                    })
                }
            });
            return result;

        })($('article > section'));

        $(document).on('scroll', function(e) {
            var scrollTop = $(document).scrollTop()
            ,   element
            ;

            for (var i=0; i < sectionHeight.length; i++) {
                if (sectionHeight[i].position.from <= scrollTop && sectionHeight[i].position.to > scrollTop) {
                    element = sectionHeight[i].id;
                    if (_isSetClassName) {
                        $('#header a[href*="#"]').removeClass('viewing');
                        $('#header a[href="#' + element + '"]').addClass('viewing');
                    }
                }
            }
        });
    });
})(jQuery);
