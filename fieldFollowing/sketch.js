let flowfield;
let vehicles = [];
let vehicleAmount = 10;
let zoff = 0;

function setup() {
  createCanvas(800, 400);
  flowfield = new FlowField(16);

  for(let i = 0; i < vehicleAmount; i++){
    vehicles.push(new Vehicle(random(width), random(height), random(2,5), 0.1));
  }
  
  
}

function draw() {
    background(0);
    flowfield.perlinFieldMotion(zoff);
    flowfield.show();
    for(let i = 0; i < vehicles.length; i++){
        vehicles[i].follow(flowfield);
        vehicles[i].run();
    }

    console.log(noise(0.5, 0.5, zoff));
    zoff += 0.001;
}