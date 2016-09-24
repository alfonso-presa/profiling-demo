var parsedJSON = require('./log1.json');

var filter = parsedJSON[parsedJSON.length-1];

var result = parsedJSON.filter(function (item) {
    return item.pid === filter.pid && item.tid === filter.tid;
});

console.log(JSON.stringify(result, undefined, 2));
