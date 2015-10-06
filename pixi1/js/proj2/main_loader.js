var progress = document.getElementById("progress_txt");
function set_progress(txt){
    progress.innerHTML = txt;
}

var ResourceLoader = {
    res_loaded: 0,
    all_list: null,
    log_prefix: "",
    cb: null,

    init: function(log_pref, res_list, cb_func){
        this.res_loaded = 0;
        this.log_prefix = log_pref;
        this.cb = cb_func;
        this.all_list = res_list;
    },

    load_resources: function (log_pref, res_list, cb_func){
        this.init(log_pref, res_list, cb_func);
        this.res_load_progress(0, this.all_list.length);
        this.start_load();
    },

    start_load: function(){
        for (var i = 0; i < this.all_list.length; i++){
            load_script(this.all_list[i], this.on_resource_loaded.bind(this));
        }
    },

    res_load_progress: function(cur, all){
        set_progress(this.log_prefix + " (" + cur + "/" + all + ")..");
    },

    on_resource_loaded: function(){
        this.res_loaded++;
        this.res_load_progress(this.res_loaded, this.all_list.length);
        if (this.res_loaded == this.all_list.length){
            this.cb();
        }
    }
};

ResourceLoader.load_resources("Загрузка игры", ["js/proj2/game.js"], init_game);

function init_game(){
    Game.debug("Game", Game);

    Game.canvas_container = document.getElementById(Game.canvas_id);
    var res_list = Game.init_resources;
    if (Game.dev) res_list = res_list.concat(Game.dev_resources);

    ResourceLoader.load_resources("Загрузка ресурсов", res_list, init_resources_loaded);
}

function init_resources_loaded(){
    set_progress("Инициализация api..");
    Game.social_api = new SocialApi(on_api_init);
    Game.social_api.init_api();
    Game.debug("Game.social_api=", Game.social_api);
}

function on_api_init(){
    Game.social_api.load_profiles([Game.social_api.user_id], function(result){
        Game.social_api.me = result[0];
        //load user from server
        ResourceLoader.load_resources("Загрузка классов", Game.game_resources, game_resources_loaded);
    });
}

function game_resources_loaded(){
    if (Game.dev) Game.init_stat("700px");
    Game.init();

    Game.scene = new Scene();
    Game.scene.init();

    var renderer = PIXI.autoDetectRenderer(Game.width, Game.height, {backgroundColor: 0xcccccc});
    Game.canvas_container.appendChild(renderer.view);

    animate();
    function animate() {
        if (Game.stats) Game.stats.begin();
        if (Game.scene) renderer.render(Game.scene);
        if (Game.stats) Game.stats.end();
        requestAnimationFrame(animate);
    }


    //----test game----
    var res=[];for(var i=0;i<8;i++){res.push("11111111")}
    var game_data = {name: "three_match_game", field: res};
    Game.scene.start_game(game_data);
    //--------
}



