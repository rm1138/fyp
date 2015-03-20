onmessage = function(e){
    var data = new Uint32Array(e.data.data);
    var index = e.data.index;
    var width = e.data.width;
    var height = e.data.height;
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            

            data[y * width + x] =
                (255   << 24) |    // alpha
                (Math.random() * 0xff << 16) |    // blue
                (Math.random() * 0xff <<  8) |    // green
                 Math.random() * 0xff;            // red
            
        }
    }
    self.postMessage(data.buffer, [data.buffer]);
};

