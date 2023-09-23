import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-square',
  template: `
    <button mat-flat-button [ngStyle]="{'background-color': color, 'color': textColor}">{{ value }}</button>
  `,
  styles: ['button { width: 100% !important; height: 100% !important; font-size: 1em; padding: 0; box-sizing: border-box;}']
})
export class SquareComponent {
  @Input() value!: 'X' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | "";
  @Input() color!: string;
  @Input() textColor!: string;
}
