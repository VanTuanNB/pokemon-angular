import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { POKEMON_LEGEND_OPTIONS, POKEMON_PROPERTY, POKEMON_TYPE_COLOR } from '../../core/constants/common.constant';
import { DebounceDecorator } from '../../core/decorators/debounce.decorator';
import { CommonService } from '../../core/services/common/common.service';
import { IGetListPokemon, IPokemonModel, IPokemonType } from '../../core/services/pokemon/models/pokemon.model';
import { PokemonService } from '../../core/services/pokemon/pokemon.service';

type LegendOptions = {
    label: string;
    value: string;
};

export type ICustomPokemonType = IPokemonType & {
    color: string;
    label: string;
    value: number;
};

type ICustomPokemonModel = IPokemonModel & {
    properties: any[];
    type: ICustomPokemonType;
};

@Component({
    selector: 'app-pokemon',
    templateUrl: './pokemon.component.html',
    styleUrl: './pokemon.component.scss',
})
export class PokemonComponent implements OnInit {
    @ViewChild('lazyLoadElement', { static: false }) lazyLoadElement: ElementRef<HTMLDivElement> | null = null;
    public pokemons: ICustomPokemonModel[] = [];
    public types: ICustomPokemonType[] = [];
    public pokemonSelected: string = '';
    public filterParams = {
        page: 1,
        size: 21,
        type: null,
        totals: undefined,
        attack: undefined,
        speed: undefined,
        defense: undefined,
        spAtk: undefined,
        spDef: undefined,
        hp: undefined,
        generation: undefined,
        legendary: null,
        name: undefined,
    };
    public pokemonPreviewing: string = '';
    public legendOptions: LegendOptions[] = [];

    // private properties
    private propertyRenderKeys: string[] = ['hp', 'attack', 'defense', 'speed', 'total'];
    private lazyLoadConfig = {
        currentLength: 0,
        totalItems: 1,
        isFetching: false,
    };

    constructor(private pokemonService: PokemonService, private commonService: CommonService) {}
    ngOnInit(): void {
        this.initConfigConstants();
        this.getPokemonTypes();
    }

    private initConfigConstants() {
        this.legendOptions = Object.keys(POKEMON_LEGEND_OPTIONS).map((key) => ({
            ...(POKEMON_LEGEND_OPTIONS as any)[key],
        }));
    }

    private formatFilterParams(): IGetListPokemon {
        const params: Partial<IGetListPokemon> = {
            'page[number]': this.filterParams.page,
            'page[size]': this.filterParams.size,
            'filter[type]': typeof this.filterParams.type === 'number' ? this.filterParams.type : undefined,
            'filter[min_total]': this.filterParams.totals ? this.filterParams.totals[0] : undefined,
            'filter[max_total]': this.filterParams.totals ? this.filterParams.totals[1] : undefined,
            'filter[min_attack]': this.filterParams.attack ? this.filterParams.attack[0] : undefined,
            'filter[max_attack]': this.filterParams.attack ? this.filterParams.attack[1] : undefined,
            'filter[min_defense]': this.filterParams.defense ? this.filterParams.defense[0] : undefined,
            'filter[max_defense]': this.filterParams.defense ? this.filterParams.defense[1] : undefined,
            'filter[min_speed]': this.filterParams.speed ? this.filterParams.speed[0] : undefined,
            'filter[max_speed]': this.filterParams.speed ? this.filterParams.speed[1] : undefined,
            'filter[min_sp_atk]': this.filterParams.spAtk ? this.filterParams.spAtk[0] : undefined,
            'filter[max_sp_atk]': this.filterParams.spAtk ? this.filterParams.spAtk[1] : undefined,
            'filter[min_sp_def]': this.filterParams.spDef ? this.filterParams.spDef[0] : undefined,
            'filter[max_sp_def]': this.filterParams.spDef ? this.filterParams.spDef[1] : undefined,
            'filter[min_hp]': this.filterParams.hp ? this.filterParams.hp[0] : undefined,
            'filter[max_hp]': this.filterParams.hp ? this.filterParams.hp[1] : undefined,
            'filter[legendary]':
                typeof this.filterParams.legendary === 'number' ? this.filterParams.legendary : undefined,
            'filter[name]': this.filterParams.name ? this.filterParams.name : undefined,
        };
        return Object.keys(params).reduce((acc: any, key: any) => {
            if (acc[key] !== undefined && acc[key] !== null) {
                acc[key] = acc[key];
            } else {
                delete acc[key];
            }
            return acc;
        }, params);
    }

    private getPokemonTypes() {
        return this.pokemonService.getTypes().subscribe({
            next: (response) => {
                if (response.success && Array.isArray(response.data) && response.data.length) {
                    this.types = response.data.map((type) => {
                        return {
                            ...type,
                            value: type.id,
                            name: type.name.toUpperCase(),
                            label: type.name,
                            color: (POKEMON_TYPE_COLOR as any)[type.id as number],
                        };
                    });
                    this.getListPokemon();
                } else {
                    this.types = [];
                }
            },
            error: (err) => {
                this.types = [];
                console.log('error', err);
            },
        });
    }

    private getListPokemon() {
        this.commonService.loadingHandler('#container', true);
        const queryParams = this.formatFilterParams();
        return this.pokemonService.getList(queryParams).subscribe({
            next: (response) => {
                if (response.success && Array.isArray(response.data) && response.data.length) {
                    this.pokemons = this.convertPokemonToRender(response.data);
                    this.pokemonSelected = this.pokemons[0].id;
                } else {
                    this.pokemons = [];
                    this.pokemonSelected = '';
                }
                this.commonService.loadingHandler('#container');
            },
            error: (err) => {
                this.pokemons = [];
                this.pokemonSelected = '';
                this.commonService.loadingHandler('#container');
                console.log('error', err);
            },
        });
    }

    private getLazyLoadPokemon() {
        this.commonService.loadingHandler('#lazy-loading', true);
        this.lazyLoadConfig.isFetching = true;
        const queryParams = this.formatFilterParams();
        return this.pokemonService.getList(queryParams).subscribe({
            next: (response) => {
                if (response.success && Array.isArray(response.data) && response.data.length) {
                    const listPokemon = this.convertPokemonToRender(response.data);
                    this.pokemons = this.pokemons.concat(listPokemon);
                    this.lazyLoadConfig.currentLength = this.pokemons.length;
                    this.lazyLoadConfig.totalItems = response.meta.total;
                } else {
                    this.lazyLoadConfig.currentLength = 0;
                    this.lazyLoadConfig.totalItems = 1;
                    this.pokemons = [];
                }
                this.lazyLoadConfig.isFetching = false;
                this.commonService.loadingHandler('#lazy-loading');
            },
            error: (err) => {
                this.pokemons = [];
                this.lazyLoadConfig.currentLength = 0;
                this.lazyLoadConfig.totalItems = 1;
                this.lazyLoadConfig.isFetching = false;
                this.commonService.loadingHandler('#lazy-loading');
                console.log('error', err);
            },
        });
    }

    private convertPokemonToRender(data: IPokemonModel[]) {
        return data.map((pokemon) => {
            return {
                ...pokemon,
                properties: this.propertyRenderKeys.map((key: string) => {
                    return {
                        ...(POKEMON_PROPERTY as any)[key],
                        value: (pokemon as any)[key],
                    };
                }),
                type: this.types.find((type: any) => type.id === pokemon.type_1),
            };
        }) as ICustomPokemonModel[];
    }

    public trackBy(index: number, item: IPokemonModel) {
        return item.id;
    }

    public onSelectPokemon(pokemon: ICustomPokemonModel) {
        this.pokemonSelected = pokemon.id;
    }

    onLazyLoad() {
        if (!this.lazyLoadElement || this.lazyLoadConfig.isFetching) return;
        const nativeElement = this.lazyLoadElement.nativeElement;
        if (!nativeElement) return;
        if (
            nativeElement.clientHeight + Math.round(nativeElement.scrollTop) === nativeElement.scrollHeight &&
            this.lazyLoadConfig.currentLength !== this.lazyLoadConfig.totalItems
        ) {
            this.filterParams.page += 1;
            this.getLazyLoadPokemon();
        }
    }

    public onPokemonPreviewing(pokemonId: string) {
        this.pokemonPreviewing = pokemonId;
    }

    public onSubmitSearch() {
        this.filterParams.page = 1;
        this.filterParams.size = 21;
        this.getListPokemon();
    }

    @DebounceDecorator(500)
    public onSearchByKeyword() {
        this.onSubmitSearch();
    }

    test() {
        console.log(this.filterParams);
    }
}
