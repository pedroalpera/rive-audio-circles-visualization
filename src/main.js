// This is the High level JS runtime for Rive
// https://rive.app/community/doc/web-js/docvlgbnS1mp

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

const riveInstance = new rive.Rive({
  src: "audio_circles_visualization.riv",
  canvas: document.getElementById("canvas"),
  autoplay: true,
  artboard: "Artboard",
  stateMachines: "State Machine 1",

  onLoad: () => {
    riveInstance.resizeDrawingSurfaceToCanvas();
    init();
  },
});

// Mr.doob FPS Stats
// javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='https://mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()

let circle0;
let circle1;
let circle2;

// Set up Audio

let audio;
let audioContext, audioData, sourceNode, analyserNode;
let manager;
let minDb, maxDb;

const createAudio = () => {
  audio = document.createElement("audio");

  audio.src = "Track1.mp3";

  audioContext = new AudioContext();

  sourceNode = audioContext.createMediaElementSource(audio);
  sourceNode.connect(audioContext.destination);

  analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 512;
  analyserNode.smoothingTimeConstant = 0.9;
  sourceNode.connect(analyserNode);

  minDb = analyserNode.minDecibels;
  maxDb = analyserNode.maxDecibels;

  audioData = new Float32Array(analyserNode.frequencyBinCount);
};

window.addEventListener("mouseup", () => {
  if (!audioContext) createAudio();
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();

    // Reset Circles Scale

    circle0.scaleX = 0.9;
    circle0.scaleY = 0.9;

    circle1.scaleX = 1;
    circle1.scaleY = 1;

    circle2.scaleX = 1.1;
    circle2.scaleY = 1.1;
  }
});

function init() {
  // Set circles
  circle0 = riveInstance.artboard.node("Circle0");
  circle1 = riveInstance.artboard.node("Circle1");
  circle2 = riveInstance.artboard.node("Circle2");

  // Start the first frame request
  window.requestAnimationFrame(gameLoop);
}

let lastTime = 0;

function gameLoop(time) {
  if (!lastTime) {
    lastTime = time;
  }
  const elapsedTimeMs = time - lastTime;
  const elapsedTimeSec = elapsedTimeMs / 1000;
  lastTime = time;

  // Set Audio
  if (audio != undefined) {
    if (audio.paused) {
    } else {
      analyserNode.getFloatFrequencyData(audioData);

      let num0 = audioData[6];
      let num1 = audioData[12];
      let num2 = audioData[37];

      let scaleValue0 = num0.map(-140, -30, 0, 0.7);
      let scaleValue1 = num1.map(-140, -30, 0, 1.2);
      let scaleValue2 = num2.map(-140, -30, 0, 3);

      circle0.scaleX = scaleValue0;
      circle0.scaleY = scaleValue0;

      circle1.scaleX = scaleValue1;
      circle1.scaleY = scaleValue1;

      circle2.scaleX = scaleValue2;
      circle2.scaleY = scaleValue2;
    }
  }

  window.requestAnimationFrame(gameLoop);
}
