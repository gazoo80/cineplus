import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from "rxjs/operators";
import { CarteleraResponse, Movie } from '../interfaces/cartelera-response';
import { Cast, CreditsResponse } from '../interfaces/credits-response';
import { MovieDetails } from '../interfaces/movie-response';
import { YoutubeResponse } from '../interfaces/youtube-resposne';

@Injectable({
  providedIn: 'root'
})
export class PeliculasService {

  private baseUrl: string = 'https://api.themoviedb.org/3';
  private carteleraPage: number = 1;
  public cargando: boolean = false; // Para sabaer cuando estamos cargando info y no volver a hacerlo
  private _historial: string[] = []; // Para ir almacenando los criterios de búsqueda
  private baseUrlAPIYoutube: string = 'https://youtube.googleapis.com/youtube/v3/search';

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

    this.adminHistorial(texto);

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

  getTrailerPelicula(titulo: string): Observable<string> {
   
    const params = new HttpParams()
        .set('part', 'snippet')
        .set('maxResults', '5')
        .set('q', `${titulo} trailer`)
        .set('key', 'AIzaSyDmAE9ZCUWGPmcRAxBrbbxE4WalpAu0sMQ');

    return this.http.get<YoutubeResponse>(this.baseUrlAPIYoutube, {
      params: params
    }).pipe(
      // Obtenemos siempre el primer elemento de la respuesta (items) y obtenemos el id del video
      map(response => response.items[0].id.videoId),

      // Si hay algun problema retornamos un string vacio que sera emitido por el observable
      catchError(error => of(''))
    );
  }

  private adminHistorial(texto: string = '') {

    // Para hacer la evaluación solo en letras minusculas
    texto = texto.trim().toLocaleLowerCase(); 

    // Si no se encuentra ya el texto en el arreglo, lo agregamos
    if (!this._historial.includes(texto)) {
      // Almacenamos el criterio de búsqueda en el arreglo de historial
      // Lo agregamso al inicio y no al final (push)
      this._historial.unshift(texto);

      // Cortamos el arreglo para mostrar solo los 10 más recientes criterios de búsqueda
      this._historial = this._historial.splice(0, 10);

      // Almacenamos el historial en localStorage para que no desaparezca cuando refrescamos
      localStorage.setItem("historial", JSON.stringify(this._historial));
    }
    
    console.log(this._historial);
  }

  getHistorial(): Observable<string[]> {

    // Obtenemos el arreglo de localStorage donde lo guardamos y los asignaos al arreglo en la 
    // aplicación
    const arrayHistorial = localStorage.getItem("historial");

    // Si lo obtenido del localStorage es difrente de null, lo parseamos hacia el arreglo
    if (arrayHistorial !== null) {
      this._historial = JSON.parse(arrayHistorial);
    }
    
    // Para que no haya posibilidad de modificar el arreglo principal. Ya que los arreglos
    // son objetos a los que se puede acceder por referencia
    return of([...this._historial]);
  }
}
