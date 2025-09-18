/*
----- Coding Tutorial by Patt Vira ----- 
Name: Interactive Fridge Magnets
Video Tutorial: https://youtu.be/72pAzuD8tqE

Connect with Patt: @pattvira
https://www.pattvira.com/
----------------------------------------
*/

let video; let handPose; let hands = [];
let font; let size = 60;
let textMagnets = ["Welcome", "to", "aiden", "day!"];
let magnets = []; let num = textMagnets.length;

function preload() {
  font = loadFont("static/interactive_fridge_magnets/Outfit-Regular.ttf"); // {{ url_for('static', filename='interactive_fridge_magnets/Outfit-Regular.ttf') }}
  handPose = ml5.handPose({flipped: true});
}

function setup() {
  createCanvas(640*1.8, 480*1.8);
  // Detect video & load ML model
  video = createCapture(VIDEO, { flipped: true });
  video.size(640*1.8, 480*1.8)
  video.hide();
  handPose.detectStart(video, gotHands);
  
  // Create magnet objects
  rectMode(CENTER);
  for (let i=0; i<num; i++) {
    magnets[i] = new Magnet();
  }
}

function draw() {
  background(220);
  
  // Display video and detect index and thumb position
  image(video, 0, 0, width, height);
  if (hands.length > 0) {
    let index = hands[0].keypoints[8];
    let thumb = hands[0].keypoints[4];
    
    noFill();
    stroke(0, 255, 0);
    text("index", index.x, index.y);
    text("thumb", thumb.x, thumb.y);
  
    for (let i=0; i<num; i++) {
      magnets[i].touch(thumb.x, thumb.y, index.x, index.y);
    }
  }
  
  for (let i=0; i<num; i++) {
    magnets[i].display();
  }
}

function gotHands(results) {
  hands = results;
}
