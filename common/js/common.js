// タッチデバイス判定用
var touchDevice;

if("ontouchend" in window){
    touchDevice = true;// タッチデバイス
}else{
    touchDevice = false;// PC
}

// タッチデバイスの場合bodyにclass「touchDevice」追加
jQuery(function () {
    if(touchDevice){
        $("body").addClass("touchDevice");
    }
});

// タッチデバイスの場合にページ内リンクがキチンと動くように
var flag;
$('a').bind( 'touchstart', function(){
    flag = true;
}).bind( 'touchmove', function(){
    flag = false;
}).bind( 'touchend', function(e){
    linkEvent(this,e);
    flag = false;
});

function linkEvent(self,e){
    if(flag){
        var url = $(self).attr('href'),
        $target = $(url);
        if ($target.length) {
            e.preventDefault();
            $(window).scrollTop($target.offset().top);
            return false;
        }
    }
}

// PC・スマホ切り替え
var vd = localStorage.getItem("viewDevice09");

$(function(){

    $('#swPC').click(function(){
        localStorage.setItem("viewDevice09", "pc");
        location.reload();
    });

    $('#swSP').click(function(){
        localStorage.setItem("viewDevice09", "sp");
        location.reload();
    });

    $('#swClear').click(function(){
        localStorage.clear();
        location.reload();
    });

    if( vd == "pc" ){
        $('head').prepend('<meta name="viewport" content="width=1024">');
    } else if( oldAndroid ) {
        $('head').prepend('<meta name="viewport" content=”width=device-width,initial-scale=1,user-scalable=no”>');
    } else if( vd == "sp" || deviceW < tabletW || windowW < tabletW) {
        $('head').prepend('<meta name="viewport" content=”width=device-width,initial-scale=1,minimal-ui”>');
    } else {
        $('head').prepend('<meta name="viewport" content=”width=device-width,minimal-ui”>');
    }
});


// ウインドウ幅検査
var resizeTimer = false;// ウインドウリサイズ感知用タイマー
var windowW = $(window).width();// ウインドウの幅を取得
var deviceW = screen.width;// モニターの幅を取得
var tabletW = 768;// タブレット幅
var pcW = 1000;// PC幅

function pageWidthCheck(){
    if(deviceW < tabletW || windowW < tabletW){
        windowSize = "windowSP";
    } else if( windowW >= tabletW && pcW > windowW || deviceW == tabletW) {// タブレットサイズ
        windowSize = "windowTablet";
    } else if( windowW > pcW) {// PCサイズ
        windowSize = "windowPC";
    } else {// スマホ
        windowSize = "windowSP";
    }

}

jQuery(function () {
    pageWidthCheck();
    endMark();
    Menus();
});

$(window).resize(function() {
    if(deviceW > pcW && ieVer != "ie8" && !oldAndroid){
        if (resizeTimer !== false) {
            clearTimeout(resizeTimer);
        }
        resizeTimer = setTimeout(function() {
        location.reload();
        }, 200);
    }
});

// Android調査
var ua = navigator.userAgent;
if( ua.search(/Android 2/) != -1) {
    var oldAndroid = true;
} else if( ua.search(/Android 4/) != -1 || ua.search(/Android 5/) != -1 || ua.search(/Android 6/) != -1) {
    var newAndroid = true;
}

// IE調査
var ieVer = $('html').attr('class');

// メインメニュー
function navPC(){
    var menuLinkChild = $("nav > ul > li > ul");
    $("nav li:has(ul) > a").addClass("parent").after("<span>▼</span>");

    var menuLink = $("nav > ul > li > span");

    // 読み込み時、子メニューを隠す
    menuLinkChild.css("display","none");

    var menuTablet = function () {
        menuLinkChild.css("display","none");

        if($(this).hasClass("selected")){
            menuLink.removeClass("selected");
        }else {
            menuLink.removeClass("selected");
            $(this).next("ul").css("display","block");
            $(this).addClass("selected");
        }
    }
    menuLink.click(menuTablet);

}

function navSP(){
    var navView = false;
    var menuSP = $('nav:not([class="index"]) ul');

    $('nav:not([class="index"])').prepend("<h2></h2>");
    menuSP.css("display","none");

    $('nav:not([class="index"]) h2, nav:not([class="index"]) a').click(function(){
        if(!navView){
            menuSP.css("display","block");
            navView = true;
        } else {
            menuSP.css("display","none");
            navView = false;
        }
    });
}

function Menus(){
    if(touchDevice){
        var vd = localStorage.getItem("viewDevice09");
        if(vd == "pc" || windowSize == "windowTablet"){
        navPC();
        }else if(vd == "sp"){
        navSP();
        } else {
        navSP();
        }
    } else {
        if( windowSize == "windowSP" ){
            navSP();
        } else {
            navPC();
        }
    }

}

// 古い環境のナビ隠し
if(touchDevice){
    window.addEventListener("load", function() {
    setTimeout(scrollBy, 100, 0, 1);
    }, false);
}

// タッチデバイスの場合、電話リンク
jQuery(function () {
    if(touchDevice){
        $(".tel").each(function(){
            var str = $(this).text();
            $(this).html($('<a>').attr('href', 'tel:' + str.replace(/-/g, '')).append(str + '</a>'));
        });
    }
});


function endMark(){
$(".col1-3-3 img:nth-of-type(3n)").addClass("end");

if(windowSize == "windowPC" || vd == "pc"){
    $(".col1-2-4 article:nth-of-type(4n), .col2-2-4 article:nth-of-type(4n), .col1-2-3 article:nth-of-type(3n)").addClass("end");
if(ieVer == "ie8"){
    $(".col1-2-4 article:nth-of-type(4n)+article, .col2-2-4 article:nth-of-type(4n)+article, .col1-2-3 article:nth-of-type(3n)+article").addClass("newLine");
    }
}else{
    $(".col1-2-4 article:nth-of-type(2n),.col2-2-4 article:nth-of-type(2n), .col1-2-3 article:nth-of-type(2n)").addClass("end");
}

$("div.img dl:nth-of-type(2n)").addClass("end");
};


// ページスクロール
jQuery(function(){
$('a[href^=#]').click(function(){
var target;
target = $( $(this).attr('href') );
if (target.length == 0) {
return;
}
$('html, body').animate({scrollTop: target.offset().top});
return false;
});
});

