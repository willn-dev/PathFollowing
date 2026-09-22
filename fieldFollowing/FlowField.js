class FlowField{
    
  constructor(){
    this.resolution = 10;
    this.cols = floor(width/this.resolution);
    this.rows = floor(height/this.resolution);
    this.field = new Array(cols);

    //constructing blank 2d array at size specified by canvas : resolution ratio

    for(let i = 0; i < this.cols; i ++){
      this.field[i] = new Array(this.rows); // creating an array as a class allows us to specify amount of indices  
    }
  }

  setRandom(){
    for(let i = 0; i < this.cols; i++){
      for(let j = 0; j < this.rows; j++){
        this.field[i][j] = p5.Vector.random2D();
      }
    }
  }






}