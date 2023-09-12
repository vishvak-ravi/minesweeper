import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  truth!: any[];
  squares!: any[];
  gameOver: boolean = false;
  isWin: boolean = false;
  mines = 40;
  length = 16
  width = 16

  constructor() {}

  ngOnInit() {
    this.newGame();
  }
  newGame() {
    this.gameOver = false;
    this.truth = Array((this.length * this.width) - this.mines).fill("");
    for (let i = 0; i < this.mines; i++) {
      let randomIndex = Math.floor(Math.random() * this.truth.length + 1);
      this.truth.splice(randomIndex, 0, "X");
    }
    for (let i = 0; i < this.truth.length; i++) {
      if (this.truth[i] == "") this.countNeighbors(i);
    }
    this.squares = Array(this.length * this.width).fill("");
  }
  countNeighbors(index: number) {
    const x = index % this.width;
    const y = Math.floor(index / this.width);
    let count = 0;

    // Offsets to check neighbors
    const offsets = [
      [-1, -1], [-1, 0], [-1, 1],
      [ 0, -1],          [ 0, 1],
      [ 1, -1], [ 1, 0], [ 1, 1]
    ];

    for (const [dx, dy] of offsets) {
      const newX = x + dx;
      const newY = y + dy;

      if (newX >= 0 && newX < this.width && newY >= 0 && newY < this.length) {
        const neighborIndex = newY * this.width + newX;
        if (this.truth[neighborIndex] == "X") {
          count++;
        }
      }
    }
    this.truth[index] = count.toString();
  }
  
  makeMove(idx: number) {
    if (this.squares[idx] == "F") return;
    
    this.squares.splice(idx, 1, this.truth[idx]);
    
    if (this.squares[idx] == "0") {
      this.revealAdjacentZeros(idx);
    }
    this.checkWinorLoss(idx);
  }
  
  revealAdjacentZeros(idx: number) {
    // Assuming a 16x16 board
    const rows = 16;
    const cols = 16;
  
    // Calculate row and column
    const r = Math.floor(idx / rows);
    const c = idx % cols;
  
    // Offsets for adjacent cells in a 2D grid
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];
  
    for (let [dr, dc] of directions) {
      const newRow = r + dr;
      const newCol = c + dc;
      const newIdx = newRow * rows + newCol;
  
      // Boundary check
      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
        // Skip if already revealed
        if (this.truth[newIdx] != "F" && this.squares[newIdx] == "") {
          this.squares.splice(newIdx, 1, this.truth[newIdx]);
  
          // If it's a zero, continue revealing
          if (this.truth[newIdx] == "0") {
            this.revealAdjacentZeros(newIdx);
          }
        }
      }
    }
  }
  
  checkWinorLoss(idx: number) {
    if (this.squares[idx] == "X") {
      this.gameOver = true;
      this.isWin = false;
    }
    for (let i = 0; i < (this.length * this.width); i++) {
      if (this.truth[i] != "X" && this.squares[i] == "") return; 
    }
    this.gameOver = true;
    this.isWin = true;
  }
  flag(idx: number, event:MouseEvent) {
    event.preventDefault();
    this.squares[idx] = (this.squares[idx] != "F") ? "F" : "";
  }
}
