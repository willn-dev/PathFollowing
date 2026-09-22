let vehicle;
let path;

function setup() {
    createCanvas(800, 800);
    vehicle = new Vehicle(100,100);
    vehicle.vel.x = 2;

    path = new Path(0,400,800,400);

}

function draw() {
    background(0);

    path.end.y = mouseY;

     let force = vehicle.follow(path);
     vehicle.applyForce(force); 


    vehicle.edges();
    vehicle.update();
    vehicle.show();

    path.show();

}
