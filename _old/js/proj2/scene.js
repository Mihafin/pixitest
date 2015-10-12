var Scene = function(){
    PIXI.Container.call(this);
    this.loading = Game.utils.text.get_text("loading..");
    this.loading.x = Game.width / 2 - this.loading.width / 2;
    this.loading.y = Game.height / 2 - this.loading.height / 2;
    this.game_layer = new PIXI.Container();
    //this.map_layer = new PIXI.Container();
    this.gui_layer = new PIXI.Container();
};

Scene.prototype = Object.create(PIXI.Container.prototype);
Scene.prototype.constructor = Scene;

Scene.prototype.init = function (){
    Game.utils.sound.set_sound_state(Game.utils.store.get('sound') != "0");

    var deb_text = Game.utils.text.get_text(Game.social_api.me.first_name + "\n" + Game.social_api.me.last_name, 300);
    deb_text.x = Game.width - deb_text.width;
    deb_text.y = Game.height / 2;
    this.addChild(deb_text);

    var me_icon = new PIXI.Sprite.fromImage(Game.social_api.me.img50);
    me_icon.x = Game.width - 50;
    me_icon.y = 0;
    this.addChild(me_icon);


    this.game_layer.x = 40;
    this.addChild(this.game_layer);

    this.setting_bar = new SettingsBar();
    this.setting_bar.x = 20;
    this.setting_bar.y = 20;
    this.gui_layer.addChild(this.setting_bar);
    this.addChild(this.gui_layer);
};

Scene.prototype.toggle_sound = function () {
    Game.utils.sound.set_sound_state(!Game.utils.sound.is_sound_on);
    Game.utils.store.set('sound', Game.utils.sound.is_sound_on ? "1" : "0");
    return Game.utils.sound.is_sound_on;
};

Scene.prototype.start_game = function(data){
    if (this.current_game){
        this.game_over();
    }

    this.show_load();
    var game_class = this.get_game_class(data["name"]);
    this.current_game = new game_class();
    this.current_game.init(data, this.game_inited.bind(this), this.game_over.bind(this));
};

Scene.prototype.game_inited = function(){
    Game.debug("Start game!", this.current_game._init_data);
    this.hide_load();
    this.game_layer.addChild(this.current_game);
    TweenLite.from(this.current_game, 1, {alpha: 0});
};

Scene.prototype.game_over = function(){
    this.current_game.destroy();
    this.game_layer.removeChild(this.current_game);
};

Scene.prototype.get_game_class = function (name) {
    //Game.debug(name, name.toCamel(), window[name.toCamel()]);
    return window[name.toCamel()];
};

Scene.prototype.show_load = function (){
    this.addChild(this.loading);
};

Scene.prototype.hide_load = function (){
    this.removeChild(this.loading);
};

Scene.prototype.on_resize = function (){
    //
};



//Scene.prototype.found_matches = function (){
//    var matchList = [];
//
//    // search for horizontal matches
//    for (var row=0;row<FIELD_SIZE;row++) {
//        for(var col=0;col<6;col++) {
//            var match = this.getMatchHoriz(col,row);
//            if (match.length > 2) {
//                matchList.push(match);
//                col += match.length-1;
//            }
//        }
//    }
//
//    // search for vertical matches
//    for(col=0;col<FIELD_SIZE;col++) {
//        for (row=0;row<6;row++) {
//            match = this.getMatchVert(col,row);
//            if (match.length > 2) {
//                matchList.push(match);
//                row += match.length-1;
//            }
//
//        }
//    }
//    return matchList;
//};
//Scene.prototype.getMatchHoriz = function (col, row){
//    var match = new Array(grid[col][row]);
//    for(var i=1;col+i<FIELD_SIZE;i++) {
//        if (grid[col][row].type == grid[col+i][row].type) {
//            match.push(grid[col+i][row]);
//        } else {
//            return match;
//        }
//    }
//    return match;
//};
//
//Scene.prototype.getMatchVert = function (col, row){
//    var match = new Array(grid[col][row]);
//    for(var i:int=1;row+i<FIELD_SIZE;i++) {
//        if (grid[col][row].type == grid[col][row+i].type) {
//            match.push(grid[col][row+i]);
//        } else {
//            return match;
//        }
//    }
//    return match;
//};
//
//Scene.prototype.has_possible = function (){
//
//};
//Scene.prototype.on_mousedown = function (e){
//    this.dispatch_mouse_event("on_mousedown", e);
//};
//
//Scene.prototype.on_mouseup = function (e){
//    this.dispatch_mouse_event("on_mouseup", e);
//};
//
//Scene.prototype.on_mousemove = function (e){
//    this.dispatch_mouse_event("on_mousemove", e);
//};
//
//Scene.prototype.dispatch_mouse_event = function(name, e){
//    if (name != 'on_mousemove') console.log("disp_mouse", name, e.data.global);
//    if (this.current_game){
//        if (typeof this.current_game.mouse_event == 'function') this.current_game.mouse_event(name, e);
//        return;
//    }
//
//    //Game.debug("to scene");
//};