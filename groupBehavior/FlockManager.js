class Flock{
  constructor(){
   this.boids = [];
  }

  add(boid){
    this.boids.push(boid);
  }

  run(){
    for(let boid of this.boids){
        boid.run(this.boids);
    }

  }

}