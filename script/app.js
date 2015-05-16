requirejs.config({
    baseUrl: 'script',
    paths: {
        lib: '../script/lib'
    }
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['script']);