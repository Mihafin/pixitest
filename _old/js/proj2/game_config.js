
Game.game_resources = [
    "js/common/core/TweenLite.min.js",
    "js/common/core/TimelineLite.min.js",
    "js/common/utils/common_utils.js",
    "js/proj2/scene.js",
    "js/proj2/ui/settings_bar.js",
    "js/common/utils/storage.js",
    "js/common/utils/sound_utils.js",

    //game1
    "js/common/filters/glow.js",
    "js/proj2/three_match/three_match_game.js",
    "js/proj2/three_match/three_match_game_field.js",
    "js/proj2/three_match/cube.js"
];

Game.init = function(){
    Game.utils = {
        text: new TextUtils(),
        store: new GameStorage(Game.name),
        coords: new CoordUtils(),
        sound: new SoundUtils()
    };

    while (Game.canvas_container.firstChild) {
        Game.canvas_container.removeChild(Game.canvas_container.firstChild);
    }

    Game.debug("Game inited!");
};