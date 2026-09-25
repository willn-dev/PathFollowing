function getNormal(pos, a, b){
  v1 = p5.Vector.sub(a,pos);
  v2 = p5.Vector.sub(b,pos);

  v2.normalize();
  let sp = v1.dot(v2);
  v2.mult(sp);
  v2.add(pos);
  return v2;
}

class Vehicle{
  constructor(x, y) {
    this.pos = createVector(x,y);
    this.vel = createVector(0,0);
    this.acc = createVector(0, 0);

    this.r = 16;
    this.mass = 1;
    this.maxSpeed = 4;
    this.maxForce = 0.1 ;
  }


  
  //path following algorithm
  follow(path){
    let future = this.vel.copy();
    future.mult(20);
    future.add(this.pos);
    /* fill(255,0,0);
    noStroke(); */
   

    //is future on path?
    let target = getNormal(path.start, future, path.end);

    /* fill(0,0,255);
    noStroke(); */
    

    let dist = p5.Vector.dist(future, target);
    if(dist > path.radius){
      return this.seek(target);
    } else{
        return createVector(0,0);
    }
    
  }

  followMulti(path){
    let future = this.vel.copy();
    future.mult(20);
    future.add(this.pos);

    let target = null;
    let normal = null;
    let record = Infinity;

    //look thru all line segments 
    for(let i = 0; i < path.points.length; i++){
      let vertexA = path.points[i];
      let vertexB = path.points[i + 1];
      
      //whats the normal point between the line and the vehicle?
      let normalPoint = getNormal(future, vertexA,vertexB);

      //check if the normal point is between the two vertices
      // it should be, but what if we run off the end of the track
      
      if(normalPoint.x < a.x || normalPoint.x > b.x){
        //just set the point to be the end of the line segment. 
        normalPoint = b.copy(); // HERE IS WHERE I LEFT OFF 
      }

    }



  }



  seek(target, arrival){

    let force = p5.Vector.sub(target, this.pos); //desired path
    let desiredSpeed = this.maxSpeed;

    if(arrival){
      let slowRadius = 100;
      let dist = force.mag();

      if(dist < slowRadius){
        desiredSpeed = map(dist, 0, slowRadius, 0, this.maxSpeed);
        force.setMag(desiredSpeed);
      }
    }

    force.setMag(desiredSpeed); 
    force.sub(this.vel);    //subtract current velocity and limit the acting force to "maxForce"
    force.limit(this.maxForce);
    return(force);
  }

  arrive(target){
    return this.seek(target, true);
  }


  pursue(vehicle){
    let target = vehicle.pos.copy();
    let prediction = vehicle.vel.copy();
    prediction.mult(10);
    target.add(prediction);
    return this.seek(target);
  }

  flee(predator){
    return this.seek(predator).mult(-1);
  }

  evade(vehicle){
    let pursuit = this.pursue(vehicle);
    pursuit.mult(-1);
    return pursuit;
  }

  /**
   * divides force by mass, then adds to the objects acceleration
   */
  applyForce(force) {
    let f = force.copy();
    f.div(this.mass);
    this.acc.add(f);
  }

    /**
     * In the event an automated target moves offscreen, it will be returned on the opposite side.
     */
  edges() {
    let edgeWrap = false;

    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
      edgeWrap = true;

    } else if (this.pos.x < -this.r) {
        this.pos.x = width + this.r;
        edgeWrap = true;
      }
      if (this.pos.y > height + this.r) {
        this.pos.y = -this.r;
        edgeWrap = true;
      } else if (this.pos.y < -this.r) {
        this.pos.y = height + this.r;
        edgeWrap = true;
      }

      if (edgeWrap){
        this.onEdgeWrap();
      }
  }

  /**
   * blank function for method override
   */ 
  onEdgeWrap(){
    
  }


  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  show() {
    stroke(225);
    strokeWeight(2);
    fill(220);
    push();
      translate(this.pos.x, this.pos.y,);
      rotate(this.vel.heading());
      triangle(-this.r, -this.r/4, -this.r, this.r/4, 0,0);
    pop();
  }
}

class Target extends Vehicle{
  constructor(x,y){
    super(x,y);
  }
  
  update(){
    this.pos.set(mouseX,mouseY);
  }

  show(){
    noStroke();
    fill(255,0,0);
    ellipse(this.pos.x, this.pos.y, 16);
  }
}