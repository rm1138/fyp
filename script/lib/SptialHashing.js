define(['lib/Util'], function (Util) {
    "use strict";

    var DEFAULT_POWER_OF_TWO = 5;

    var SpatialHash = SpatialHash || function (power_of_two) {
        if (!power_of_two) {
            power_of_two = DEFAULT_POWER_OF_TWO;
        }
        this.shift = power_of_two;
        this.hash = {};
    };

    SpatialHash.prototype = {
        getKeys: function (obj) {
            if (obj.keys) {
                return obj.keys;
            }
            var shift = this.shift;
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

            obj.keys = keys;
            return keys;
        },
        insert: function (model) {
            var keys = this.getKeys(model.current),
                i = keys.length,
                key;

            while (i--) {
                key = keys[i];
                if (this.hash[key]) {
                    this.hash[key].push(model);
                } else {
                    this.hash[key] = [model];
                }
            }
        },
        updateAndSetNearModelRerender: function (model) {
            this.removeAndSetNearModelRerender(model, model.last);
            this.insert(model);
        },
        removeAndSetNearModelRerender: function (model, last) {
            var oldKey = this.getKeys(last || model.current),
                i = oldKey.length,
                j,
                bucket;
            var thisBox = Util.getBox(last);
            while (i--) {
                bucket = this.hash[oldKey[i]];
                if (typeof bucket !== "undefined") {
                    j = bucket.length;
                    while (j--) {
                        bucket[j].needRender = true;
                        if (bucket[j] === model) {
                            bucket.splice(j, 1);
                        }
                    }
                }
            }

        }
    };

    return SpatialHash;
});
