// Hand Pose Drawing with Color Selection 
// https://youtu.be/vfNHdVbE-l4
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let painting;
let px = 0;
let py = 0;
let h = 8;
let colors = [];
let selectedColor;

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  // Log detected hand data to the console
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  colorMode(HSB);

  // Create an off-screen graphics buffer for painting
  painting = createGraphics(640, 480);
  painting.colorMode(HSB);
  painting.clear();

  // Define colors for each finger
  colors = [
    color(197, 82, 95), // Index finger - #2DC5F4
    color(283, 69, 63), // Middle finger - #9253A1
    color(344, 100, 93), // Ring finger - #EC015A
    color(32, 68, 97) // Pinky finger - #F89E4F
  ];
  selectedColor = colors[0];

  video = createCapture(VIDEO, { flipped: true });
  video.hide();
  
  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  if (hands.length > 0) {
    let rightHand, leftHand;

    // Separate detected hands into left and right
    for (let hand of hands) {
      if (hand.handedness === "Right") {
        let index = hand.index_finger_tip;
        let thumb = hand.thumb_tip;
        rightHand = { index, thumb };
      }
      if (hand.handedness === "Left") {
        let thumb = hand.thumb_tip;
        let index = hand.index_finger_tip;
        let middle = hand.middle_finger_tip;
        let ring = hand.ring_finger_tip;
        let pinky = hand.pinky_finger_tip;
        let fingers = [index, middle, ring, pinky];

        // Select color based on which finger is near the thumb
        for (let i = 0; i < fingers.length; i++) {
          let finger = fingers[i];
          let d = dist(finger.x, finger.y, thumb.x, thumb.y);

          if (d < 30) {
            fill(colors[i]);
            noStroke();
            circle(finger.x, finger.y, 36);
            selectedColor = colors[i];
          }
        }
      }
    }

    // Draw with right-hand pinch
    if (rightHand) {
      let { index, thumb } = rightHand;
      let x = (index.x + thumb.x) * 0.5;
      let y = (index.y + thumb.y) * 0.5;
      
      let d = dist(index.x, index.y, thumb.x, thumb.y);
      if (d < 20) {
        painting.stroke(selectedColor);
        painting.strokeWeight(16);
        painting.line(px, py, x, y);
      }

      px = x;
      py = y;
    }
  }

  // Overlay painting on top of the video
  image(painting, 0, 0);
}

