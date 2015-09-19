var COLOR_CNT = 6;
var FIELD_SIZE = 8;
var COR_X = 50;
var COR_Y = 50;

var Scene = function(){
    PIXI.Container.call(this);
    this.loader = PIXI.loader;
    this.game_matrix = null;
};

Scene.prototype = Object.create(PIXI.Container.prototype);
Scene.prototype.constructor = Scene;

Scene.prototype.init = function (){
    for (var i = 0; i < COLOR_CNT; i++){
        PIXI.loader.add("c"+i, "assets/proj2/cub"+(i+1)+".png");
    }
    PIXI.loader.load(this.on_art_loaded.bind(this));
};

Scene.prototype.on_art_loaded = function (){
    console.log("PIXI.loader=", PIXI.loader);

    this.game_matrix = this.create_first_game_matrix();
    this.write_matrix(this.game_matrix);
};

Scene.prototype.write_matrix = function (mx){
    for(var col = 0; col < FIELD_SIZE; col++) {
        for (var row = 0; row < FIELD_SIZE; row++) {
            var c = mx[col][row];
            c.x = col * c.width + COR_X;
            c.y = row * c.height + COR_Y;
            this.addChild(c);
        }
    }
};

Scene.prototype.create_first_game_matrix = function (){
    var game_matrix = [];

    for(var col = 0; col < FIELD_SIZE; col++) {
        for(var row = 0; row < FIELD_SIZE; row++) {
            if (game_matrix[col] == null) game_matrix[col] = [];
            game_matrix[col][row] = this.random_cub(col, row);
        }
    }

    return game_matrix;
};

Scene.prototype.on_cube_select = function (cube) {
    if (cube.selected){
        cube.unselect();
        cube.rotation = 0;

        TweenLite.to(cube, 0.5, {rotation: Math.PI, alpha: 1});
    }
    else {
        cube.select();
        cube.rotation = 0;

        //TweenLite.defaultEase = Power1.easeOut;
        TweenLite.to(cube, 0.5, {rotation: Math.PI, alpha: 0.1});
        //TweenLite.from(cube, 0.5, {x: "-=50"});
        //TweenLite.to(cube.scale, 0.2, {x: 0, y: 0, delay: 0.3});

        //var tl = new TimelineLite();
        //tl.to(cube, 1, {rotation: 2 * Math.PI, alpha: 0.1});
        //tl.to(cube.scale, 0.5, {x: 0, y: 0});
    }
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

Scene.prototype.random_cub = function(col, row){
    var color = Math.floor(Math.random() * COLOR_CNT);
    return new Cube(color, col, row);
};

Scene.prototype.animate = function(){

};



Scene.prototype.on_resize = function (){

};