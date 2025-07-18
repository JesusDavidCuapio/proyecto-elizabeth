import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Home } from './home/home';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Home],
  template: '<app-home></app-home>',
  styleUrls: ['./app.css']
})
export class App {
  title = 'proyecto-elizabeth';
}