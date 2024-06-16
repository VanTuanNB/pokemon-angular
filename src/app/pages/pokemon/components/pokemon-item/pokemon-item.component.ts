import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { forkJoin } from 'rxjs';
import { POKEMON_PROPERTY } from '../../../../core/constants/common.constant';
import { ApiResponse } from '../../../../core/services/common.model';
import { CommonService } from '../../../../core/services/common/common.service';
import { IPokemonModel } from '../../../../core/services/pokemon/models/pokemon.model';
import { PokemonService } from '../../../../core/services/pokemon/pokemon.service';
import { ICustomPokemonType } from '../../pokemon.component';

type ICustomPokemonModel = IPokemonModel & {
    thumbnail?: string;
    properties: any[];
    type: { label: string; color: string };
};

@Component({
    selector: 'app-pokemon-item',
    templateUrl: './pokemon-item.component.html',
    styleUrl: './pokemon-item.component.scss',
})
export class PokemonItemComponent {
    @Input() public pokemonId: string = '';
    @Input() types: ICustomPokemonType[] = [];
    @Output() onPokemonPreviewing = new EventEmitter();
    public pokemonInfo: ICustomPokemonModel = {} as ICustomPokemonModel;
    public isFetching: boolean = false;
    private pokemonTypeMapping = new Map<number, ICustomPokemonType>();

    constructor(private pokemonService: PokemonService, private commonService: CommonService) {}

    ngOnChanges(changes: SimpleChanges): void {
        const { pokemonId } = changes;
        if (pokemonId && pokemonId.currentValue) {
            this.pokemonId = pokemonId.currentValue;
            if (!this.isFetching) this.getPokemonInfo();
        } else {
            this.pokemonInfo = {} as ICustomPokemonModel;
        }

        if (!this.pokemonTypeMapping.size) {
            this.types.forEach((type) => {
                this.pokemonTypeMapping.set(type.id, type);
            });
        }
    }

    getPokemonInfo(): void {
        this.commonService.loadingHandler('#layout-right', true);
        this.isFetching = true;
        forkJoin(
            this.pokemonService.getDetail(this.pokemonId),
            this.pokemonService.getImagePokemon(this.pokemonId),
        ).subscribe({
            next: ([resDetail, resThumbnail]: [ApiResponse<IPokemonModel>, Blob]) => {
                if (resDetail.success && resDetail.data && resThumbnail) {
                    this.pokemonInfo = Object.assign(resDetail.data, {
                        properties: Object.keys(POKEMON_PROPERTY).map((key: string) => ({
                            ...(POKEMON_PROPERTY as any)[key],
                            value: (resDetail.data as any)[key],
                        })),
                        type: (this.pokemonTypeMapping.get(resDetail.data.type_1) || {}) as ICustomPokemonType,
                        thumbnail: URL.createObjectURL(resThumbnail),
                    });

                    this.onPokemonPreviewing.emit(this.pokemonInfo.id);
                } else {
                    this.pokemonInfo = {} as ICustomPokemonModel;
                }
                this.commonService.loadingHandler('#layout-right');
                this.isFetching = false;
            },
            error: (error) => {
                console.log('error', error);
                this.pokemonInfo = {} as ICustomPokemonModel;
                this.commonService.loadingHandler('#layout-right');
                this.isFetching = false;
            },
        });
    }
}
