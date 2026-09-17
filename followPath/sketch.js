let vehicle;
let path;

function setup() {
    createCanvas(400, 400);
    vehicle = new Vehicle(100,100);
    vehicle.vel.x = 2;

    path = new Path(0,200,400,200);

}

function draw() {
    background(0);

    let force = vehicle.follow(path);
    vehicle.applyForce(force);


    vehicle.edges();
    vehicle.update();
    vehicle.show();

    path.show();

}
