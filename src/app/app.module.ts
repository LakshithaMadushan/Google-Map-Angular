import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { FormsModule } from '@angular/forms';
import { MapWidgetComponent } from './map-widget/map-widget.component';
import { MapCardComponent } from './map-card/map-card.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    MapWidgetComponent,
    MapCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
