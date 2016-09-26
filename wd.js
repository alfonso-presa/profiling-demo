var webdriverio = require('webdriverio');
var fs = require('fs');
var options = {
    port: 9515,
    logLevel: 'verbose',
    path: '/',
    host: 'localhost',
    desiredCapabilities: {
        browserName: 'chrome',
        loggingPrefs: {
            'browser':     'ALL',
            'driver':      'ALL',
            'performance': 'ALL',
            'network': 'ALL',
            'page': 'ALL'
        },
        chromeOptions: {
            perfLoggingPrefs: {
                enableNetwork: true,
                enablePage: true,
                traceCategories: '-*,ipc,devtools.timeline,disabled-by-default-devtools.timeline,disabled-by-default-devtools.timeline.frame,toplevel,blink.console,blink.user_timing,latencyInfo,disabled-by-default-devtools.timeline.stack'
            },
            debuggerAddress: 'localhost:9222'
        }
    }
};

var genericCpu = {
    cat: 'disabled-by-default-devtools.timeline',
    ph: 'I',
    name: 'CpuProfile',
    args: {}
};

var count = 1;
var cpu;

function collectCpu(data) {
    cpu = Object.assign({}, genericCpu);
    cpu.args.data = {
        cpuProfile: data.value.profile
    };
}

function collect(data) {
    var result = [];
    var ts = 0;
    data.value.forEach(function (item) {
        var msg = JSON.parse(item.message).message.params;
        if(msg.ts !== undefined) {
            ts = Math.max(msg.ts, ts);
            result.push(msg);
        }
        if(msg.name === 'UpdateLayerTree') {
            cpu.pid = msg.pid;
            cpu.tid = msg.tid;
        }
    });
    cpu.ts = ts;
    result.push(cpu);
    result.sort(function (a,b) {return a.ts > b.ts ? 1 : -1;});
    fs.writeFile('log' + (count++) + '.json', JSON.stringify(result, undefined, 2));
}

var client = webdriverio.remote(options);
client
    .init()
    .execute(':startProfile')
    .url('http://localhost:8080?10')
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
    .getTitle().then(function(title) {
        console.log('Title is: ' + title);
    })
    .end();
