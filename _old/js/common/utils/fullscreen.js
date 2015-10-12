//Запустить отображение в полноэкранном режиме
function launchFullScreen(element) {
    if(element.requestFullScreen) {
        element.requestFullScreen();
    } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if(element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
}

// Выход из полноэкранного режима
function cancelFullscreen() {
    if(document.cancelFullScreen) {
        document.cancelFullScreen();
    } else if(document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if(document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    }
}

var onFullscreenChange = function(e){
    var fullscreenElement = document.fullscreenElement || document.mozFullscreenElement || document.webkitFullscreenElement;
    var fullscreenEnabled = document.fullscreenEnabled || document.mozFullscreenEnabled || document.webkitFullscreenEnabled;
    console.log('fullscreenEnabled = ' + fullscreenEnabled, ',  fullscreenElement = ', fullscreenElement, ',  e = ', e);
};

function fullscreenEnabled(){
    return document.fullscreenEnabled || document.mozFullscreenEnabled || document.webkitFullscreenEnabled;
}

function fullscreenElement(){
    return document.fullscreenElement || document.mozFullscreenElement || document.webkitFullscreenElement;
}

// Событие об изменениии режима
function addFulscreenEvents(el, cb){
    console.log("add fs events", el);
    el.addEventListener("webkitfullscreenchange", cb || onFullscreenChange);
    el.addEventListener("mozfullscreenchange",    cb || onFullscreenChange);
    el.addEventListener("fullscreenchange",       cb || onFullscreenChange);
}

