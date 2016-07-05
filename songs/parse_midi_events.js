'use strict';

/*
fluidsynth: prog        14      0       0
fluidsynth: prog        15      0       0
fluidsynth: cc  0       101     0
fluidsynth: cc  0       100     0
fluidsynth: cc  0       6       12
fluidsynth: cc  0       38      0
fluidsynth: noteon	9	47	95	00024	33.820	1.245	0.000	0
fluidsynth: noteon	9	45	95	00025	33.820	1.245	0.000	1
fluidsynth: noteoff	9	47	0	00024	1.249	2
fluidsynth: noteoff	9	45	0	00025	1.249	2
fluidsynth: noteon	9	45	95	00026	34.183	1.249	0.000	2
*/

const fs = require('fs');


function parse(lines) {
  const events = [];
  let lastLine;
  let noteOns = 0;
  let repeats = 0;
  lines.forEach((l) => {
    const w = l.split(/(\s+)/).filter((s, i) => i % 2 === 0);
    w.shift();
    if (w[0] === 'noteon') {
      const ev = {
        // ch: parseInt(w[1], 10), // 9  channel
        n: parseInt(w[2], 10), // 47 noteNumber
        v: parseInt(w[3], 10), // 95 velocity
        // i : parseInt(w[4], 10), // 00024 index?
        t: parseFloat(w[5]), // t0 start time in secs
        T: parseFloat(w[6]) // t1 end time in secs
        // x : parseInt(w[7], 10) // ??
      };
      const s = JSON.stringify(ev);
      if (s !== lastLine) {
        events.push(ev);
        lastLine = s;
        ++noteOns;
      }
      else {
        ++repeats;
      }
    }
  });
  console.log('noteOns: %s\nrepeats: %s', noteOns, repeats);
  return events;
}



function parseFile(pathTxtIn, pathJsonOut) {
  const str = fs.readFileSync(pathTxtIn).toString();
  const o = parse( str.split('\n') );
  //fs.writeFileSync(pathJsonOut, JSON.stringify(o, null, '\t'));
  fs.writeFileSync(pathJsonOut, JSON.stringify(o));
}



module.exports = parseFile;



parseFile('only_drums.txt', 'only_drums.json');
