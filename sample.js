var webdriverio = require('webdriverio');
var options = require('./test/config/pepino.conf');
var Collector = require('./lib/collector');

var collect = new Collector();
var client = webdriverio.remote(options);

client
    .init()
    .execute(':startProfile')
    .url('http://localhost:8080')
    .execute(':endProfile').then(collect.cpu)
    .log('performance').then(collect.perf)
    .execute(':startProfile')
    .click('button')
    .execute(':endProfile').then(collect.cpu)
    .log('performance').then(collect.perf)
    .execute(':startProfile')
    .click('button')
    .execute(':endProfile').then(collect.cpu)
    .log('performance').then(collect.perf)
    .catch(function (e) {
    console.log(e);
}).end();
