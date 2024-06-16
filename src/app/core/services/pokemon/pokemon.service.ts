import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../api.url';
import { ApiResponse } from '../common.model';
import { IGetListPokemon, IPokemonModel, IPokemonType } from './models/pokemon.model';

@Injectable({
    providedIn: 'root',
})
export class PokemonService {
    constructor(private httpClient: HttpClient) {}

    public getList(queryParams: IGetListPokemon): Observable<ApiResponse<IPokemonModel[]>> {
        return this.httpClient.get<ApiResponse<IPokemonModel[]>>(API_URL.POKEMON_MODULE.GET_LIST.ENDPOINT, {
            params: queryParams,
        });
    }

    public getTypes(): Observable<ApiResponse<IPokemonType[]>> {
        return this.httpClient.get<ApiResponse<IPokemonType[]>>(API_URL.POKEMON_MODULE.GET_TYPES.ENDPOINT);
    }

    public getDetail(id: string): Observable<ApiResponse<IPokemonModel>> {
        return this.httpClient.get<ApiResponse<IPokemonModel>>(
            API_URL.POKEMON_MODULE.GET_BY_ID.ENDPOINT.replace(':id', id),
        );
    }

    public getImagePokemon(id: string): Observable<Blob> {
        return this.httpClient.get<Blob>(API_URL.POKEMON_MODULE.GET_SPRITE.ENDPOINT.replace(':id', id), {
            responseType: 'blob' as any,
        });
    }
}
