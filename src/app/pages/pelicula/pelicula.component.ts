import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieDetails } from 'src/app/interfaces/movie-response';
import { PeliculasService } from '../../services/peliculas.service';
import { Cast } from '../../interfaces/credits-response';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-pelicula',
  templateUrl: './pelicula.component.html',
  styleUrls: ['./pelicula.component.css']
})
export class PeliculaComponent implements OnInit {

  public pelicula!: MovieDetails;
  public cast: Cast[] = []; 

  constructor(private activatedRoute: ActivatedRoute,
              private peliculaService: PeliculasService,
              private location: Location,
              private router: Router) { }

  ngOnInit(): void {
    // Desestructuración para obtener el id o cualquier otra proppiedad
    // Snapshot devuelve solo una especie de objeto. No un observable
    const { id } = this.activatedRoute.snapshot.params; 

    console.log(id);

    //#region Suscripción a Observables (Forma no optimizada)
    /*  
    // Obtenemos el detalle de la película
    this.peliculaService.getPeliculaDetalle(id).subscribe(
      movie => { 
        console.log(movie);

        // Si la peliculas es igual a null, navegamos a '/home' y salimos
        if (movie === null) {
          this.router.navigateByUrl('/home');
          return;
        }
        
        this.pelicula = movie; 
      }
    );

    // Obtenemos el reparto de la película. Cast puede ser un arrglo vacio si la pelicula
    // no existe
    this.peliculaService.getCast(id).subscribe(
      cast => {
        console.log(cast);
        // Para que el cast solo contenga actores cuyo profile_path (su imagen) sea diferente de null
        this.cast = cast.filter(actor => actor.profile_path != null);
      }
    );
    */
    //#endregion
    
    // Forma optimizada: Usando combineLast cuando nos  vamos a suscribir a varios observables 
    // en la misma funcionalidad
    // combineLast: Recibe una cantidad "X" de Observables y devuelve un objeto (un arreglo) con
    // todas las respuestas de los Observables cuando ya han emitido por lo menos un valor todos

    combineLatest([
      // Observable que devolvera el detalle de la película
      this.peliculaService.getPeliculaDetalle(id),
      // Observable que devolvera el reparto de la película.
      this.peliculaService.getCast(id)
    ]).subscribe(([movie, cast]) => { // Desestructuramos la respuestas de los observables
     
      // Manejamos la respuesta del observable que emite la movie
      if (movie === null) { // Si la peliculas es igual a null, navegamos a '/home' y salimos
        this.router.navigateByUrl('/home');
        return;
      }
      
      this.pelicula = movie; 

      // Manejamos la respuesta del observable que emite el cast de la movie
      this.cast = cast.filter(actor => actor.profile_path != null);
    });

  }

  onRegresar() {
    // Oara regresar a la pantalla anterior en la que haya estado el usuario (Puede haber venido
    // de la cartelera o de la búsqueda, etc.)
    this.location.back();
  }

}
