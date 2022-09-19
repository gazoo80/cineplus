import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'poster'
})
export class PosterPipe implements PipeTransform {

  transform(poster: string | null): string {
    if (poster) { // Si la imagen existe, retornamosla misma
      return `https://image.tmdb.org/t/p/w500${poster}`;
    }
    else { // Retornamos la imagen por defecto
      return './assets/images/no-image.jpg';
    }
  }

}
