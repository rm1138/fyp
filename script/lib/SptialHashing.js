define(['lib/Util'], function (Util) {
    "use strict";

    var DEFAULT_POWER_OF_TWO = 5;

    function makeKeysFn(shift) {
        return function (obj) {
            var box = Util.getBox(obj);
            var sx = box.x >> shift,
                sy = box.y >> shift,
                ex = (box.x + box.width) >> shift,
                ey = (box.y + box.height) >> shift,
                x, y, keys = [];
            for (y = sy; y <= ey; y += 1) {
                for (x = sx; x <= ex; x += 1) {
                    keys.push("" + x + ":" + y);
                }
            }
            return keys;
        };
    }


    var SpatialHash = SpatialHash || function (power_of_two) {
        if (!power_of_two) {
            power_of_two = DEFAULT_POWER_OF_TWO;
        }
        this.getKeys = makeKeysFn(power_of_two);
        this.hash = {};
        this.list = [];
    };

    SpatialHash.prototype = {
        clear: function () {
            var i = this.hash.length;
            while (i--) {
                this.hash[i] = [];
            }
            this.list.length = 0;
        },
        getNumBuckets: function () {
            var i = this.hash.length,
                count = 0;
            while (i--) {
                if (this.hash[i].length > 0) {
                    count++;
                }
            }
            return count;
        },
        insert: function (obj) {
            var keys = this.getKeys(obj),
                i = keys.length,
                key;

            while (i--) {
                key = keys[i];
                if (this.hash[key]) {
                    this.hash[key].push(obj);
                } else {
                    this.hash[key] = [obj];
                }
            }
            this.list.push(obj);
        },
        update: function (obj) {
            this.remove(obj, obj.last);
            this.insert(obj);
        },
        remove: function (obj, oldOptions) {
            var keys = this.getKeys(oldOptions),
                i = keys.length,
                index,
                bucket,
                key;

            while (i--) {
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
        setToRerender: function (obj) {
            var result = [],
                keys, i, key;
            if (!obj) {
                return this.list;
            }
            keys = this.getKeys(obj);
            i = keys.length;

            while (i--) {
                key = keys[i];
                var bucket = this.hash[key];
                if (bucket) {
                    var j = bucket.length;
                    while (j--) {
                        bucket[j].needRender = true;
                    }
                }
            }
            return result;
        }
    };

    return SpatialHash;
});
