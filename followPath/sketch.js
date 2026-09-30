let vehicles = [];
let path;

function setup() {
  
  createCanvas(640, 240);
  path = new MultiPointPath();
  path.addPoint(-20, height / 2);
  path.addPoint(100, 50);
  path.addPoint(400, 200);
  path.addPoint(width + 20, height / 2);
  

  vehicles.push(new Vehicle(0,height/2, 2, 0.04));
  vehicles.push(new Vehicle(0,height/2, 3, 0.1));

}

function draw() {
    background(0);
    path.show();

    for(let vehicle of vehicles){
      vehicle.followMulti(path);
      vehicle.edges();
      vehicle.update();
      vehicle.show();
    }
  
}
