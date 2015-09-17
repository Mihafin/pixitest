var Storage = function (){
    this.main_key = "_game_1_";
    this.is_support = this.support();
    if (!this.is_support){ console.log("storage is not support!")}
};

Storage.prototype.support = function(){
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    }
    catch (e) {
        return false;
    }
};

Storage.prototype.get = function(key){
    if (!this.is_support) return null;
    return window.localStorage[this.main_key + "." + key];
};

Storage.prototype.set = function(key, obj){
    if (!this.is_support) return;
    window.localStorage[this.main_key + "." + key] = obj;
};