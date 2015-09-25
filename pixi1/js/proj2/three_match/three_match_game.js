var ThreeMatchGame = function(){
    PIXI.Container.call(this);

    this._ready_cb = null;
    this._init_data = null;
    this._game_field = null;
};

ThreeMatchGame.prototype = Object.create(PIXI.Container.prototype);
ThreeMatchGame.prototype.constructor = ThreeMatchGame;

ThreeMatchGame.prototype.init = function(data, on_ready_cb) {
    this._ready_cb = on_ready_cb;
    this._init_data = data;
    this._game_field = new ThreeMatchGameField();
    this._game_field.init(data, this.show_game.bind(this));
};

ThreeMatchGame.prototype.show_game = function(){
    var is_valid_data = this._game_field.is_valid_data();
    if (!is_valid_data) {
        Game.error("check_field_data error", this._init_data);
        return;
    }

    Game.debug("start game!", this._init_data);
    this.addChild(this._game_field);
    this._ready_cb();
};

ThreeMatchGame.prototype.destroy = function(){
    Game.debug("destroy", this);
    if (this._game_field && this._game_field.parent == this){
        this.removeChild(this._game_field);
    }
};

//TweenLite.defaultEase = Power1.easeOut;
//TweenLite.from(cube, 0.5, {x: "-=50"});
//TweenLite.to(cube.scale, 0.2, {x: 0, y: 0, delay: 0.3});
//var tl = new TimelineLite();
//tl.to(cube, 1, {rotation: 2 * Math.PI, alpha: 0.1});
//tl.to(cube.scale, 0.5, {x: 0, y: 0});
//Scene.prototype.write_matrix = function (mx){
//    for(var col = 0; col < FIELD_SIZE; col++) {
//        for (var row = 0; row < FIELD_SIZE; row++) {
//            var c = mx[col][row];
//            c.x = col * c.width + COR_X;
//            c.y = row * c.height + COR_Y;
//            this.addChild(c);
//        }
//    }
//};
//Scene.prototype.create_first_game_matrix = function (){
//    var game_matrix = [];
//
//    for(var col = 0; col < FIELD_SIZE; col++) {
//        for(var row = 0; row < FIELD_SIZE; row++) {
//            if (game_matrix[col] == null) game_matrix[col] = [];
//            game_matrix[col][row] = this.random_cub(col, row);
//        }
//    }
//
//    return game_matrix;
//};