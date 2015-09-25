var Cube = function(color, col, row, cell_type){
    PIXI.Container.call(this);
    this.color = color;
    this.col = col;
    this.row = row;
    this.cell_type = cell_type;

    this.width = 55;
    this.height = 55;
    this.selected = false;

    if (cell_type == 0) return;

    var tx = PIXI.loader.resources['c'+color].texture;
    var sp = new PIXI.Sprite(tx);
    sp.anchor.x = 0.5;
    sp.anchor.y = 0.5;
    this.addChild(sp);

    this.interactive = true;
    this.buttonMode = true;

    this.on("click", this.on_click.bind(this));
};

Cube.prototype = Object.create(PIXI.Container.prototype);
Cube.prototype.constructor = Cube;

Cube.prototype.on_click = function (){
    Game.scene.on_cube_select(this);
};

Cube.prototype.select = function(){
    this.selected = true;
    //if (!this.filters || this.filters.length == 0)
    //    this.filters = [new GlowFilter(1000, 1000, 15, 2, 1, 0xFFFFFF, 0.5)];
};

Cube.prototype.unselect = function(){
    this.selected = false;
    //this.filters = null;
};

Cube.prototype.play_hide = function(){

};