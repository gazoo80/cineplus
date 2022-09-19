import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import Swiper from 'swiper';
import { Movie } from '../../interfaces/cartelera-response';

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.css']
})
export class SlideshowComponent implements OnInit, AfterViewInit {

  // Para no estar obligado a inicializar la variable, podemos colocarle signo de interrogación o
  // cambiar la configuración strict en tsconfig.json
  @Input() movies!: Movie[];

  public mySwiper!: Swiper;

  constructor() { }
  
  ngOnInit(): void {
    console.log(this.movies);
  }

  // Se ejecuta después de que los elementos de la interfaz ya estan construidos 
  ngAfterViewInit(): void {
    this.mySwiper = new Swiper('.swiper', {
      // Optional parameters
      //direction: 'vertical',
      loop: true,
    });  
  }

  onSlidePrev() {
    this.mySwiper.slidePrev();
  }

  onSlideNext() {
    this.mySwiper.slideNext();
  }
}
