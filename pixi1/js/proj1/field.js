var Field = function(){
    PIXI.Container.call(this);

    this.graphics = new PIXI.Graphics();
};

Field.prototype = Object.create(PIXI.Container.prototype);
Field.prototype.constructor = Field;

Field.prototype.init = function(){
    this.addChild(this.graphics);
    this.draw_field_square(200, 200);

    var dragon = new Dragon();
    dragon.load();
    //dragon.load_from_json({x: 10, y: 10});
    this.addChild(dragon);
    dragon.x = 200;
    dragon.y = -100;
    //dragon.interactive = true;
    //dragon.buttonMode = true;
    //console.log(dragon);
};

Field.prototype.on_move = function (diff_point){
    this.x += diff_point.x;
    this.y += diff_point.y;
};

Field.prototype.draw_field_square = function(width, height){
    this.graphics.lineStyle(2, 0xffd900, 0.75);
    this.graphics.moveTo(0,0);
    this.graphics.lineTo(width*2, -height);
    this.graphics.lineTo(width*4, 0);
    this.graphics.lineTo(width*2, height);
};

//zoom
//this.scale.set(2);



