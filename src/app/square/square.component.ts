import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-square',
  template: `
    <button >{{ value }}</button>
  `,
  styles: [
  ]
})
export class SquareComponent {
  @Input() value!: 'X' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
}
