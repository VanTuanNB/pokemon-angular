import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputNumberComponent } from './components/input-number/input-number.component';
import { InputRangeComponent } from './components/input-range/input-range.component';
import { InputComponent } from './components/input/input.component';
import { PropertyItemComponent } from './components/property-item/property-item.component';
import { SelectComponent } from './components/select/select.component';
import { TagComponent } from './components/tag/tag.component';
import { PokemonService } from './services/pokemon/pokemon.service';

@NgModule({
    declarations: [
        SelectComponent,
        InputComponent,
        InputNumberComponent,
        PropertyItemComponent,
        TagComponent,
        InputRangeComponent,
    ],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
    exports: [
        SelectComponent,
        InputComponent,
        InputNumberComponent,
        PropertyItemComponent,
        TagComponent,
        InputRangeComponent,
    ],
    providers: [PokemonService],
})
export class CoreModule {}
