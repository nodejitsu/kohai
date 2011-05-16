
exports.TIME = 1000; // how many ms to run tests for.
exports.COMPARE_COUNT = 4; // default number of runs for comparisons.
exports.COUNT_PER_LAP = 1;
exports.STEPS_PER_LAP = 1000;
exports.run = run;
exports.compare = compare;
exports.show = show;
exports.runMain = runMain

function runMain () {
  var test = require.main.exports
  if (test === require("./cli-wrapper")) return

  console.log("benchmarking "+require.main.filename+"\nPlease be patient.")
  if (test.stepsPerLap) exports.STEPS_PER_LAP = test.stepsPerLap

  compare
    ( test.compare
    , test.compareCount || exports.COMPARE_COUNT
    , test.time || exports.TIME
    , test.countPerLap || exports.COUNT_PER_LAP
    , function (er, data) { (test.done || exports.show)(data) }
    )
}

var events = require("events"),
  sys = require("sys");

function run (fn, time, countPerLap, cb) {
  time = time || exports.TIME;
  countPerLap = countPerLap || exports.COUNT_PER_LAP;
  var runCount = 0,
    go = true,
    start = Date.now(),
    stopTime = start + time,
    now = start,
    stepsPerLap = exports.STEPS_PER_LAP,
    useCallback = (fn.length === 1);

  if (fn.length > 1) throw new Error(
    "Please read the instructions.  Test functions should take 0 or 1 arguments."
  );

  function lap () {
    runCount += countPerLap;
    if (Date.now() > stopTime) return done();
    process.nextTick(runner);
  };
  function done () {
    var did = runCount / (Date.now() - start);
    cb(null, did);
  };
  function noop () { runCount ++ };
  function runner () {
    if (useCallback) return fn(lap);
    // blocking case.
    for (var i = 0; i < stepsPerLap; i ++) fn();
    runCount += countPerLap * (stepsPerLap - 1);
    lap();
  };
  runner();
};

//
//  set : {"name":function(asyncCallback?),...}
//
function compare (set, compareCount, time, countPerLap, cb) {
  compareCount = compareCount || exports.COMPARE_COUNT;
  time = time || exports.TIME;
  countPerLap = countPerLap || exports.COUNT_PER_LAP;

  var tests = [],
    results = [],
    testCount = 0;
  for (var i in set) {
    testCount ++;
    tests.push({name:i, fn:set[i]});
    results.push([]);
  }
  (function comparer (currentCompare) {
    if (currentCompare <= compareCount) {
      var testOrder = randomArray(testCount);
      (function comparerInner (i) {
        if (i < testCount) {
          var current = testOrder[i];
          run(tests[current].fn, time, countPerLap, function (er, data) {
            results[current].push(data);
            comparerInner(i+1);
          })
        } else {
          process.nextTick(function () { comparer(currentCompare+1) });
        }
      })(0);
    } else {
      var ret = {};
      for (var i = 0; i < testCount; i ++) {
        ret[ tests[i].name ] = results[i];
      }
      cb(null, ret);
    }
  })(0);
};

// http://rosettacode.org/wiki/Knuth_shuffle#JavaScript
function knuth (a) {
  var n = a.length;
  var r, temp;
  while (n > 1) {
    r = Math.floor(n * Math.random());
    n--;
    temp = a[n];
    a[n] = a[r];
    a[r] = temp;
  }
  return a;
}

function randomArray (l) {
  var a = [];
  while (l --> 0) a.push(l);
  return knuth(a);
}

function print (m,cr) { sys.print(m+(cr===false?"":"\n")); return print };

function show (results) {
  var averages = [];
  for (var i in results) {
    averages.push({name:i, avg:avg(results[i])});
  }
  averages.sort(sortScores);

  print("Scores: (bigger is better)\n");
  for (var i = 0, l = averages.length; i < l; i ++) {
    var res = results[ averages[i].name ];
    print
      (averages[i].name)
      ("Raw:")
      (" > "+res.join("\n > "))
      ("Average (mean) " + averages[i].avg)
      ("");
  }
  var winner = averages.shift(), second = averages.shift(), loser = averages.pop();

  print
    ("Winner: " + winner.name)
    ("Compared with next highest ("+second.name+"), it's:")
    (pct(winner.avg, second.avg)+"% faster")
    (times(winner.avg, second.avg)+" times as fast")
    (oom(winner.avg, second.avg)+" order(s) of magnitude faster");
  if (loser) print
    ("\nCompared with the slowest ("+loser.name+"), it's:")
    (pct(winner.avg, loser.avg)+"% faster")
    (times(winner.avg, loser.avg)+" times as fast")
    (oom(winner.avg, loser.avg)+" order(s) of magnitude faster");

  print("");
  return;
};

function sortScores (a, b) {
  return a.avg === b.avg ? 0 : a.avg > b.avg ? -1 : 1;
}

function pct (num1, num2) {
  return Math.round((1-(Math.min(num1, num2)/Math.max(num1, num2))) * 10000) / 100;
}
function times (num1, num2) {
  return Math.round((Math.max(num1, num2)/Math.min(num1, num2)) * 100) / 100;
}
function logX (n, x) {
  return Math.log(n)/Math.log(x)
}
function oom (num1, num2) {
  var l1 = logX(num1, 10)
    , l2 = logX(num2, 10)
    , diff = Math.abs( l1 - l2 )
  return Math.round(diff * 100) / 100
}
function avg (nums) {
  var sum = 0;
  nums.forEach(function (n) { sum+=n });
  return sum/nums.length;
};