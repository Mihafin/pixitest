
// ************************************************
var ObjectBase = function (asset_name){
    PIXI.Container.call(this);

    this.loader = PIXI.loader;
    this.asset_name = asset_name;
    this.is_loaded = false;
};

ObjectBase.prototype = Object.create(PIXI.Container.prototype);
ObjectBase.prototype.constructor = ObjectBase;

ObjectBase.prototype.load = function(){
    if (this.is_loaded) return;

    this.is_loaded = true;
    this.loader.add(this.full_asset_name());
    this.loader.load(this.on_art_loaded.bind(this));
};

ObjectBase.prototype.full_asset_name = function(){
  return 'assets/objects/' + this.asset_name + '.json';
};

ObjectBase.prototype.on_art_loaded = function(loader, resources){
    //console.log(resources);
    var frames = [];
    var textures = resources[this.full_asset_name()].textures;
    var keys = Object.keys(textures).sort();

    for (var i = 0; i < keys.length; i++) {
        frames.push(textures[keys[i]]);
    }
    this.on_load(frames);
};

ObjectBase.prototype.on_load = function (frames){
    this.movie = new PIXI.extras.MovieClip(frames);
    this.movie.animationSpeed = 0.5;
    this.movie.play();
    this.addChild(this.movie);
};

// ************************************************
function Dragon() {
    //ObjectBase.call(this, 'dragon');
    ObjectBase.call(this, 'FontanAnim');
}

Dragon.prototype = Object.create(ObjectBase.prototype);
Dragon.prototype.constructor = Dragon;

// ************************************************
// ****************** tests ***********************
// ************************************************
