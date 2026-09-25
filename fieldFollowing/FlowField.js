class FlowField{
  
  /**
   * @param {int} r -ratio of screen to cells in array
   */
  constructor(r){
    this.resolution = r;
    this.cols = floor(width/this.resolution);
    this.rows = floor(height/this.resolution);


    this.field = new Array(this.cols);
    for(let i = 0; i < this.cols; i ++){
      this.field[i] = new Array(this.rows); // creating an array as a class allows us to specify amount of indices  
    }

    this.init(); //populate array with vector values.
  }


  init(){

    noiseSeed(random(1000));
    let xoff = 0;

    for(let i = 0; i < this.cols; i++){
      let yoff = 0;
      for(let j = 0; j < this.rows; j++){
         let angle = map(noise(xoff, yoff), 0, 1, 0, TWO_PI);
         yoff += 0.1; 
         this.field[i][j] = p5.Vector.fromAngle(angle);
      }
      xoff += 0.1;
    }
  }


  /**
   * @param {Vector} position 
   * @returns {Vector} -a position of which cell the object is on. 
   */
  lookup(position){
    let column = constrain(floor(position.x / this.resolution), 0, this.cols -1);
    let row = constrain(floor(position.y / this.resolution), 0, this.rows - 1);
      return this.field[column][row].copy(); // copy to ensure that its a copy of the vector returned.
  }


  show(){ //I needed to reference Shiffmans implementation here. I should draw it out later to 
    //better understand itt
    for(let i = 0; i < this.cols; i++){
      for(let j = 0; j < this.rows; j++){

        let w = width / this.cols; 
        let h = height / this.rows;
        let v = this.field[i][j].copy();
        v.setMag(w * 0.5);
        let x = i * w + w / 2;
        let y = j * h + h / 2; 
        stroke(255);
        strokeWeight(1);
        line(x, y, x + v.x, y + v.y);
      }
    }
  }


 //-------------------------FIELD GENERATION TYPES (not used currently------------------------------------
  randomField(){
    for(let i = 0; i < this.cols; i++){
      for(let j = 0; j < this.rows; j++){
        this.field[i][j] = p5.Vector.random2D();
      }
    }
  }

  perlinFieldMotion(zoff){
    let xoff = 0;
    for(let i = 0; i < this.cols; i++){
      let yoff = 0;

      for(let j = 0; j < this.rows; j++){
        
        let angle = map(noise(xoff, yoff, zoff), 0, 1, 0, (4 * PI));
        yoff += 0.1; 
        this.field[i][j] = p5.Vector.fromAngle(angle);
      }
      xoff += 0.1;
    }
  }
}


