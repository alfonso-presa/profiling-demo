var webdriverio = require('webdriverio');
var fs = require('fs');
var options = require('./test/config/pepino.conf.js');

var genericCpu = {
    cat: 'disabled-by-default-devtools.timeline',
    ph: 'I',
    name: 'CpuProfile',
    args: {}
};

var count = 1;
var cpu,pid,tid;

function collectCpu(data) {
    cpu = Object.assign({}, genericCpu);
    cpu.args.data = {
        cpuProfile: data.value.profile
    };
}

function collect(data) {
    var result = [];
    var ts = 0;
    var filter = true;
    data.value.forEach(function (item) {
        var msg = JSON.parse(item.message).message.params;
        if(msg.ts !== undefined) {
            ts = Math.max(msg.ts, ts);
            result.push(msg);
        }
        if(msg.name === 'TracingStartedInPage') {
            filter = false;
            pid = msg.pid;
            tid = msg.tid;
        }
    });

    result = filter ? result.filter(function (item) {
        return item.pid === pid && item.tid === tid;
    }) : result;

    cpu.ts = ts;
    cpu.pid = pid;
    cpu.tid = tid;
    result.push(cpu);
    result.sort(function (a,b) {return a.ts > b.ts ? 1 : -1;});
    fs.writeFile('log' + (count++) + '.json', JSON.stringify(result, undefined, 2));
}

var client = webdriverio.remote(options);
client
    .init()
    .execute(':startProfile')
    .url('http://localhost:8080')
    .execute(':endProfile').then(collectCpu)
    .log('performance').then(collect)
    .execute(':startProfile')
    .click('button')
    .execute(':endProfile').then(collectCpu)
    .log('performance').then(collect)
    .execute(':startProfile')
    .click('button')
    .execute(':endProfile').then(collectCpu)
    .log('performance').then(collect)
    .end();
