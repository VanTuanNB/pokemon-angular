import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../../core/core.module';
import { PokemonItemComponent } from './components/pokemon-item/pokemon-item.component';
import { PokemonComponent } from './pokemon.component';

@NgModule({
    declarations: [PokemonComponent, PokemonItemComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, CoreModule],
    exports: [PokemonComponent],
})
export class PokemonModule {}
