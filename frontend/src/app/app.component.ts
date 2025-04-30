import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
