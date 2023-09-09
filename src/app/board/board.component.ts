import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  truth!: any[];
  squares!: any[];
  win!: boolean;
  mines = 40;
  length = 16
  width = 16

  constructor() {}

  ngOnInit() {
    this.newGame();
  }
  newGame() {
    this.truth = Array((this.length * this.width) - this.mines).fill(null);
    for (let i = 0; i < this.mines; i++) {
      let randomIndex = Math.floor(Math.random() * this.truth.length + 1);
      this.truth.splice(randomIndex, 0, 'X');
    }
    for (let i = 0; i < this.truth.length; i++) {
      if (this.truth[i] == null) this.countNeighbors(i);
    }
    this.squares = Array(this.length * this.width).fill(null);
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
        if (this.truth[neighborIndex] === 'X') {
          count++;
        }
      }
    }

    this.truth[index] = count.toString();
  }
  
  makeMove(idx: number) {
    if (!this.squares[idx]) {
      this.squares.splice(idx, 1, this.truth[idx]);
    }
    this.checkWinorLoss(idx);
  }
  checkWinorLoss(idx: number) {
    if (this.squares[idx] == 'X') this.win = false;
    for (let i = 0; i < (this.length * this.width); i++) {
      if (this.truth[i] != 'X' && this.squares[i] == null) return; 
    }
    return this.win = true;
  }



}
