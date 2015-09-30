var CoordUtils = function(){};

CoordUtils.prototype.get_inner_coords = function(obj, global_point){
    var res = global_point;
    this._mod_coords_by_parent(res, obj.parent);
    return res;
};

CoordUtils.prototype._mod_coords_by_parent = function(res, parent){
    if (!parent) return;
    res.x = res.x - parent.x;
    res.y = res.y - parent.y;
    if (parent.parent) this._mod_coords_by_parent(res, parent.parent);
};