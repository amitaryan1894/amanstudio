// Get a reference to the SpeechRecognition interface
window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

// Check if the browser supports the Web Speech API
if ('SpeechRecognition' in window) {
  // Create a new instance of SpeechRecognition
  const recognition = new SpeechRecognition();

  // Set some options for the recognition
  recognition.lang = 'en-US'; // Set the language to English
  recognition.interimResults = false; // Don't return intermediate results
  recognition.maxAlternatives = 1; // Return only one result

  // Get a reference to the button and the div elements
  const record = document.getElementById('record');
  const waves = document.getElementById('waves');

  // Create a canvas element to draw the waveform
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = waves.clientWidth;
  canvas.height = waves.clientHeight;
  waves.appendChild(canvas);

  // Create an audio context to process the audio data
  const audioCtx = new AudioContext();
  const analyser = audioCtx.createAnalyser(); // Create an analyser node
  analyser.fftSize = 256; // Set the FFT size
  const bufferLength = analyser.frequencyBinCount; // Get the buffer length
  const dataArray = new Uint8Array(bufferLength); // Create an array to store the data

  // Define a function to draw the waveform
  function draw() {
    // Request the next animation frame
    requestAnimationFrame(draw);

    // Get the byte time domain data from the analyser
    analyser.getByteTimeDomainData(dataArray);

    // Clear the canvas
    ctx.fillStyle = 'lightgray';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the waveform
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    const sliceWidth = canvas.width / bufferLength;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0; // Normalize the data
      const y = v * canvas.height / 2; // Scale the data
      if (i === 0) {
        ctx.moveTo(x, y); // Move to the first point
      } else {
        ctx.lineTo(x, y); // Draw a line to the next point
      }
      x += sliceWidth; // Increment the x position
    }
    ctx.lineTo(canvas.width, canvas.height / 2); // Draw a line to the end
    ctx.stroke(); // Stroke the path
  }

  // Add an event listener to the button element
  record.addEventListener('click', function () {
    // Check if the recognition is already running
    if (recognition.ended) {
      // Start the recognition
      recognition.start();
      // Change the button color and text
      record.style.backgroundColor = 'green';
      record.textContent = 'Stop';
    } else {
      // Stop the recognition
      recognition.stop();
      // Change the button color and text
      record.style.backgroundColor = 'red';
      record.textContent = 'Record';
    }
  });

  // Add an event listener to the recognition start event
  recognition.addEventListener('start', function () {
    // Create a media stream source from the microphone
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
      // Connect the source to the analyser node
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      // Start drawing the waveform
      draw();
    });
  });

  // Add an event listener to the recognition end event
  recognition.addEventListener('end', function () {
    // Disconnect the source from the analyser node
    source.disconnect(analyser);
    // Stop drawing the waveform
    cancelAnimationFrame(draw);
  });

  // Add an event listener to the recognition result event
  recognition.addEventListener('result', function (event) {
    // Get the transcript of the speech input
    const transcript = event.results[0][0].transcript;
    // Display the transcript on the console
    console.log(transcript);
  });
} else {
  // Display a message if the browser does not support the Web Speech API
  console.log('Speech recognition not supported.');
}











function convertHindiToRoman(hindiText) {
    // Define a mapping of Hindi characters to their Roman equivalents
    var transliterationMap = {
        'अ': 'a',
        'आ': 'aa',
        'इ': 'i',
        'ई': 'ii',
        // Add more mappings for other characters as needed
    };

    // Initialize the output string
    var romanText = '';

    // Iterate through each character in the Hindi text
    for (var i = 0; i < hindiText.length; i++) {
        var hindiChar = hindiText[i];
        var romanChar = transliterationMap[hindiChar];

        // If a mapping exists, add the Roman equivalent to the output
        if (romanChar) {
            romanText += romanChar;
        } else {
            // If no mapping exists, add the original character
            romanText += hindiChar;
        }
    }

    return romanText;
}

// Example usage:
var hindiText = 'नमस्ते'; // Replace with your Hindi text
var romanText = convertHindiToRoman(hindiText);
console.log(romanText); // Output: 'namaste'

