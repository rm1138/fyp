onmessage = function(e){
    var data = new Uint32Array(e.data);

    for (var y = 0; y < 1600; y++) {
        for (var x = 0; x < 2560; x++) {
            

            data[y * 2560 + x] =
                (255   << 24) |    // alpha
                (Math.random() * 0xff << 16) |    // blue
                (Math.random() * 0xff <<  8) |    // green
                 Math.random() * 0xff;            // red
            
        }
    }
    self.postMessage(data.buffer, [data.buffer]);
};

