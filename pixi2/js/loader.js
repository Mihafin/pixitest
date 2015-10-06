define(["jquery"], function($){
    console.log("take loader", arguments);
    return {
        set_progress_text: function(txt){
            $("#progress_txt").html(txt);
        }
    };
});