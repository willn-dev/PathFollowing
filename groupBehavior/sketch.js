let flock;

function setup() {
    createCanvas(800, 400);
    this.flock = new Flock();

    for(i = 0; i < 100; i ++){
        sendinfo = new Boids(random(height/2), random(width / 2));

        this.flock.add(sendinfo);
    }
}

function draw() {
    background(100);
    this.flock.run();
}
