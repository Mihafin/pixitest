var Scene = function(){
    PIXI.Container.call(this);
    this.interactive = true;

    var bf = new PIXI.filters.BlurFilter(); bf.blur = 1;
    var gf = new PIXI.filters.GrayFilter(); gf.gray = 0.2;
    this.blur_filter = [gf, bf];
    this.filter_add = false;
};

Scene.prototype = Object.create(PIXI.Container.prototype);
Scene.prototype.constructor = Scene;

Scene.prototype.init = function(){
    //menu
    this.right_gui = new RightGui();
    this.right_gui.y = 50;

    //window layer
    this.wnd_layer = new PIXI.Container();

    //background
    this.back = new Background();

    //field
    this.field = new Field();
    this.field.init();

    //gui manager
    this.gui = new GUI();

    //init listeners
    this
        // events for drag start
        .on('mousedown', this.on_mousedown)
        .on('touchstart', this.on_mousedown)
        // events for drag end
        .on('mouseup', this.on_mouseup)
        .on('mouseupoutside', this.on_mouseup)
        .on('touchend', this.on_mouseup)
        .on('touchendoutside', this.on_mouseup)
        // events for drag move
        .on('mousemove', this.on_mousemove)
        .on('touchmove', this.on_mousemove);

    //order
    this.addChild(this.back.back);
    this.addChild(this.field);
    this.addChild(this.right_gui);
    this.addChild(this.wnd_layer);

    this.on_resize();
};

Scene.prototype.on_resize = function(){
    this.back.on_resize();
    this.right_gui.x = Game.get_size().w - 50;
    this.gui.on_resize();
};

Scene.prototype.on_mousedown = function (mouse){
    //console.log("dw", mouse.data.global);
    this.pressed_point = mouse.data.global.clone();
};

Scene.prototype.on_mouseup = function (mouse){
    //console.log("up", mouse.data.global);
    this.pressed_point = null;
};

Scene.prototype.on_mousemove = function (mouse){
    if (this.pressed_point == null) return;

    var cur_point = mouse.data.global;
    var diff_point = new PIXI.Point(cur_point.x - this.pressed_point.x, cur_point.y - this.pressed_point.y);

    if (diff_point.x != 0 || diff_point.y != 0)
        this.pressed_point = mouse.data.global.clone();

    this.on_move(diff_point);
};

Scene.prototype.on_move = function(diff_point){
    this.back.on_move(diff_point);
    this.field.on_move(diff_point);
};

Scene.prototype.on_window_show = function(){
    if (this.filter_add) return;
    this.filter_add = true;

    this.field.filters = this.blur_filter;
    this.right_gui.filters = this.blur_filter;
    this.back.back.filters = this.blur_filter;
};

Scene.prototype.on_window_hide = function(last){
    if (!this.filter_add || !last) return;
    this.filter_add = false;

    if (this.field.filters) this.field.filters = null;
    if (this.right_gui.filters) this.right_gui.filters = null;
    if (this.back.back.filters) this.back.back.filters = null;
};

Scene.prototype.fulscreen_toggle = function (){
    Game.fullscreen_toggle();
};
