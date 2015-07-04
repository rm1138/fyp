var framework = 'lib/'

requirejs.config({
    baseUrl: 'script',
    paths: {
        framework: framework,
        class: framework + 'class'
    }
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['script']);