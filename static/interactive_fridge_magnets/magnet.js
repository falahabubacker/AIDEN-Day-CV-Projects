// let textMagnets = ["w", "elc", "o", "me", "to", "ai", "de", "n", "d", "ay"];
let id = 0;

class Magnet {
  constructor() {

    this.t = textMagnets[id];
    this.x = random(50, width-50);
    this.y = random(50, height-50);
    this.angle = TWO_PI;
    this.c = color(255);
    
    this.bbox = font.textBounds(this.t, this.x, this.y-10, size);
    this.pos = createVector(this.bbox.x, this.bbox.y);
    this.w = this.bbox.w;
    this.h = this.bbox.h;
    
    this.fingerx = 0;
    this.fingery = 0;

    id += 1;
  }
  
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    fill(this.c);
    rect(0, 0, this.w, this.h);

    fill(0);
    noStroke();
    textFont(font);
    textSize(size/2);
    textAlign(CENTER, CENTER);
    text(this.t, 0, 0);
    pop();
    
    fill(255, 0, 0);
    ellipse(this.fingerx, this.fingery, 20, 20);
  }
  
  touch(thumbx, thumby, indexx, indexy) {
    let distBetweenFingers = dist(thumbx, thumby, indexx, indexy);
    this.fingerx = abs(thumbx - indexx) + min(thumbx, indexx);
    this.fingery = abs(thumby - indexy) + min(thumby, indexy);
    
    let distFromFingers = dist(this.pos.x, this.pos.y, this.fingerx, this.fingery);
    
    if (distBetweenFingers < 50 && distFromFingers < this.w/2) {
      this.c = color(255, 0, 0);
      this.pos.x = this.fingerx;
      this.pos.y = this.fingery;
    } else {
      this.c = color(255);
    }
  }
}
