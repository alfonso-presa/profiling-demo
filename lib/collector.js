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
    var cpu,pid,tid,mockTracingStartedInPage;

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
        var ts = 0;
        var result = [];
        var tracingStartedInPageFound = true;

        data.value.forEach(function (item) {
            var msg = JSON.parse(item.message).message;
            var params = msg.params;
            if(msg.method === 'Tracing.dataCollected') {
                ts = Math.max(params.ts, ts);
                result.push(params);
            }
            if(params.name === 'TracingStartedInPage') {
                mockTracingStartedInPage = Object.assign({}, params);
                tracingStartedInPageFound = false;
                pid = params.pid;
                tid = params.tid;
            }
        });

        if(tracingStartedInPageFound) {
            var reference = result.find((item) => {
                return item.ts > 0 && item.tts > 0 && item.tid === tid && item.pid === pid;
            });
            mockTracingStartedInPage.ts = reference.ts;
            mockTracingStartedInPage.tts = reference.tts;
            result.push(mockTracingStartedInPage);
        }

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
