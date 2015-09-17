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