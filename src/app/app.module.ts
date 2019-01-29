import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {MapWidgetComponentModule} from './map-widget/map-widget.component';
import {HttpModule} from '@angular/http';
import {GetMapStylesService} from './map/get-map-styles.service';
import {ConfigService} from './services/config.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    MapWidgetComponentModule
  ],
  providers: [GetMapStylesService, ConfigService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
