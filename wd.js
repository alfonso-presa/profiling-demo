var webdriverio = require('webdriverio');
var options = require('./test/config/pepino.conf');
var Collector = require('./lib/collector');

var client = webdriverio.remote(options);

var browser = client.init();

var fws = ['polymer','angularjs'];
var collect = new Collector();

for(var i in fws) {
    function handleError(error) {
        console.error(error);
        process.exit(1);
    }

    var fw = fws[i];

    browser = browser
        .execute(':startProfile')
            .url('http://todomvc.com/examples/'+fw+'/')
            .waitForVisible('#new-todo',3000).catch(handleError)
        .execute(':endProfile').then(collect.cpu).catch(collect.cpu)
        .log('performance').then(collect.perf)
        .execute(':startProfile')
            .setValue('#new-todo', 'Something to do').keys('\n')
            .waitForVisible('input.toggle',3000).catch(handleError)
        .execute(':endProfile').then(collect.cpu).catch(collect.cpu)
        .log('performance').then(collect.perf)
        .execute(':startProfile')
            .click('input.toggle')
            .click('#clear-completed').catch(handleError)
        .execute(':endProfile').then(collect.cpu).catch(collect.cpu)
        .log('performance').then(collect.perf).catch(handleError);
}

browser.catch(function (e) {
    console.log(e);
}).end();
