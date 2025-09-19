// ml5.js Body Pose Detection Example
// Based on https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/7-bodypose/pose-detection

let video;
let bodyPose;
let connections;
let poses = [];
let lerpPoints;

function preload() {
  // Initialize MoveNet model for body pose detection
  bodyPose = ml5.bodyPose("BlazePose");

  // Load an image to analyze
  // img = loadImage("embarrassing.jpg");
  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  // video.hide();
}

function setup() {
  // Create canvas matching the image dimensions
  createCanvas(640, 480);

  // Start detecting poses in the loaded image
  bodyPose.detectStart(video, gotPoses);

  // Retrieve the skeleton structure used by the model
  connections = bodyPose.getSkeleton();
}

function gotPoses(results) {
  // Store detected poses in the global array
  poses = results;
}

function draw() {
  // image(video, 0, 0, width, height);
  // createCanvas(640*1.8, 480*1.8);
  background('#F5F5DC');

  // Ensure at least one pose is detected before proceeding
  if (poses.length > 0) {
    let pose = poses[0];

    // Loop through the skeleton connections and draw lines
    for (let i = 0; i < connections.length; i++) {
      let connection = connections[i];
      let a = connection[0];
      let b = connection[1];
      let keyPointA = pose.keypoints[a];
      let keyPointB = pose.keypoints[b];
      let confA = keyPointA.confidence;
      let confB = keyPointB.confidence;

      if (!lerpPoints) {
        lerpPoints = [];
        for (let j = 0; j < pose.keypoints.length; j++) {
          lerpPoints.push(createVector(pose.keypoints[j].x, pose.keypoints[j].y));
        }
      }

      lerpPoints[a].x = lerp(lerpPoints[a].x, keyPointA.x, 0.9);
      lerpPoints[a].y = lerp(lerpPoints[a].y, keyPointA.y, 0.9);
      lerpPoints[b].x = lerp(lerpPoints[b].x, keyPointB.x, 0.9);
      lerpPoints[b].y = lerp(lerpPoints[b].y, keyPointB.y, 0.9);

      // Only draw lines if both keypoints have sufficient confidence
      if (confA > 0.1 && confB > 0.1) {
        stroke(0, 0, 0);
        strokeWeight(8);
        line(width - lerpPoints[a].x, lerpPoints[a].y, width - lerpPoints[b].x, lerpPoints[b].y);
      }
    }

    // Loop through all keypoints and draw circles
    for (let i = 0; i < pose.keypoints.length; i++) {
      let keypoint = lerpPoints[i];
      fill(0);
      stroke(0, 0, 0);
      strokeWeight(3);

      // Only draw keypoints with sufficient confidence
      if (keypoint.confidence > 0.1) {
        circle(width - keypoint.x, keypoint.y, 8);
      }
    }
  }

  // clear();
}
