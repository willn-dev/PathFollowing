 let path;

function setup() {
    createCanvas(400, 400);
    a = createVector(100,-60);
    path = createVector(200,60);

}

function vectorProjection(a, path){
    let bCopy = path.copy().normalize();
    let sp = a.dot(bCopy);
    bCopy.mult(sp);
    return bCopy;
}



function draw() {
    background(0);
    strokeWeight(4);
    stroke(255);

    let pos = createVector(100,200);
    let mouse = createVector(mouseX, mouseY);
    let a = p5.Vector.sub(mouse, pos);


    line(pos.x, pos.y, pos.x + a.x, pos.y + a.y);
    line(pos.x, pos.y, pos.x + path.x, pos.y + path.y);

    let vp = vectorProjection(a,path);
    strokeWeight(8);
    stroke(0,0,255);
    line(pos.x, pos.y, pos.x + vp.x, pos.y + vp.y);


    //normal line
    stroke(255);
    strokeWeight(2);
    line(vp.x + pos.x, vp.y + pos.y, mouse.x, mouse.y);

    //end of scalar projection
    fill(255,0,0);
    noStroke();
    circle(vp.x + pos.x, vp.y + pos.y, 16);

    //top of hypotenuse
    fill(0,0, 255);
    circle(mouse.x, mouse.y, 16);

    // vertex, hyp/adj
    noStroke();
    fill(0,255,0);
    circle(pos.x,pos.y, 16);
}
