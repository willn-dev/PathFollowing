class Vehicle{
    constructor(x, y, ms, mf){
        this.pos = createVector(x,y);
        this.vel = createVector(0,0);
        this.accel = createVector(0,0);
        this.maxForce = mf;
        this.maxSpeed = ms;

        this.r = 4; //radius for vehicle
    }

    run(){
      this.update();
      this.edges();
      this.show();      
    }

    applyForce(force){
      this.accel.add(force);
      //can we just set accel directly to force 
    }

    update(){
        this.vel.add(this.accel);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.accel.mult(0);
    }

    edges(){
        if (this.pos.x < -this.r){this.pos.x = width + this.r;}
        if (this.pos.x > width + this.r) {this.pos.x = -this.r;}
        if(this.pos.y < -this.r){this.pos.y = height + this.r;}
        if (this.pos.y > height + this.r){this.pos.y = -this.r;}
    }

    show(){
        let theta = this.vel.heading();
        fill(100);
        stroke(255);
        strokeWeight(2);


        push(); //push and pop wont change my translation permanently 
            translate(this.pos.x, this.pos.y);
            rotate(theta);
            beginShape();
            vertex(this.r * 2, 0);
            vertex(-this.r * 2, -this.r);
            vertex(-this.r * 2, this.r);
            endShape(CLOSE);
        pop();

    }

    //will recieve a "desired" vector by using the flowfield objects lookup method. 
    follow(flow){
        let desired = flow.lookup(this.pos);
        desired.setMag(this.maxSpeed);

        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxForce);
        this.applyForce(steer);
    }
}