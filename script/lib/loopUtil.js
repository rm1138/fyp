define(function () {
    var loopUtil = {
        //Duff's Device Credit: Jeff Greenberg

        fastLoop: function (arr, func) {
            if (typeof arr === "object") {
                var keys = Object.keys(arr);
                var iterations = keys.length % 8;
                i = keys.length - 1;

                while (iterations) {
                    func(arr[keys[i--]]);
                    iterations--;
                }

                iterations = Math.floor(keys.length / 8);

                while (iterations) {
                    func(arr[keys[i--]]);
                    func(arr[keys[i--]]);
                    func(arr[keys[i--]]);
                    func(arr[keys[i--]]);
                    func(arr[keys[i--]]);
                    func(arr[keys[i--]]);
                    func(arr[keys[i--]]);
                    func(arr[keys[i--]]);
                    iterations--;
                }
            } else {
                console.trace();
                var iterations = arr.length % 8;

                i = arr.length - 1;

                while (iterations) {
                    func(arr[i--]);
                    iterations--;
                }

                iterations = Math.floor(arr.length / 8);

                while (iterations) {
                    func(arr[i--]);
                    func(arr[i--]);
                    func(arr[i--]);
                    func(arr[i--]);
                    func(arr[i--]);
                    func(arr[i--]);
                    func(arr[i--]);
                    func(arr[i--]);
                    iterations--;
                }

            }
        }
    }
    return loopUtil;
});
