let vehicle;
let path;

function setup() {
  
  createCanvas(640, 240);
  path = new MultiPointPath();
  path.addPoint(-20, height / 2);
  path.addPoint(100, 50);
  path.addPoint(400, 200);
  path.addPoint(width + 20, height / 2);
    vehicle = new Vehicle(100,100);
    vehicle.vel.x = 2;


}

function draw() {
    background(0);

    path.show();

    let force = vehicle.followMulti(path);
    vehicle.applyForce(force); 
    vehicle.edges();
    vehicle.update();
    vehicle.show();
}
