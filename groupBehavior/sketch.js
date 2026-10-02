let vehicles = [];
let vehicleCount = 100;

function setup() {
    createCanvas(800, 600);
    for(i = 0; i < vehicleCount; i ++){
        vehicles.push(new Vehicle(random(width), random(height)));
    }
}

function draw() {
    background(100);
    let target = createVector(mouseX,mouseY);
    for(let vehicle of vehicles){
        vehicle.seek(target);
        vehicle.separate(vehicles);
        vehicle.update();
        vehicle.show();
    }
}
