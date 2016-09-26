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
                traceCategories: '-*,devtools.timeline,disabled-by-default-devtools.timeline,toplevel'
            }
        }
    }
};

module.exports = options;