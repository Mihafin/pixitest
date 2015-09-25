var Scene = function(){
    PIXI.Container.call(this);
    this.loading = Game.utils.text.get_text("loading..");

};

Scene.prototype = Object.create(PIXI.Container.prototype);
Scene.prototype.constructor = Scene;

Scene.prototype.init = function (){
};

Scene.prototype.start_game = function(data){
    if (this.current_game){
        this.current_game.destroy();
        this.removeChild(this.current_game);
    }

    this.show_load();
    this.current_game = new ThreeMatchGame();
    this.current_game.init(data, function(){
        this.hide_load();
        this.addChild(this.current_game);
    }.bind(this));
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