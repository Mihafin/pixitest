Game.init_stat = function(left, top){
    this.stats = new Stats();
    this.stats.setMode(0);// 0: fps, 1: ms, 2: mb
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.left = left ? left : '0px';
    this.stats.domElement.style.top = top ? top : '0px';
    document.getElementsByTagName("body")[0].appendChild(this.stats.domElement);
};