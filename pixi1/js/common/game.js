var Game = {
    canvas_container: document.getElementById("content"),
    utils: {
        text: new TextUtils(),
        store: new GameStorage()
    },
    get_size: function (){
        var w = this.canvas_container.offsetWidth;
        var h = this.canvas_container.offsetHeight;
        return {w: w, h: h};
    },
    fullscreen_toggle: function(){
        if (!fullscreenEnabled()){//todo: show message
            console.log("fullscreen is not available!");
            return;
        }
        var el = fullscreenElement();
        if (el){
            cancelFullscreen();
        }
        else{
            launchFullScreen(this.canvas_container)
        }
    },
    init: function(){
        this.stats = new Stats();
        this.stats.setMode(0);// 0: fps, 1: ms, 2: mb
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '400px';
        this.stats.domElement.style.top = '0px';
        this.canvas_container.appendChild(this.stats.domElement);
        //addFulscreenEvents(this.canvas_container);
    },
    stats_begin: function (){
        Game.stats.begin();
    },
    stats_end: function (){
        Game.stats.end();
    },
    error: function(){
        if (console) console.log.apply(console, arguments);
    },
    debug: function(){
        if (console) console.log.apply(console, arguments);
    }
};