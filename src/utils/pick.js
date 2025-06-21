function pick(object, keys){
    return keys.reduce((obj, key)=> {
        if(obj && Object.prototype.hasOwnProperty.call(object, key)){
            obj[key] = object[key];
        }
        return obj;
    }, {});
};

module.exports = pick;