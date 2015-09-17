var BaseWindow = function(id, params) {
    PIXI.Container.call(this);

    this.id = id;
    this.params = params;
};

BaseWindow.prototype = Object.create(PIXI.Container.prototype);
BaseWindow.prototype.constructor = BaseWindow;

BaseWindow.prototype.load = function(){
    this.loader = PIXI.loader;
    if (this.loader.resources[this.art_name]){
        this.art_loaded();
    }
    else{
        this.loader.add(this.art_name);
        this.loader.load(this.art_loaded.bind(this));
    }
};

BaseWindow.prototype.art_loaded = function(){
    this.trigger('show', this);
};

BaseWindow.prototype.close = function(){
    console.log("close wnd", this.id);
    Game.scene.gui.close_window(this.id);
};

BaseWindow.prototype.size = {x: 0, y: 0, w: 0, h: 0};
BaseWindow.prototype.art_name = null;

add_mix(event_mix, BaseWindow.prototype);

//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------
var DialogWindow = function(id, params){
    BaseWindow.call(this, id, params);
};
DialogWindow.prototype = Object.create(BaseWindow.prototype);
DialogWindow.prototype.constructor = DialogWindow;

DialogWindow.prototype.art_loaded = function () {
    BaseWindow.prototype.art_loaded.call(this);

    var wnd_resource = this.loader.resources[this.art_name];
    var wnd_fon =  new PIXI.Sprite(wnd_resource.textures['wnd_fon.png']);
    this.addChild(wnd_fon);

    var btn = new PIXI.Sprite(wnd_resource.textures['but_fon.png']);
    this.addChild(btn);
    btn.x = wnd_resource.data.frames['but_fon.png']['def_x'];
    btn.y = wnd_resource.data.frames['but_fon.png']['def_y'];
    btn.interactive = true;
    btn.buttonMode = true;
    btn.on("click", this.on_btn_click.bind(this));

    var txt = Game.utils.text.get_text(this.params['main_text'], 300);
    txt.x = 217;
    txt.y = 88;
    this.addChild(txt);
};

DialogWindow.prototype.on_btn_click = function(){
    this.close();
};

DialogWindow.prototype.art_name = 'assets/gui/base_wnd.json';
DialogWindow.prototype.size = {x: -40, y: 0, w: 527, h: 298};