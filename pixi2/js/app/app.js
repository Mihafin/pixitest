define(["pre_loader", "i18n!nls/loader"], function (loader, loader_texts){
    var App = function(){
        loader.set_progress_text(loader_texts.loading1);
    };

    App.prototype.init = function(){
        requirejs(["scene"], function(scene){
            scene.init();
        });
    };

    return App;
});