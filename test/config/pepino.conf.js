var options = {
    logLevel: 'verbose',
    user: process.env.SAUCE_USERNAME,
    key: process.env.SAUCE_ACCESS_KEY,
    desiredCapabilities: {
        browserName: 'chrome',
        loggingPrefs: {
            performance: 'ALL'
        },
        chromeOptions: {
            perfLoggingPrefs: {
                traceCategories:
                    'toplevel,'+
                    'ipc,'+
                    '__metadata,'+
                    'devtools.timeline,'+
                    'disabled-by-default-devtools.timeline,'+
                    'v8,'+
                    'blink,'+
                    'blink_gc,'+
                    'benchmark,'+
                    'latencyInfo,'+
                    'disabled-by-default-devtools.timeline.frame,'+
                    'disabled-by-default-cc.debug.display_items,'+
                    'disabled-by-default-cc.debug.picture,'+
                    'disabled-by-default-devtools.timeline.picture,'+
                    'disabled-by-default-cc.debug,'+
                    'disabled-by-default-cc.debug.quads,'+
                    'disabled-by-default-devtools.timeline.layers,'+
                    'cc,'+
                    'blink.animations,'+
                    'input,'+
                    '-*'
            }
        }
    }
};

module.exports = options;