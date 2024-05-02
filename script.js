// ~~~~~~~~~~~~~~~~ MIDI INITIALIZATION ~~~~~~~~~~~~~~~~~~~
// Enable WebMidi API and handle any errors if it fails to enable.
// This is necessary to work with MIDI devices in the web browser.
await WebMidi.enable();

// Initialize variables to store the first MIDI input and output devices detected.
// These devices can be used to send or receive MIDI messages.
let myInput = WebMidi.inputs[0];
let myOutput = WebMidi.outputs[0].channels[1];
let delayOutput = WebMidi.outputs[0].channels[2];

// ~~~~~~~~~~~~~~~~ DROPDOWNS AND KNOBS/SLIDERS ~~~~~~~~~~~~~~~~~~~
// Get the dropdown elements from the HTML document by their IDs.
// These dropdowns will be used to display the MIDI input and output devices available.
let dropIns = document.getElementById("dropdown-ins");
let dropOuts = document.getElementById("dropdown-outs");

let delayKnob = document.getElementById("delay-knob");
let highSwitch = document.getElementById("voiceOne-knob");
let lowSwitch = document.getElementById("voiceTwo-knob");





// ~~~~~~~~~~~~~~~~ DROPDOWN OPTIONS ~~~~~~~~~~~~~~~~~~~
// For each MIDI input device detected, add an option to the input devices dropdown.
// This loop iterates over all detected input devices, adding them to the dropdown.
WebMidi.inputs.forEach(function (input, num) {
  dropIns.innerHTML += `<option value=${num}>${input.name}</option>`;
});

// Similarly, for each MIDI output device detected, add an option to the output devices dropdown.
// This loop iterates over all detected output devices, adding them to the dropdown.
WebMidi.outputs.forEach(function (output, num) {
  dropOuts.innerHTML += `<option value=${num}>${output.name}</option>`;
});







// ~~~~~~~~~~~~~~~~ HARMONIZER VOICES ~~~~~~~~~~~~~~~~~~~
  //define MIDI processing function
  const midiProcess = function (midiNoteInput) {
    let originalPitch = midiNoteInput.note.number;
    let velocity = midiNoteInput.note.rawAttack;

    //OUTPUT OF ORIGINAL MIDI NOTE INPUT
    let midiNote1 = new Note(originalPitch, { rawAttack: velocity })

        //HARMONIZER VOICES OUTPUT

    if (highSwitch.checked == true) {
      let originalPitch = midiNoteInput.note.number;
      let velocity = midiNoteInput.note.rawAttack;
      let midiNote2 = new Note(originalPitch +7, { rawAttack: velocity })
  
      return midiNote2;
    };

    if (lowSwitch.checked == true) {
      let originalPitch = midiNoteInput.note.number;
      let velocity = midiNoteInput.note.rawAttack;
      let midiNote3 = new Note(originalPitch -7, { rawAttack: velocity })
  
      return midiNote3;
      };

    if (lowSwitch.checked == true && highSwitch.checked == true) {
      let originalPitch = midiNoteInput.note.number;
      let velocity = midiNoteInput.note.rawAttack;
      let midiNote3 = new Note(originalPitch -7, { rawAttack: velocity })
      let midiNote2 = new Note(originalPitch +7, { rawAttack: velocity })

      return midiNote2, midiNote3;
    }

    return midiNote1;
  };

  // console.log(highSwitch);
  // console.log(lowSwitch);






//~~~~~~~~~~~~~~~~ DELAY KNOB FUNCTION ~~~~~~~~~~~~~~~~~~~

// var delayTime = 0;
// delayKnob.addEventListener("change", function(){
// delayTime = delayKnob.value;
// console.log(delayTime);
// });

const delayFunc = function (midiNoteInput) {
  let originalPitch = midiNoteInput.note.number;
  let velocity = midiNoteInput.note.rawAttack;



  let delayNote = new Note(originalPitch, { rawAttack: velocity });

  //   setTimeout(() => {
  //   delayNote;
  // }, delayTime);

  return delayNote;
};


// //~~~~~~~~~~~~~~~~ DELAY APPLICATION ~~~~~~~~~~~~~~~~~~~


// var delay = function (midiNoteInput) {

//   setTimeout(() => {
//     midiProcess(midiNoteInput);
//   }, delayTime);

// };

// console.log(delayTime);




// add velocity and decay to delay!!!!!







  //if you divide a MIDI note number by 12, the remainder will tell you the MIDI pitch class of the number (what note it is) numbers 0-11

// Add an event listener for the 'change' event on the input devices dropdown.
// This allows the script to react when the user selects a different MIDI input device.
dropIns.addEventListener("change", function () {
  // Before changing the input device, remove any existing event listeners
  // to prevent them from being called after the device has been changed.
  if (myInput.hasListener("noteon")) {
    myInput.removeListener("noteon");
  }
  if (myInput.hasListener("noteoff")) {
    myInput.removeListener("noteoff");
  };

  // Change the input device based on the user's selection in the dropdown.
  myInput = WebMidi.inputs[dropIns.value];


  // After changing the input device, add new listeners for 'noteon' and 'noteoff' events.
  // These listeners will handle MIDI note on (key press) and note off (key release) messages.
  myInput.addListener("noteon", function (someMIDI) {
    // When a note on event is received, send a note on message to the output device.
    // This can trigger a sound or action on the MIDI output device.
    myOutput.sendNoteOn(midiProcess(someMIDI));
    // delayOutput.sendNoteOn(delayFunc(someMIDI));
    let delayTime = 0;
    delayKnob.addEventListener("change", function(){
    delayTime = delayKnob.value;
    console.log(delayTime);
    });

    setTimeout(() => {
      delayOutput.sendNoteOn(delayFunc(someMIDI));
    }, delayTime);
  });

  myInput.addListener("noteoff", function (someMIDI) {
    // Similarly, when a note off event is received, send a note off message to the output device.
    // This signals the end of a note being played.

    myOutput.sendNoteOff(midiProcess(someMIDI));
    delayOutput.sendNoteOff(delayFunc(someMIDI));
  });
});

// Add an event listener for the 'change' event on the output devices dropdown.
// This allows the script to react when the user selects a different MIDI output device.
dropOuts.addEventListener("change", function () {
  // Change the output device based on the user's selection in the dropdown.
  // The '.channels[1]' specifies that the script should use the first channel of the selected output device.
  // MIDI channels are often used to separate messages for different instruments or sounds.
  myOutput = WebMidi.outputs[dropOuts.value].channels[1];
});

// ~~~~~~~~~~~~~~~~ NOTES ~~~~~~~~~~~~~~~~~~~
//standard midi data message is 3 bytes
//8 bits in a byte
//timecode pitch 0-127 velocity 0-127

