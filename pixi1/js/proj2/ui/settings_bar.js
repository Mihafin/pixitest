var SettingsBar = function (){
    PIXI.Container.call(this);

    this.init_sound_icon();
};

SettingsBar.prototype = Object.create(PIXI.Container.prototype);
SettingsBar.prototype.constructor = SettingsBar;

SettingsBar.prototype.init_sound_icon = function(){
    this.sound_icon = new PIXI.Sprite.fromImage("assets/proj2/fullscreen.png");
    this.sound_icon.interactive = true;
    this.sound_icon.on('click', this.sound_icon_click.bind(this));
    this.sound_icon.buttonMode = true;
    this.sound_icon.anchor = new PIXI.Point(0.5, 0.5);
    this.addChild(this.sound_icon);
};

SettingsBar.prototype.sound_icon_click = function(){
    Game.sound_utils.set_sound_state(!Game.sound_utils.is_sound_on);
    this.show_sound_on_off_anim(Game.sound_utils.is_sound_on);
};

SettingsBar.prototype.show_sound_on_off_anim = function(is_on){
    TweenLite.to(this.sound_icon, 0.5, {rotation: is_on ? 0 : Math.PI});
};