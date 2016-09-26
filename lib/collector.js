var fs = require('fs');

function Collector() {
    var genericCpu = {
        cat: 'disabled-by-default-devtools.timeline',
        ph: 'I',
        name: 'CpuProfile',
        args: {}
    };

    var count = 1;
    var cpu,pid,tid;

    this.cpu = function (data) {
        cpu = Object.assign({}, genericCpu);
        cpu.args.data = {
            cpuProfile: data.value.profile
        };
    }

    this.perf = function (data) {
        var result = [];
        var ts = 0;
        var filter = true;
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
}

module.exports = Collector;
