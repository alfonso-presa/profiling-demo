var fs = require('fs');

function Collector(name) {
    name = name ? 'log' + '-' + name : 'log';

    var genericCpu = {
        cat: 'disabled-by-default-devtools.timeline',
        ph: 'I',
        name: 'CpuProfile',
        args: {}
    };

    var count = 1;
    var cpu,pid,tid;

    this.cpu = function (data) {
        // For some reason sometimes collecting cpu profiling fails in ChromeDriver
        if(data.message) { //Means it's an error Object
            console.warn('-> Trying to recover from error!!');
            var msg = data.message;
            msg = msg.substring(msg.indexOf('{'), msg.lastIndexOf('}')+1);
            var recovered = JSON.parse(msg);
            data = {
                value: recovered.result
            };
        }

        cpu = Object.assign({}, genericCpu);
        cpu.args.data = {
            cpuProfile: data.value.profile
        };
    }

    this.perf = function (data) {
        var result = [];
        var ts = 0;
        var filter = true;
        var exclude = {};

        data.value.forEach(function (item) {
            var msg = JSON.parse(item.message).message;
            var params = msg.params;
            if(msg.method === 'Tracing.dataCollected') {
                ts = Math.max(params.ts, ts);
                result.push(params);
            }
            if(params.name === 'TracingStartedInPage') {
                filter = false;
                pid = params.pid;
                tid = params.tid;
            }
            if(params.name === 'thread_name' && params.args && params.args.name === 'CrRendererMain') {
                exclude[params.pid + '-' + params.tid] = true;
            }
        });

        result = filter ? result.filter(function (item) {
            return (item.pid === pid && item.tid === tid) || !exclude[item.pid + '-' + item.tid];
        }) : result;

        if(cpu) {
            cpu.ts = ts;
            cpu.pid = pid;
            cpu.tid = tid;
            result.push(cpu);
        }
        result.sort(function (a,b) {return a.ts > b.ts ? 1 : -1;});
        fs.writeFile(name + (count++) + '.json', JSON.stringify(result, undefined, 2));
    }
}

module.exports = Collector;
