var framework = 'lib/'

requirejs.config({
    baseUrl: 'script',
    paths: {
        framework: framework,
        class: framework + 'class'
    },
    urlArgs: "bust=" + (new Date()).getTime()
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['script']);
