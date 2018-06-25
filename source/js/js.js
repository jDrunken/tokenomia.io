// --------------------------------------------------------------------------------
// bugger menu
// --------------------------------------------------------------------------------
(function ($) {
    $(function(){
        $('#header .bugger').click(function(){
            $('#header nav').addClass('open');
        });

        $('#header .close').click(function(){
            $('#header nav').removeClass('open');
        });
    });
})(jQuery);






// --------------------------------------------------------------------------------
// tab view :: faq
// button click :: faq details
// --------------------------------------------------------------------------------
(function ($) {
    $(function () {
        var handler = {
            tab : $('#faq .link a'),
            button : $('#faq dl dt button')
        }
        ,   target = {
                dl : $('#faq dl'),
                dt : $('#faq dt')
            }
        ;

        $(handler.tab).click (function (e) {
            // 기본동작 중지
            e.preventDefault();

            $(handler.tab).removeClass('viewing');
            $(target.dl).removeClass('viewing')
            $(target.dt).removeClass('viewing')

            $(this).addClass('viewing');
            $($(this).attr('href')).addClass('viewing');
        });

        $(handler.button).click(function (e){
            e.preventDefault();
            $(target.dt).removeClass('viewing');
            $(this).parent('dt').addClass('viewing');
        });
    });


})(jQuery);


// --------------------------------------------------------------------------------
// advantage interaction
// --------------------------------------------------------------------------------
(function ($) {
    $(document).on('scroll', function(e) {
        var target = $('#advInteraction')
        ,   startPosition = parseInt($(target).offset().top) - parseInt($(window).outerHeight())/2 - parseInt($(target).outerHeight())/2
        ,   scrollPosition = parseInt($(window).scrollTop())
        ;

        if (startPosition <= scrollPosition) {
            $(target).addClass('animate');
        }

    });

})(jQuery);

// 모든 리소스가 로딩 된 후  설정
(function ($) {
    $('body').addClass('loading');
    $(function () {
        $('#barrior').addClass('remove').on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){

            // modal block 삭제
            $('body').removeClass('loading').addClass('animate');
            document.getElementById('barrior').outerHTML = '';

            // body의 class 삭제
        });
    });
})(jQuery);



// --------------------------------------------------------------------------------
// hash location + smooth scrolling
// 스크롤 위치에 따른 GNB color changing (by class binding)
// policy view
// --------------------------------------------------------------------------------
(function ($) {

    function moveToHash (hash) {
        if (hash === '') { return false; }

        var hash = (function (hash) {
            return document.getElementById(hash.replace('#',''));
        })(hash);

        if (!!hash) {

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

            $('#policy,#term,#disclimer').removeClass('viewing');
            $(hash).addClass('viewing');
        }
    }

    function checkHash (hash) {
        if (location.hash === '#policy' || location.hash === '#term' || location.hash === '#disclimer') {
            return true;
        }

        return false;
    }

    function headerInteraction (target,window,wall) {
        var target = $(target)
            ,   scrollPosition = parseInt($(window).scrollTop())
            ,   changeScrollPosition = (function (wall){
                if (wall === 0 || wall === null) {
                    return 0;
                }
                if (wall.length <= 1) {
                    return parseInt($(wall).outerHeight());
                } else {
                    var sum = 0;
                    for (i in wall) {
                        sum = sum + parseInt($(wall[i]).outerHeight());
                    }

                    return sum;
                }
            })(wall)
        ;

        scrollPosition > changeScrollPosition  ?  target.addClass('invert') : target.removeClass('invert');
    }

    var _isSetClassName = true;

    function smoothScrollTo(hash, e) {
        $('body').removeClass('posting');
        $('#policy,#term,#disclimer').removeClass('viewing');
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
            // !!!! element의 길이에 따라서 스크롤 이동하는 타이밍 받도록 변경해야 됨
        }

    }

    $(function() {
        // footer의 post들을 처리
        // hash의 값은 3개안에 있는지 검사를...
        if(!!checkHash(location.hash)) {
            $('body').addClass('posting');
            moveToHash(location.hash);
        }

        //footer의 버튼들에 이동 매핑
        $('#footer .policy a').click(function () {
            $('body').addClass('posting');
            moveToHash(this.href);
        });

        // 로딩시 바인딩
        headerInteraction($('#header'),$(window),null);

        $(document).on('scroll', function(e) {
            headerInteraction($('#header'),$(window),null);
        });

        // header의 interaction 처리
        $('#header nav a[href*="#"]').not('[href="#"]').not('[href="#0"]').click(function(e) {
            $('#header a[href*="#"]').removeClass('viewing');
            $(this).addClass('viewing');
            smoothScrollTo(this.hash, e);
        });

        smoothScrollTo(location.hash);

        $(window).on('hashchange',function (e) {
            if(!!checkHash(location.hash)) {
                $('body').addClass('posting');
                moveToHash(location.hash);
                $('html,body').scrollTop(0);
            } else {
                $('body').removeClass('posting');
                $('#policy,#term,#disclimer').removeClass('viewing');
                $('html,body').scrollTop(0);
            }

            if(!checkHash(location.hash)) {
                smoothScrollTo(location.hash, e);
            }
        });
    });
})(jQuery);


// --------------------------------------------------------------------------------
// form에 focus되면 label의 position을 옆으로 옮김
// --------------------------------------------------------------------------------

(function ($) {
    $(function (){
        var target = $('#contact label+input, #contact textarea')
        ,   textarea = $('#contact textarea')

        $(target).focus(function (){
            $(this).prev('label').addClass('focused')
        });

        $(target).blur(function (){
            var $this = $(this);
            if(!$this.val()) {
                $(this).prev('label').removeClass('focused')
            }
        });
    });
})(jQuery);



// --------------------------------------------------------------------------------
// 서버리스 메일 처리
// --------------------------------------------------------------------------------
function validEmail(email) { // see:
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

function validateHuman(honeypot) {
    if (honeypot) {  //if hidden form filled up
        console.log("Robot Detected!");
        return true;
    } else {
        console.log("Welcome Human!");
    }
}

// get all data in form and return object
function getFormData() {
    var form = document.getElementById("gform");
    var elements = form.elements; // all form elements
    var fields = Object.keys(elements).filter(function(k) {
        // the filtering logic is simple, only keep fields that are not the honeypot
        return (elements[k].name !== "honeypot");
    }).map(function(k) {
        if(elements[k].name !== undefined) {
            return elements[k].name;
            // special case for Edge's html collection
        }else if(elements[k].length > 0){
            return elements[k].item(0).name;
        }
    }).filter(function(item, pos, self) {
        return self.indexOf(item) == pos && item;
    });
    var data = {};
    fields.forEach(function(k){
        data[k] = elements[k].value;
        var str = ""; // declare empty string outside of loop to allow
        // it to be appended to for each item in the loop
        if(elements[k].type === "checkbox"){ // special case for Edge's html collection
            str = str + elements[k].checked + ", "; // take the string and append
            // the current checked value to
            // the end of it, along with
            // a comma and a space
            data[k] = str.slice(0, -2); // remove the last comma and space
            // from the  string to make the output
            // prettier in the spreadsheet
        }else if(elements[k].length){
            for(var i = 0; i < elements[k].length; i++){
                if(elements[k].item(i).checked){
                    str = str + elements[k].item(i).value + ", "; // same as above
                    data[k] = str.slice(0, -2);
                }
            }
        }
    });

    // add form-specific values into the data
    data.formDataNameOrder = JSON.stringify(fields);
    data.formGoogleSheetName = form.dataset.sheet || "responses"; // default sheet name
    data.formGoogleSendEmail = form.dataset.email || ""; // no email by default

    console.log(data);
    return data;
}

function handleFormSubmit(event) {  // handles form submit without any jquery
    event.preventDefault();           // we are submitting via xhr below
    var data = getFormData();         // get the values submitted in the form

    // /* OPTION: Remove this comment to enable SPAM prevention, see README.md
    if (validateHuman(data.honeypot)) {  //if form is filled, form will not be submitted
        return false;
    }
    // */

    if( data.email && !validEmail(data.email) ) {   // if email is not valid show error
        var invalidEmail = document.getElementById("email-invalid");
        if (invalidEmail) {
            invalidEmail.style.display = "block";
            return false;
        }
    } else {
        var url = event.target.action;  //
        var xhr = new XMLHttpRequest();

        disableAllButtons(event.target);

        // jquery로 변경해야되나..
        xhr.open('POST', url);
        // xhr.withCredentials = true;
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            console.log( xhr.status, xhr.statusText )
            console.log(xhr.responseText);
            var thankYouMessage = document.getElementById("thankyou_message");
            if (thankYouMessage) {
                thankYouMessage.style.display = "block";
            }
            return;
        };
        // url encode form data for sending as post data
        var encoded = Object.keys(data).map(function(k) {
            return encodeURIComponent(k) + "=" + encodeURIComponent(data[k])
        }).join('&')
        xhr.send(encoded);
    }
}
function loaded() {
    console.log("Contact form submission handler loaded successfully.");
    // bind to the submit event of our form
    var form = document.getElementById("gform");
    form.addEventListener("submit", handleFormSubmit, false);
};

function disableAllButtons(form) {
    var buttons = form.querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }
}

document.addEventListener("DOMContentLoaded", loaded, false);
