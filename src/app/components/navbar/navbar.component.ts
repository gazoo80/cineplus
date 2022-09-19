import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  // Obtenemos una referencia a la caja de texto en la nav bar, la cual usamos para busquedas
  @ViewChild('txtBuscar') txtBuscar!: ElementRef<HTMLInputElement>;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  buscarPelicula(texto: string) {

    texto = texto.trim();

    if (texto.length === 0) {
      return;
    }

    // Seteamos el valor de la caja a vacío para limpiarla
    // OJO: Tambien podriamos usar esta referencia para obtener el valor ingresdao en la caja de 
    // texto y ya no seria necesario enviarlo en la invocacion al metodo buscarPelicula()
    this.txtBuscar.nativeElement.value = '';

    this.router.navigate(['/buscar', texto]);

  }

}
