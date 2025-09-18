/*
----- Coding Tutorial by Patt Vira ----- 
Name: Interactive Bridge w Bouncing Balls (matter.js + ml5.js)
Video Tutorial: https://youtu.be/K7b5MEhPCuo

Connect with Patt: @pattvira
https://www.pattvira.com/
----------------------------------------
*/

// ml5.js 
let handPose;
let video;
let hands = [];
let poses = [];
let lerpPoints = [];

const THUMB_TIP = 4;
const INDEX_FINGER_TIP = 8;

// Matter.js 
const {Engine, Body, Bodies, Composite, Composites, Constraint, Vector} = Matter;
let engine;
let bridge; let num = 7; let radius = 17; let length = 50;
let circles = [];
let last_time = Date.now();

let colorPalette = ["#abcd5e", "#14976b", "#2b67af", "#62b6de", "#f589a3", "#ef562f", "#fc8405", "#f9d531"]; 

function preload() {
  // Load the handPose model
  handPose = ml5.handPose({maxHands: 1, flipped: true});
  bodyPose = ml5.bodyPose("BlazePose");
}

function setup() {
  createCanvas(640*1.8, 480*1.8);
  // Create the webcam video and hide it
  video = createCapture(VIDEO, {flipped: true});
  video.size(640*1.8, 480*1.8);
  video.hide();
  // start detecting hands from the webcam video
  // handPose.detectStart(video, gotHands);
  bodyPose.detectStart(video, gotPoses);
  
  engine = Engine.create();
  bridge = new Bridge(num, radius, length);
}

function draw() {
  background(220);
  Engine.update(engine);
  strokeWeight(2);
  stroke(0);
  
  // Draw the webcam video
  image(video, 0, 0, width, height);
  
  if (Date.now() - last_time > 500) {
    circles.push(new Circle());
    last_time = Date.now()
  }
  
  for (let i=circles.length-1; i>=0; i--) {
    circles[i].checkDone();
    circles[i].display();
    
    if (circles[i].done) {
      circles[i].removeCircle();
      circles.splice(i, 1);
    }
  }
  
  if (poses.length > 0) {
    let rightHand = poses[0].keypoints[19];
    let leftHand = poses[0].keypoints[20];
    fill(0, 255, 0);
    noStroke();
    circle(width - rightHand.x, rightHand.y, 10);
    circle(width - leftHand.x, leftHand.y, 10);
    
    bridge.bodies[0].position.x = width - rightHand.x;
    bridge.bodies[0].position.y = rightHand.y;
    bridge.bodies[bridge.bodies.length-1].position.x = width - leftHand.x;
    bridge.bodies[bridge.bodies.length-1].position.y = leftHand.y;
    bridge.display();
  }
}

// Callback function for when handPose outputs data
function gotHands(results) {
  // save the output to the hands variable
  hands = results;
}

function gotPoses(results) {
  poses = results;
}