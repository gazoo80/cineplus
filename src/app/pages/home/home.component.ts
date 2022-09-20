import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { PeliculasService } from '../../services/peliculas.service';
import { Movie } from '../../interfaces/cartelera-response';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  public movies: Movie[] = [];
  public moviesSlideshow: Movie[] = [];
  public loading!: boolean;

  constructor(private peliculasService: PeliculasService) { 
  }
 
  ngOnInit(): void {
    this.loading = true; // Decimos que la data está cargando

    this.peliculasService.getCartelera().subscribe(
      movies => {
        console.log(movies);
        this.movies = movies;
        this.moviesSlideshow = movies;
        this.loading = false; // Decimos que la data ya cargó
      } 
    );
  }

  // Se eejecutacunadoel componente es destruido, por ejm cuando navego a otra ruta
  ngOnDestroy(): void {
    this.peliculasService.resetCarteleraPage();
  }

  // Este método se va a disparar cada vez que se dispare el evento scroll del objeto window
  @HostListener('window:scroll', ['$event'])
  onScroll() {
    console.log('hola');
    // Posición del scroll
    const pos = (document.documentElement.scrollTop || document.body.scrollTop) + 1300;
    
    // Se llega a la totalida d el height en un momento dado en la pantalla
    const max = (document.documentElement.scrollHeight || document.body.scrollHeight);

    // Cuando pso supere a max llamamos un servicio
    if (pos > max) {
      // Si la info ya esta cargando salimos. No hacemos nada
      if (this.peliculasService.cargando) { 
        return;
      }

      console.log(pos, max);
      console.log('llamar servicio');
      this.peliculasService.getCartelera().subscribe(movies => {
        // Añadimos el sgte bloque de películas a la lista de películas
        this.movies.push(...movies);
      });
    } 
  }

}
