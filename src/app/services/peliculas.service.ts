import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from "rxjs/operators";
import { CarteleraResponse, Movie } from '../interfaces/cartelera-response';
import { Cast, CreditsResponse } from '../interfaces/credits-response';
import { MovieDetails } from '../interfaces/movie-response';

@Injectable({
  providedIn: 'root'
})
export class PeliculasService {

  private baseUrl: string = 'https://api.themoviedb.org/3';
  private carteleraPage: number = 1;
  public cargando: boolean = false; // Para sabaer cuando estamos cargando info y no volver a hacerlo

  constructor(private http: HttpClient) { }

  get params() {
    return {
      api_key: 'ae3f52998eee0df4bbb47e627b161a51',
      language: 'es-ES',
      page: this.carteleraPage.toString()
    }
  }

  resetCarteleraPage() {
    this.carteleraPage = 1;
  }

  //getCartelera() : Observable<CarteleraResponse> {
  getCartelera() : Observable<Movie[]> {
    // Si ya esta cargando la info, ni siquiera nos conestamos al API
    if (this.cargando) {
      // Con of emitimos lo que querramos como un Observable
      return of([]);
    }

    this.cargando = true; // Empezamos a cargar la información

    return this.http.get<CarteleraResponse>(`${this.baseUrl}/movie/now_playing`, {
      params: this.params
    }).pipe(
      // Filtramos la respuesta que es un CarteleraResponse a solamente un objeto Movie[]
      map((resp) => resp.results),
      // tap lo unico que hace es disparar una especie de efecto secundario
      // Ejecuta algoa cada vez que el observable devuelve un valor
      tap(() => {
        // Aumentamos carteleraPage para traer la sgte pagina de peliculas en la sgte llamada
        this.carteleraPage += 1;
        this.cargando = false; // Terminamos de cargar la info
      })
    );
  }

  buscarPeliculas(texto: string): Observable<Movie[]>{

    const params = { ...this.params, page: '1', query: texto };

    return this.http.get<CarteleraResponse>(`${this.baseUrl}/search/movie`, {
      params // Tambien podria ser: params: this.params 
    }).pipe(
      map(response => response.results)
    );
  }

  getPeliculaDetalle(id: string): Observable<any> {
    return this.http.get<MovieDetails>(`${this.baseUrl}/movie/${id}`, {
      params: this.params
    }).pipe(
      // Si no se encuentra la película retorna un observable que contiene null. Notar que
      // convenientemente el Observable es del tipo any
      catchError(error => of(null))
    );
  }

  getCast(id: string): Observable<Cast[]> {
    return this.http.get<CreditsResponse>(`${this.baseUrl}/movie/${id}/credits`, {
      params: this.params
    }).pipe(
      // Hice este filtro porque cuando quiero traer kas imágenes de todos los actores (mas de 
      // 100) obtengo un error 429 (demasiadas peticiones al servidor)
      map(response => response.cast.filter(c => c.order != undefined &&  c.order < 30)),
      // Si no se encuentra la pelicula por id. se retorna un areglo vacio para ek caso del cast
      catchError(error => of([]))
    );
  }
}
