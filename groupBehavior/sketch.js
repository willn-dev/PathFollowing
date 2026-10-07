function make2dArray(cols, rows){
    //takes in two integers. returns an empty 2d arr at specified dimensions. 
    arrayTemp = new Array(cols);
    for(let i = 0; i < arrayTemp.length; i++){
        arrayTemp[i] = new Array(rows);
    }
    return arrayTemp;
}

let flock;
let grid;
let resolution = 40;
let cols;
let rows;


function setup() {
    createCanvas(800, 400);
    flock = new Flock();
    cols = (width / resolution);
    rows = (height / resolution);
    grid = make2dArray(cols,rows);


    for(i = 0; i < 1000; i ++){
        sendinfo = new Boids(random(height/2), random(width / 2));
        flock.add(sendinfo);
    }
}

function draw() {
    background(100);

    if(keyIsDown('Space')){
      stroke(0);
      strokeWeight(2);
      for(let i = 0; i <= cols; i++){
        let x = i * resolution;
        line(x,0, x, height);
      }

      for(let i = 0; i < rows; i++){
        let y = i * resolution;
        line(0, y, width, y);
      }

  }


    for(let i=0; i < cols; i++){
        for(let j=0; j < rows; j++){ //resets grid to be empty each frame. 
            grid[i][j] = [];
        }   
    }



    // assign boids their position.
    for(let boid of flock.boids){
        let column = floor(boid.pos.x / resolution);
        let row = floor(boid.pos.y / resolution);
        //constrain them to limits of the array
        column = constrain(column, 0, cols -1); // n, low, high
        row = constrain(row, 0, rows -1);

        grid[column][row].push(boid); // boid is now in grid at assigned point
    }

    flock.run();
}
