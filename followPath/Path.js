class Path{
  constructor(x1,y1,x2,y2){
      this.start = createVector(x1, y1,);
      this.end = createVector(x2,y2);
      this.radius = 20;


  }

  show(){
    stroke(255);
    strokeWeight(2);

    line(this.start.x, this.start.y, this.end.x, this.end.y);

    stroke(255,100);
    strokeWeight(this.radius * 2);
    line(this.start.x, this.start.y, this.end.x, this.end.y);
 

  }
}

class MultiPointPath{
  constructor(){
    this.radius = 20;
    this.points = [];
  }

  addPoint(x,y){
    /* this.points.push(createVector(x,y)); */
    let pathPoint = createVector(x,y);
    this.points.push(pathPoint);
  }

  show(){

    //radius drawing
    stroke(100);
    strokeWeight(this.radius * 2);
    noFill();

    beginShape();
      for(let pathpoint of this.points){
        vertex(pathPoint.x, pathPoint.y,);
      }
    endShape();



    //center line. 
    stroke(255);
    strokeWeight(1);
    noFill();

    beginShape();
      for(let pathpoint of this.points){
        vertex(pathPoint.x, pathPoint.y,);
      }
    endShape();

  }

}