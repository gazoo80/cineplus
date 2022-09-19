import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Cast } from '../../interfaces/credits-response';
import Swiper from 'swiper';

@Component({
  selector: 'app-cast-slideshow',
  templateUrl: './cast-slideshow.component.html',
  styleUrls: ['./cast-slideshow.component.css']
})
export class CastSlideshowComponent implements OnInit, AfterViewInit {

  @Input() cast: Cast[] = [];

  constructor() { }
  
  ngOnInit(): void {
    console.log(this.cast);
  }

  // Mótodo donde es conveniente implementar el slideshow
  ngAfterViewInit(): void {
    // '.swiper' hace referencia a la clase del control en el HTML
    const swiper = new Swiper('.swiper', {
      slidesPerView: 5.3, // Slides que se mostrarán
      freeMode: true, // Que sea fluido
      spaceBetween: 15,  
      loop: true
    });
  }

}
