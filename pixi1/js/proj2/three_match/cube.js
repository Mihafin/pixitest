var Cube = function(color, col, row, cell_type){
    PIXI.Container.call(this);
    this.color = color;
    this.col = col;
    this.row = row;
    this.cell_type = cell_type;

    this.selected = false;

    if (cell_type == 0) return;

    var tx = PIXI.loader.resources['c'+color].texture;
    var sp = new PIXI.Sprite(tx);
    this.addChild(sp);
};

Cube.prototype = Object.create(PIXI.Container.prototype);
Cube.prototype.constructor = Cube;


Cube.prototype.select = function(){
    this.selected = true;
    if (!this.filters || this.filters.length == 0)
        this.filters = [new GlowFilter(1000, 1000, 15, 2, 1, 0xFFFFFF, 0.5)];
};

Cube.prototype.unselect = function(){
    this.selected = false;
    this.filters = null;
};

Cube.prototype.move_to = function(cube_position){
    this.unselect();
    TweenLite.to(this, 0.5, {x: cube_position.x, y: cube_position.y});
    this.col = cube_position.col;
    this.row = cube_position.row;
};

Cube.prototype.copy_position = function(){
    return {col: this.col, row: this.row, x: this.x, y: this.y};
};

Cube.prototype.toString = function(){
    return "col=" + this.col + " row=" + this.row + " type=" + this.cell_type + " color=" + this.color;
};