import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PokemonModule } from './pages/pokemon/pokemon.module';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, PokemonModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = 'pokemon-angular';
}
