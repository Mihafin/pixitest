console.log("load");

requirejs.config({
    paths: {
        jquery: 'core/jquery.min'
    },
    waitSeconds: 0
});

requirejs.onError = function (err) {
    console.log("ERROR!!!!", err);
};

requirejs(["jquery", "loader", "i18n!nls/loader"], function() {
    var loader = require('loader');
    var loader_texts = require('i18n!nls/loader');

    loader.set_progress_text(loader_texts.loading1);

});
