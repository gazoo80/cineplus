import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { SlideshowComponent } from './slideshow/slideshow.component';
import { PeliculasPosterGridComponent } from './peliculas-poster-grid/peliculas-poster-grid.component';
import { StarRatingModule } from "angular-star-rating";
import { PipesModule } from '../pipes/pipes.module';
import { CastSlideshowComponent } from './cast-slideshow/cast-slideshow.component';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  declarations: [
    NavbarComponent,
    SlideshowComponent,
    PeliculasPosterGridComponent,
    CastSlideshowComponent,
    LoadingComponent
  ],
  imports: [
    CommonModule,
    RouterModule, // Para que funcione el routerLink del navbar
    StarRatingModule.forRoot(),
    PipesModule
  ],
  exports: [
    NavbarComponent,
    SlideshowComponent,
    PeliculasPosterGridComponent,
    CastSlideshowComponent,
    LoadingComponent
  ]
})
export class ComponentsModule { }
