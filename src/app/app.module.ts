import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MapComponent} from './map/map.component';
import {FormsModule} from '@angular/forms';
import {MapWidgetComponent} from './map-widget/map-widget.component';
import {MapCardComponent} from './map-card/map-card.component';
import {HttpModule} from '@angular/http';
import {GetMapStylesService} from './map/get-map-styles.service';
import {MapCardStarRatingComponent} from './map-card-star-rating/map-card-star-rating.component';
import {DefaultImage} from './directives/default-image.directive';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    MapWidgetComponent,
    MapCardComponent,
    MapCardStarRatingComponent,
    DefaultImage
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule
  ],
  providers: [GetMapStylesService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
