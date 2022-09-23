import { Component, OnInit } from '@angular/core';
import { PeliculasService } from '../../services/peliculas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  // Propiedad para acceder directamente al método getHistorial() en el servicio
  get historial() {
    return this.peliculasService.getHistorial(); // Retornamos un observable. Tambien podrimaos retornar solo un arreglo
  }

  constructor(private peliculasService: PeliculasService,
              private router: Router) { }

  ngOnInit(): void {
  }

  buscarPelicula(texto: string) {

    texto = texto.trim();

    if (texto.length === 0) {
      return;
    }

    this.router.navigate(['/buscar', texto]);

  }

}
