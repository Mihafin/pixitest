var Game = {
    name: "pixi2.v1",
    canvas_id: "content",
    dev: true,
    width: 780,
    height: 450,
    error: function(){
        if (console) console.log.apply(console, arguments);
    },
    debug: function(){
        if (console) console.log.apply(console, arguments);
    },
    init_resources: [
        "js/proj2/game_config.js", "js/common/core/pixi.min.js", "js/common/utils/text_utils.js",
        "js/proj2/api/common.js", //должен загрудится до vk.js
        "js/proj2/api/vk.js", "//vk.com/js/api/xd_connection.js?2"
    ],
    dev_resources: ["js/common/core/stats.min.js", "js/common/init_stat.js"]
};