class Flock{
  constructor(){
   this.flock = [];
  }

  add(boid){
    this.flock.push(boid);
  }

  run(){
    for(let boid of this.flock){
        boid.run(this.flock);
    }

  }

}