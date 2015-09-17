var GUI = function(){
    this.active_wnds = {};
    this.id_cntr = 0;
    this.gui_layer = Game.scene.wnd_layer;
};

GUI.prototype.show_window = function(wnd_class, params){
    var wnd_id = this.generate_id();
    console.log("show wnd, ", wnd_id);
    var wnd = new wnd_class(wnd_id, params);
    this.active_wnds[wnd_id] = wnd;
    wnd.on('show', this.on_wnd_show.bind(this));
    wnd.load();

    Game.scene.on_window_show();
    return wnd_id;
};

GUI.prototype.on_wnd_show = function(wnd){
    console.log("on_wnd_show", wnd);
    this.center_wnd(wnd);
    this.gui_layer.addChild(wnd);
};

GUI.prototype.center_wnd = function (wnd){
    var size = Game.get_size();
    wnd.x = size.w /2 - wnd.size.w / 2 + wnd.size.x;
    wnd.y = size.h /2 - wnd.size.h / 2 + wnd.size.y;
};

GUI.prototype.on_resize = function (){
    var keys = Object.keys(this.active_wnds);
    for (var i = 0; i < keys.length; i++){
        this.center_wnd(this.active_wnds[keys[i]]);
    }
};

GUI.prototype.close_window = function(wnd_id){
    this.gui_layer.removeChild(this.active_wnds[wnd_id]);
    delete this.active_wnds[wnd_id];
    console.log("Object.keys(this.active_wnds).length", Object.keys(this.active_wnds).length, this.active_wnds);
    Game.scene.on_window_hide(Object.keys(this.active_wnds).length == 0);
};

GUI.prototype.generate_id = function(){
    return ++this.id_cntr;
};