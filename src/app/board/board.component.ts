import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  truth!: any[];
  revealed!: any[];
  gameOver: boolean = false;
  isWin: boolean = false;
  mines = 40;
  length = 16;
  width = 16;
  time = 0;
  flagsLeft = 40;
  timerId: any;


  constructor() {}

  ngOnInit() {
    this.newGame();
    this.timerId = setInterval(() => {
      this.time++;
    }, 1000);
  }
  newGame() {
    this.time = 0;
    this.gameOver = false;
    this.truth = Array((this.length * this.width) - this.mines).fill("");
    for (let i = 0; i < this.mines; i++) {
      let randomIndex = Math.floor(Math.random() * this.truth.length + 1);
      this.truth.splice(randomIndex, 0, "X");
    }
    for (let i = 0; i < this.truth.length; i++) {
      if (this.truth[i] == "") this.countNeighbors(i);
    }
    this.revealed = Array(this.length * this.width).fill(false);

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
    if (this.gameOver) return;
    if (this.revealed[idx] == "F" || this.revealed[idx] == true) return;
    
    this.revealed[idx] = true;
    
    if (this.truth[idx] == "0") {
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
        if (this.revealed[newIdx] == false) {
          // If it's a zero, continue revealing
          this.revealed[newIdx] = true;
          if (this.truth[newIdx] == "0") {
            this.revealAdjacentZeros(newIdx);
          }
        }
      }
    }
  }
  
  checkWinorLoss(idx: number) {
    if (this.truth[idx] == "X") {
      this.gameOver = true;
      this.isWin = false;
    }
    for (let i = 0; i < (this.length * this.width); i++) {
      if (this.truth[i] != "X" && this.revealed[i] == false) return; 
    }
    this.gameOver = true;
    this.isWin = true;
  }
  flag(idx: number, event:MouseEvent) {
    event.preventDefault();
    if (this.gameOver) return;
    if (this.revealed[idx] == true) return;
    if (this.revealed[idx] == "F") {
      this.revealed[idx] = false;
      this.flagsLeft++;
    }
    else {
      this.revealed[idx] = "F";
      this.flagsLeft--;
    }
   }
  getColor(idx: number) {
    if (this.revealed[idx] == true && this.truth[idx] == "X") return "#FF0000"
    if (this.revealed[idx] == false || this.revealed[idx] == "F") return "primary";
    else return "black";
  }
  getTextColor(idx: number) {
    let val: string = this.truth[idx];
    let color: string;
    if (this.revealed[idx] == "F") return "#FFFFFF"
    switch (val) {
      case "1":
        color = "#4d4dff"; // Neon Blue
        break;
      case "2":
        color = "#0FFF00"; // Neon Green
        break;
      case "3":
        color = "#FF000D"; // Neon Red
        break;
      case "4":
        color = "#FFF700"; // Neon Yellow
        break;
      case "5":
        color = "#FF69B4"; // Neon Pink
        break;
      case "6":
        color = "#FFA500"; // Neon Orange
        break;
      case "7":
        color = "#9400D3"; // Neon Purple
        break;
      case "8":
        color = "#00FFFF"; // Neon Teal
        break;
      case "X":
        color = this.revealed[idx] == true ? "#000000" : "#FFFFFF"
        break;
      default:
        color = "#FFFFFF"; // Default to white if none of the cases match
        break;
    }
    return color;
  }
  
  getVal(idx: number) {
    if (this.revealed[idx] == "F") return "F";
    return (this.revealed[idx] && this.truth[idx] != "0") ? this.truth[idx] : "";
  }
}