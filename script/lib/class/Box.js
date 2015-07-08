define(function () {
    var Box = function (x, y, width, height) {
        this.x = Math.max(0, x);
        this.y = Math.max(0, y);
        this.width = width;
        this.height = height;
    }

    Box.prototype = {
        toString: function () {
            return "" + this.x + this.y + this.width + this.height;
        }
    }
    return Box;
})
