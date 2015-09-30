var COLOR_CNT = 6;
var MAX_FIELD_SIZE = 8;
var COR_X = 0;
var COR_Y = 0;
var CUBE_WIDTH = 50;
var CUBE_HEIGHT = 50;

var ThreeMatchGameField = function(){
    PIXI.Container.call(this);

    this.items = null;
    this.item_on_mouse = {};

    this.buttonMode = true;
    this.interactive = true;
};
ThreeMatchGameField.prototype = Object.create(PIXI.Container.prototype);
ThreeMatchGameField.prototype.constructor = ThreeMatchGameField;
ThreeMatchGameField.prototype.pop_sound = "assets/proj2/sounds/bubble_pop.mp3";

ThreeMatchGameField.prototype.init = function(init_data, on_load) {
    this._init_data = init_data;
    this._on_load = on_load;
    this.load_art();
    Game.sound_utils.load_sound(this.pop_sound);

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
};

ThreeMatchGameField.prototype.dispatch_mouse_event = function(name, e){
    switch(name){
        case "on_mousedown":{
            var new_down_item = this.cube_on_mouse(e.data);
            if (new_down_item == null) return;

            if (this.item_on_mouse["sel_item"] != null){
                if (new_down_item != this.item_on_mouse["sel_item"]){
                    this.try_swap(this.item_on_mouse["sel_item"], new_down_item);
                }
                else {
                    new_down_item.unselect();
                    this.item_on_mouse = {};
                }
                return;
            }
            this.item_on_mouse = {down_item: new_down_item};
            new_down_item.select();
            break;
        }
        case "on_mouseup":{
            var up_item = this.cube_on_mouse(e.data);
            if (up_item == null) {
                this.item_on_mouse = {sel_item: this.item_on_mouse.down_item};
                return;
            }

            if (this.item_on_mouse.down_item && up_item == this.item_on_mouse.down_item)
                this.item_on_mouse = {sel_item: up_item};
            else
                this.item_on_mouse = {};
            break;
        }
        case "on_mousemove":{
            if (this.item_on_mouse.down_item == null) return;

            var old_move_item = this.item_on_mouse["move_item"];
            var new_move_item = this.cube_on_mouse(e.data);
            this.item_on_mouse["move_item"] = new_move_item;
            if (new_move_item && new_move_item != this.item_on_mouse.down_item && old_move_item != new_move_item ){
                this.try_swap(this.item_on_mouse.down_item, new_move_item);
            }
            break;
        }
    }
};

ThreeMatchGameField.prototype.try_swap = function (c1, c2){
    Game.debug("try_swap", c1.toString(), c2.toString());
    this.item_on_mouse = {};

    var correct = true; //todo: check distance and others
    if (correct){
        this.swap(c1, c2);
    }
};

ThreeMatchGameField.prototype.swap = function (c1, c2){
    this.items[c1.col][c1.row] = c2;
    this.items[c2.col][c2.row] = c1;
    var c1_pos = c1.copy_position();
    var c2_pos = c2.copy_position();
    c1.move_to(c2_pos);
    c2.move_to(c1_pos);

    this.play_pop_sound();
};

ThreeMatchGameField.prototype.load_art = function () {
    if (PIXI.loader.resources['c1']){
        this.on_art_loaded(this);
        return;
    }
    for (var i = 0; i < COLOR_CNT; i++){
        PIXI.loader.add("c"+i, "assets/proj2/cub"+(i+1)+".png");
    }
    PIXI.loader.load(this.on_art_loaded.bind(this));
};

ThreeMatchGameField.prototype.on_art_loaded = function () {
    Game.debug("PIXI.loader=", PIXI.loader);

    this.items = this.write_matrix();

    this._on_load();
};

ThreeMatchGameField.prototype.is_valid_data = function(){
    return true;//todo realize
};

ThreeMatchGameField.prototype.write_matrix = function (){
    var mx = [];
    for(var col = 0; col < MAX_FIELD_SIZE; col++) {
        if (mx[col] == null) mx[col] = [];
        for (var row = 0; row < MAX_FIELD_SIZE; row++) {
            var c = this.random_cub(col, row, this._init_data['field'][row][col]);
            mx[col][row] = c;
            c.x = col * CUBE_WIDTH + COR_X;
            c.y = row * CUBE_HEIGHT + COR_Y;
            this.addChild(c);
        }
    }
    return mx;
};

ThreeMatchGameField.prototype.random_cub = function(col, row, cell_type){
    var color = cell_type != 0 ? Math.floor(Math.random() * COLOR_CNT) : -1;
    return new Cube(color, col, row, cell_type);
};

ThreeMatchGameField.prototype.cube_on_mouse = function (data){
    var col = Math.floor((data.global.x - COR_X) / CUBE_WIDTH);
    var row = Math.floor((data.global.y - COR_Y) / CUBE_HEIGHT);

    return this.items && this.items[col] ? this.items[col][row] : null;
};

ThreeMatchGameField.prototype.on_mousedown = function (e){
    this.dispatch_mouse_event("on_mousedown", e);
};

ThreeMatchGameField.prototype.on_mouseup = function (e){
    this.dispatch_mouse_event("on_mouseup", e);
};

ThreeMatchGameField.prototype.on_mousemove = function (e){
    this.dispatch_mouse_event("on_mousemove", e);
};

ThreeMatchGameField.prototype.play_pop_sound = function(){
    Game.sound_utils.play_now(this.pop_sound);
};
