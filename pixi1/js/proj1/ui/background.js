var Background = function(){
    this.back = new PIXI.extras.TilingSprite.fromImage('assets/basics/Background.jpg', 0, 0);
};

Background.prototype.on_move = function (diff_point){
    this.back.tilePosition.x += diff_point.x;
    this.back.tilePosition.y += diff_point.y;
};

Background.prototype.on_resize = function (){
    var size = Game.get_size();
    this.back.width = size.w;
    this.back.height = size.h;
};