function getNormal(start, a, b){
  v1 = p5.Vector.sub(a,start);
  v2 = p5.Vector.sub(b,start);

  v2.normalize();
  let sp = v1.dot(v2);
  v2.mult(sp);
  v2.add(start);
  return v2;
}

class Vehicle{
  constructor(x, y, ms, mf) {
    this.pos = createVector(x,y);
    this.vel = createVector(2,0);
    this.acc = createVector(0, 0);

    this.r = 3.0;
    this.mass = 1;
    this.maxSpeed = ms || 3;
    this.maxForce = mf || 0.05 ;
  }


  followMulti(path){
    let future = this.vel.copy();
    future.mult(30);
    future.add(this.pos);

    let target = null;
    let normal = null;
    let record = Infinity;

    //look thru all line segments 
    for(let i = 0; i < path.points.length -1; i++){
      let vertexA = path.points[i];
      let vertexB = path.points[i + 1];
      
      //whats the normal point between the line and the vehicle?
      let normalPoint = getNormal(vertexA, future,vertexB);

      //check if the normal point is between the two vertices
      if(normalPoint.x < vertexA.x || normalPoint.x > vertexB.x){
        // if we cant find a normal point on the line, just set it to the end of the segment
        normalPoint = vertexB.copy(); 
      }

      let distance = p5.Vector.dist(future, normalPoint);
      if (distance < record){
        record = distance;
        normal = normalPoint;
        target = normalPoint.copy();
        let dir = p5.Vector.sub(vertexB,vertexA);
        dir.setMag(10);
        target.add(dir);
      }

    }
      if(record > path.radius && target !=null){
        this.seek(target);
      }

    //draw points
    stroke(0,100,255);
    strokeWeight(1);
    fill(0,100,255);  //future vel
    line(this.pos.x,this.pos.y, future.x, future.y);
    noStroke();
    circle(future.x, future.y, 5);

    stroke(0,255,0);
    fill(0,255,0);
    line(future.x,future.y, normal.x,normal.y);
    noStroke();
    circle(normal.x,normal.y,4);

    fill(255,155,155);
    circle(target.x,target.y,5);

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
    /* this.applyForce(force); */
  }

  separate(vehicles){
    //Take array of vehicles, and ensure they dont collide.
    let desiredDistance = 25; 
    let sumOfFlee = createVector(0,0); 
    let count = 0;

    for(let other of vehicles){
      let distance = p5.Vector.dist(this.pos, other.pos);

      if(this != other && distance < desiredDistance && distance > 0){
        let fleeVector = p5.Vector.sub(this.pos, other.pos);
        fleeVector.setMag(1 / distance);
        sumOfFlee.add(fleeVector);
        count++;
      }
    }

    if(count > 0){
      /* sumOfFlee.div(count */ // division isnt necessary because it changes the magnitude of the vector which I do manually. 
      sumOfFlee.setMag(this.maxSpeed); // -> desired is to run away as fast as possible. 

      let steering = p5.Vector.sub(sumOfFlee, this.vel);
      steering.limit(this.maxForce);

      /* this.applyForce(steering); */
      return steering;
    }
    return createVector(0,0);
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

  applyBehaviors(vehicles){
    let separation = this.separate(vehicles);
    let seeking = this.seek(createVector(mouseX, mouseY));

    this.applyForce(separation);
    this.applyForce(seeking);
  }

  applyForce(force) {
    this.acc.add(force);
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
    //do I even still need this? I dont rememeber.
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

//-------------------------------------------------------------
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

//--------BOIDS-----------------------------------------------------

class Boids extends Vehicle{
  constructor(x, y, ms, mf){
    super(x,y,ms,mf);
    this.acc = createVector(0,0);
    this.vel = createVector(random(-1,1),random(-1,1));
  }

  align(boids){
    // find average vectors of all in influence, and return said force. 
    let visionField = 50;
    let sumVectors = createVector(0,0);
    let count = 0;

    for(let other of boids){
      let distanceBetween = p5.Vector.dist(this.pos, other.pos);

      if(this != other && distanceBetween < visionField){
        sumVectors.add(other.vel);
        count++;
      }
    }

    if(count > 0){
      sumVectors.setMag(this.maxSpeed);
      let steer = p5.Vector.sub(sumVectors, this.vel);
      steer.limit(this.maxForce);
      return steer;
    } else {
      return createVector(0,0);
    }
  }

  applyBehaviors(boids){
    let separation = this.separate(boids);
    let alignment = this.align(boids);
    let cohereance = this.cohere(boids);

    separation.mult(1.5);
    alignment.mult(1);
    cohereance.mult(1);

    this.applyForce(separation);
    this.applyForce(alignment);
    this.applyForce(cohereance);
  }
  

  cohere(boids){
    let visionField = 70;
    let centerpoint = createVector(0,0);
    let count = 0;
 
    for(let other of boids){
      let distance = p5.Vector.dist(this.pos, other.pos);
      if(this != other && distance < visionField){
        centerpoint.add(other.pos);
        count++;
      }

      if(count > 0){
        centerpoint.div(count);
        return this.seek(centerpoint);
      } else{return createVector(0,0);}
    }
  }

  run(boids){
    this.applyBehaviors(boids);
    this.update();
    this.edges();
    this.show();
  }
}

