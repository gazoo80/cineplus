import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Movie } from '../../interfaces/cartelera-response';
import { PeliculasService } from '../../services/peliculas.service';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class BuscarComponent implements OnInit {

  public texto: string = '';
  public movies: Movie[] = [];
  public loading!: boolean;

  // ActivatedRoute: Para obtener los parámetros de ruta "buscar/{texto}""
  constructor(private activatedRoute: ActivatedRoute,
              private peliculasService: PeliculasService) { }

  ngOnInit(): void {
    // Recuperamos los parámetro de ruta a traves de un observable
    this.activatedRoute.params.subscribe((params: Params) => {
      console.log(params['texto']);

      this.texto = params['texto'];

      this.loading = true; // Decimos que la data está cargando

      this.peliculasService.buscarPeliculas(params['texto']).subscribe(
        movies => {
          console.log(movies);
          this.movies = movies;
          this.loading = false; // Decimos que la data ya cargó
        }
      );
    });
  }

}
