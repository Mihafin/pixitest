var RightGui = function (){
    PIXI.Container.call(this);

    var bunny = new PIXI.Sprite.fromImage("assets/basics/bunny.png");
    bunny.interactive = true;
    bunny.on('click', this.bunny_click.bind(this));
    bunny.buttonMode = true;
    bunny.y = -40;
    this.addChild(bunny);

    this.loader = PIXI.loader;
    this.loader.add(this.art_path);
    this.loader.load(this.art_loaded.bind(this));
};

RightGui.prototype = Object.create(PIXI.Container.prototype);
RightGui.prototype.constructor = RightGui;

RightGui.prototype.art_path = "assets/gui/right_gui.json";

RightGui.prototype.art_loaded = function(){
    var fulscreen =  new PIXI.Sprite(this.loader.resources[this.art_path].textures['fullscreen.png']);
    fulscreen.interactive = true;
    fulscreen.on('click', this.fulscreen_click.bind(this));
    fulscreen.buttonMode = true;
    this.addChild(fulscreen);

    var zoom_in =  new PIXI.Sprite(this.loader.resources[this.art_path].textures['zoom_in.png']);
    zoom_in.interactive = true;
    zoom_in.on('click', this.zoom_in_click.bind(this));
    zoom_in.buttonMode = true;
    zoom_in.y = 20;
    this.addChild(zoom_in);

    var zoom_out =  new PIXI.Sprite(this.loader.resources[this.art_path].textures['zoom_out.png']);
    zoom_out.interactive = true;
    zoom_out.on('click', this.zoom_out_click.bind(this));
    zoom_out.buttonMode = true;
    zoom_out.y = 40;
    this.addChild(zoom_out);
};

RightGui.prototype.bunny_click = function(){
    Game.scene.gui.show_window(DialogWindow, {main_text: 'Hello world! this is a very very very log text!'});

};

RightGui.prototype.fulscreen_click = function(){
    Game.scene.fulscreen_toggle();
};

RightGui.prototype.zoom_in_click = function(){
    Game.scene.zoom_in();
};

RightGui.prototype.zoom_out_click = function(){
    Game.scene.zoom_out();
};