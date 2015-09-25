var COLOR_CNT = 6;
var MAX_FIELD_SIZE = 8;
var COR_X = 50;
var COR_Y = 50;

var ThreeMatchGameField = function(){
    PIXI.Container.call(this);
};
ThreeMatchGameField.prototype = Object.create(PIXI.Container.prototype);
ThreeMatchGameField.prototype.constructor = ThreeMatchGameField;

ThreeMatchGameField.prototype.init = function(init_data, on_load) {
    this._init_data = init_data;
    this._on_load = on_load;
    this.load_art();
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

    this.write_matrix();

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
            c.x = col * c.width + COR_X;
            c.y = row * c.height + COR_Y;
            this.addChild(c);
        }
    }
};

ThreeMatchGameField.prototype.random_cub = function(col, row, cell_type){
    var color = cell_type != 0 ? Math.floor(Math.random() * COLOR_CNT) : -1;
    return new Cube(color, col, row, cell_type);
};

//ThreeMatchGameField.prototype.on_cube_select = function (cube) {
//    if (cube.selected){
//        cube.unselect();
//        cube.rotation = 0;
//        TweenLite.to(cube, 0.5, {rotation: Math.PI, alpha: 1});
//    }
//    else {
//        cube.select();
//        cube.rotation = 0;
//        TweenLite.to(cube, 0.5, {rotation: Math.PI, alpha: 0.1});
//    }
//};
