
define(function(){
  
    var DEFAULT_POWER_OF_TWO = 5;
  
    function makeKeysFn(w, h, shift) {
        return function(obj) {
            var sx = obj.x >> shift,
            sy = obj.y >> shift,
            ex = (obj.x + obj.width) >> shift,
            ey = (obj.y + obj.height) >> shift,
            x, y, keys = [];
            for(y=sy; y<=ey; y+=) {
                for(x=sx; x<=ex; x+=) {
                    keys.push(y * w + x);
                }
            }
            return keys;
        };
    }  
  

    var SpatialHash = SpatialHash || function (w, h, power_of_two) {
        if (!power_of_two) {
            power_of_two = DEFAULT_POWER_OF_TWO;
        }
        this.getKeys = makeKeysFn(w, h, power_of_two);
        this.hash = [];
        this.list = [];
    };
    
    SpatialHash.prototype = {
        clear: function() {
            var i = this.hash.length;
            while(i--){
                this.hash[i] = [];
            }
            this.list.length = 0;
        },
        getNumBuckets: function() {
            var i = this.hash.length,
                count = 0;
            while(i--){
                if (this.hash[i].length > 0) {
                    count++;
                }
            }
            return count;
        },
        insert: function(obj) {
            var keys = this.getKeys(obj),
                i = keys.length,
                key;

            while(i--) {
                key = keys[i];
                if (this.hash[key]) {
                    this.hash[key].push(obj);
                } else {
                    this.hash[key] = [obj];
                } 
            }
            this.list.push(obj);
        },
        update: function(obj) {
            this.remove(obj);
            this.add(obj);
        },
        remove: function(obj) {
            var keys = this.getKeys(obj),
                i = keys.length,
                index,
                bucket,
                key;

            while(i--) {
                key = keys[i];
                bucket = this.hash[key];
                if (bucket) {
                    index = bucket.indexOf(obj);
                    bucket.splice(index, 1);
                }
            }
            index = this.list.indexOf(obj);
            this.list.splice(index, 1);
        },
        retrieve: function(obj) {
            var result = [], keys, i, key;
            if (!obj) {
                return this.list;
            }
            keys = this.getKeys(obj);
            i = keys.length;

            while(i--) {
                key = keys[i];
                if (this.hash[key]) {
                    result = result.concat(this.hash[key]);
                }          
            }

            return result;
        }
    };

    
  
    SpatialHash.prototype.retrieve = function(obj) {
        var result = [], keys, i, key;
        if (!obj) {
            return this.list;
        }
        keys = this.getKeys(obj);
        i = keys.length;
        
        while(i--) {
            key = keys[i];
            if (this.hash[key]) {
                result = result.concat(this.hash[key]);
            }          
        }

        return result;
    };
  
    return SpatialHash;
}}