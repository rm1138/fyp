define(['lib/Util'], function (Util) {
    "use strict";

    var DEFAULT_POWER_OF_TWO = 5;

    var SpatialHash = SpatialHash || function (w, h, power_of_two) {
        if (!power_of_two) {
            power_of_two = DEFAULT_POWER_OF_TWO;
        }
        this.shift = power_of_two;
        this.hash = [];
    };

    SpatialHash.prototype = {
        getBuckets: function (obj) {
            if (obj.buckets) {
                return obj.buckets;
            }
            var shift = this.shift;
            var box = Util.getBox(obj);
            var sx = box.x >> shift,
                sy = box.y >> shift,
                ex = (box.x + box.width) >> shift,
                ey = (box.y + box.height) >> shift,
                x, y;
            var result = [];
            var hash = this.hash;
            for (y = sy; y <= ey; y += 1) {

                if (typeof hash[y] === "undefined") {
                    hash[y] = [];
                }
                for (x = sx; x <= ex; x += 1) {
                    if (typeof hash[y][x] === "undefined") {
                        hash[y][x] = [];
                    }
                    result.push(this.hash[y][x]);
                }
            }

            obj.buckets = result;

            return result;
        },
        insert: function (model) {
            var buckets = this.getBuckets(model.current),
                i = buckets.length;

            while (i--) {
                buckets[i].push(model);
            };
        },
        updateAndSetNearModelRerender: function (model) {
            this.removeAndSetNearModelRerender(model, model.last);
            this.insert(model);
        },
        removeAndSetNearModelRerender: function (model, last) {
            var buckets = this.getBuckets(last || model.current),
                i = buckets.length,
                j,
                bucket;
            var thisBox = Util.getBox(last);
            while (i--) {
                bucket = buckets[i];
                j = bucket.length;
                while (j--) {
                    bucket[j].needRender = true;
                    if (bucket[j] === model) {
                        bucket.splice(j, 1);
                    }
                }
            }

        }
    };

    return SpatialHash;
});
