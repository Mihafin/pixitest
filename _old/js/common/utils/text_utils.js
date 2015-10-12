var TextUtils = function (){};

TextUtils.prototype.get_text = function(text, width){
    var style = {
        font: '24px Arial',
        fill: '#000000',
        stroke: '#ffffff',
        strokeThickness: 1,
        //dropShadow : true,
        //dropShadowColor : '#000000',
        //dropShadowAngle : Math.PI / 6,
        //dropShadowDistance : 2,
        wordWrap: true,
        wordWrapWidth: width
    };

    return new PIXI.Text(text, style);
};

if (typeof String.prototype.toCamel !== 'function') {
    String.prototype.toCamel = function(){
        var str = this.replace(/[-_]([a-z])/g, function (g) { return g[1].toUpperCase(); });
        return str.charAt(0).toUpperCase() + str.substring(1);
    };
}