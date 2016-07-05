(function() {

  function log(msg) {
    var el = document.createElement('p');
    el.appendChild( document.createTextNode(msg) );
    document.body.appendChild(el);
  }

  // instrument 1
  var map = {
    36: '35', // kick
    44: '44', // hh pedal
    42: '42', // open hh
    46: '46', // closed hh
    38: '38', // snare
    49: '49', // crash
    50: '48', // tom 1
    47: '45', // tom 2
    43: '41', // tom 3
    55: '51', // ride?
    59: '53', // tick?
  };

  window.addEventListener('load', function() {
    navigator.requestMIDIAccess().then(
      onMIDIInit,
      onMIDISystemError );
  });

  function onMIDIInit(midi) {
    //log('webmidi OK');
    linkInputs(midi);
    linkOutputs(midi);
  }

  function linkOutputs(midi) {
    for (var input of midi.outputs.values()) {
      //log('OUT ' + input.name + ' (' + input.id + ')');
      input.send( [0x90, 3, 32] );
    }
  }

  function linkInputs(midi) {
    for (var input of midi.inputs.values()) {
      //log('IN  ' + input.name + ' (' + input.id + ')');
      //window.i = input;
      input.onmidimessage = midiMessageReceived;
    }
  }

  function onMIDISystemError(err) {
    log(err);
  }

  function midiMessageReceived(ev) {
    var cmd = ev.data[0] >> 4;
    var channel = ev.data[0] & 0xf;
    var noteNumber = ev.data[1];
    var velocity = 0;

    if (ev.data.length > 2) {
      velocity = ev.data[2];
    }

    // MIDI noteon with velocity=0 is the same as noteoff
    if (cmd === 8 || ((cmd === 9) && (velocity === 0))) { // noteoff
      //noteOff(noteNumber);
      //log('OFF ' + noteNumber);
    } else if (cmd === 9) { // note on
      console.log('%s', noteNumber);
      noteNumber = map[noteNumber];
      var s = sounds[noteNumber];
      console.log('playSound(%s) -> %s', noteNumber, s);
      if (s) {
        playSound(s, 0);
      }

      //noteOn(noteNumber, velocity);
      //log('ON  ' + noteNumber + ' ' + velocity);
    } else if (cmd === 11) { // controller message
      //controller(noteNumber, velocity);
    } else {
      // probably sysex!
    }
  }

})();
