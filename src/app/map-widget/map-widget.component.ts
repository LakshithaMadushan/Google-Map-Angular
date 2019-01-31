import {Component, NgModule, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import {HotelMarkerData} from './HotelMarkerData';
import {Point} from '../map/Point';
import {Marker} from '../map/marker';
import {MapCardData} from '../map-card/MapCardData';
import {MapComponent} from '../map/map.component';
import {DefaultImage} from '../directives/default-image.directive';
import {MapCardStarRatingComponent} from '../map-card-star-rating/map-card-star-rating.component';
import {MapCardComponent} from '../map-card/map-card.component';
import {BrowserModule} from '@angular/platform-browser';
import {MapCardMobileComponent} from '../map-card-mobile/map-card-mobile.component';
import {MapMobileComponent} from '../map/mapMobile.component';

@Component({
  selector: 'app-map-widget',
  templateUrl: './map-widget.component.html',
  styleUrls: ['./map-widget.component.css']
})
export class MapWidgetComponent implements OnInit {

  loadMap = false;
  hotelMarkerDataList: any = [];
  mapCardDataList: any = [];
  enteredMapCardID: number;
  selectedMarkerID: number;
  screenWidth: any;

  constructor(private http: Http) {
    this.screenWidth = (screen.width);
    this.getData();
  }

  ngOnInit() {
  }

  getData() {
    this.http.get('mocks/mapData.json').subscribe(data => {
      const results = (JSON.parse(data['_body'])['results']);
      results.forEach((result) => {
        const hotel = result.product.items.filter((item) => {
          return (item.productCode === 'HTL');
        });

        const generic = result.product.items.filter((item) => {
          return (item.productCode === 'GEN');
        });

        const tempPointObj = new Point();
        const tempMarkerObj = new Marker();
        const tempHotelMarkerObj = new HotelMarkerData();
        const tempMapCardDataObj = new MapCardData();

        tempPointObj.lat = hotel[0].latitude;
        tempPointObj.lng = hotel[0].longitude;

        tempMarkerObj.point = tempPointObj;
        tempMarkerObj.uid = hotel[0].accomId;

        tempMapCardDataObj.uid = hotel[0].accomId;
        tempMapCardDataObj.hotel = hotel[0];
        tempMapCardDataObj.generic = generic[0];

        tempHotelMarkerObj.marker = tempMarkerObj;

        let duplicate = false;

        this.hotelMarkerDataList.forEach((markerData) => {
          if (markerData.marker.uid === tempHotelMarkerObj.marker.uid) {
            duplicate = true;
          }
        });

        if (!duplicate) {
          this.hotelMarkerDataList.push(tempHotelMarkerObj);
        }

        this.mapCardDataList.push(tempMapCardDataObj);

        this.loadMap = true;
      });
      this.hotelMarkerDataList.sort((a, b) => {
        return parseFloat(a.marker.uid) - parseFloat(b.marker.uid);
      });
    }, (error) => {
      this.loadMap = true;
      console.log(error);
    });
  }

  mouseEnterMapCard(data, i) {
    this.enteredMapCardID = ((data['uid']));
  }

  mouseLeaveMapCard() {
    this.enteredMapCardID = undefined;
  }

  scrollToCards(uid) {
    this.selectedMarkerID = uid;
    if (this.screenWidth < 768) {
      const element = document.getElementById(uid + 'm');
      element.scrollIntoView({
        behavior: 'smooth'
      });
    } else {
      const element = document.getElementById(uid);
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }

  resetSelectedMapCard() {
    this.selectedMarkerID = undefined;
  }
}

@NgModule({
  exports: [MapWidgetComponent],
  declarations: [MapWidgetComponent, MapComponent, MapMobileComponent, MapCardComponent, MapCardStarRatingComponent, MapCardMobileComponent, DefaultImage],
  imports: [BrowserModule],
  providers: []
})

export class MapWidgetComponentModule {
}
