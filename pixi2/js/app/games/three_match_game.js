define(["games/three_match/field"], function (ThreeMatchGameField) {
    var ThreeMatchGame = function(){
        PIXI.Container.call(this);

        this._ready_cb = null;
        this._end_cb = null;
        this._init_data = null;
        this._game_field = null;
    };

    ThreeMatchGame.prototype = Object.create(PIXI.Container.prototype);
    ThreeMatchGame.prototype.constructor = ThreeMatchGame;

    ThreeMatchGame.prototype.init = function(data, on_ready_cb, on_end_cb) {
        this._ready_cb = on_ready_cb;
        this._end_cb = on_end_cb;
        this._init_data = data;
        this._game_field = new ThreeMatchGameField();
        this._game_field.init(data, this.show_game.bind(this));
    };

    ThreeMatchGame.prototype.show_game = function(){
        var is_valid_data = this._game_field.is_valid_data();
        if (!is_valid_data) {
            console.log("check_field_data error", this._init_data);
            this._end_cb({code: -1, msg: "check_field_data error"});
            return;
        }

        this.addChild(this._game_field);
        this._ready_cb();
    };

    ThreeMatchGame.prototype.destroy = function(){
        console.log("destroy", this);
        if (this._game_field && this._game_field.parent == this){
            this.removeChild(this._game_field);
        }
    };

    return ThreeMatchGame;
});