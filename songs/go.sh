#!/bin/bash

# general user, mono 44100
# fluid guitar sounds better

#BANK=/Users/jdias/Downloads/SOUNDBANKS/GeneralUser_GS_v1.47.sf2
BANK=/Users/jdias/Downloads/SOUNDBANKS/FluidR3_GM.sf2
DIR=$1

#echo generating no drums version...
fluidsynth -n -L 1 -r 44100 -g 1 -i $BANK -F $DIR/no_drums.wav $DIR/no_drums.mid
oggenc -q 10 $DIR/no_drums.wav
rm $DIR/no_drums.wav

#echo generating only drums version...
fluidsynth -n -L 1 -r 44100 -g 1 -i $BANK -F $DIR/only_drums.wav $DIR/only_drums.mid
oggenc -q 10 $DIR/only_drums.wav
rm $DIR/only_drums.wav

echo extracting drums MIDI events...
#fluidsynth -F /tmp/void.wav -v $DIR/only_drums.mid > only_drums.txt 2>&1
fluidsynth -n -L 1 -r 44100 -g 1 -i $BANK -v $DIR/only_drums.mid > only_drums.txt 2>&1

node parse_midi_events.js
rm only_drums.txt
mv only_drums.json $DIR/only_drums.json

#echo all done
