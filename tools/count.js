var fs = require('fs');
var parsedJSON = require(process.argv[2]);

var diffs = {};

var filter = {
    "args": {
      "src_file": "../../base/trace_event/trace_log.cc",
      "src_func": "SetEnabled"
    }
}

var candidates = {};
var candidates2 = {};
var splits = {};

parsedJSON.forEach(function (item) {
    var key = '' + item.pid + '-' + item.tid;
    /*if(item.args.src_file === filter.args.src_file && item.args.src_func === filter.args.src_func) {
        candidates[key] = true;
    }*/
    if(item.name === 'UpdateLayerTree') {
        candidates[key] = true;
    }
    if(!diffs[key]) {
        diffs[key] = 0;
        splits[key] = []
    }

    splits[key].push(item);

    diffs[key]++;
});

console.log(JSON.stringify(diffs, undefined, 2));
console.log(JSON.stringify(candidates, undefined, 2));

for(var key in candidates) {
    if(candidates.hasOwnProperty(key)) {
        fs.writeFile(process.argv[2] + '-' + key, JSON.stringify(splits[key], undefined, 2));
    }
}

