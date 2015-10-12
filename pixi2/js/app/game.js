define(["pixi", "ui/settings", "games/three_match_game"], function(__, SettingsBar, tmg){
    var Game = function(){
        PIXI.Container.call(this);

        this.game_layer = new PIXI.Container();
        //this.map_layer = new PIXI.Container();
        this.gui_layer = new PIXI.Container();
    };

    Game.prototype = Object.create(PIXI.Container.prototype);
    Game.prototype.constructor = Game;

    Game.prototype.init = function (){
        console.log("game init");
        this.game_layer.x = 40;
        this.addChild(this.game_layer);

        this.setting_bar = new SettingsBar();
        this.setting_bar.x = 20;
        this.setting_bar.y = 20;
        this.gui_layer.addChild(this.setting_bar);
        this.addChild(this.gui_layer);

        //----test game----
        var res=[];for(var i=0;i<8;i++){res.push("11111111")}
        var game_data = {name: "three_match_game", field: res};
        this.start_game(game_data);
        //--------
    };

    Game.prototype.start_game = function(data){
        console.log("start game", data);
        if (this.current_game){
            this.game_over();
        }
        //
        //this.show_load();
        var game_class = this.get_game_class(data["name"]);
        this.current_game = new game_class();
        this.current_game.init(data, this.game_inited.bind(this), this.game_over.bind(this));
    };

    Game.prototype.game_inited = function(){
        console.log("game_inited", this.current_game._init_data);
        //this.hide_load();
        this.game_layer.addChild(this.current_game);
        TweenLite.from(this.current_game, 1, {alpha: 0});
    };

    Game.prototype.game_over = function(){
        this.current_game.destroy();
        this.game_layer.removeChild(this.current_game);
    };

    Game.prototype.get_game_class = function (name) {
        return require("games/" + name);
    };

    return Game;
});