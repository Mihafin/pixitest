var CommonApi = function (on_init) {
    this.on_init = on_init;
    this.api_params = this.init_params();
    this.user_id = this.get_user_id();
};

CommonApi.prototype = Object.create(Object.prototype);
CommonApi.prototype.constructor = CommonApi;

CommonApi.prototype.init_params = function(){
    return get_url_params();
};

CommonApi.prototype.on_api_init = function(){
    //override and call on_api_init
};

CommonApi.prototype.on_api_init = function(){
    Game.debug("api initialization succeeded");
    this.on_init.call(null);
};

CommonApi.prototype.on_api_init_error = function(){
    Game.error("api initialization failed");
};

CommonApi.prototype.load_profiles = function(profiles, cb){
    Game.debug("load_profiles call with", profiles, cb);
};

CommonApi.prototype.get_user_id = function(){
    return this.api_params["user_id"];
};


//todo move to common script
function get_url_params() {
    var query = location.search.substr(1);
    var result = {};
    query.split("&").forEach(function(part) {
        var item = part.split("=");
        result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
}


///---------------user_prof
var UserProfile = function(){
    this.first_name = "";
    this.last_name = "";
    this.img50 = "";
    this.sex = 0; //1 — женский, 2 — мужской , 0 — пол не указан.
};