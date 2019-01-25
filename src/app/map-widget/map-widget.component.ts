import {Component, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import {HotelMarkerData} from './HotelMarkerData';
import {Point} from '../map/Point';
import {Marker} from '../map/Marker';
import {MapCardData} from '../map-card/MapCardData';

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

  constructor(private http: Http) {
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
        this.hotelMarkerDataList.push(tempHotelMarkerObj);
        this.mapCardDataList.push(tempMapCardDataObj);
        this.loadMap = true;
      });
    }, (error) => {
      this.loadMap = true;
      console.log(error);
    });
  }

  mouseEnterMapCard(data, i) {
    this.enteredMapCardID = ((data['uid']));
  }

  mouseLeaveMapCard(data, i) {
    this.enteredMapCardID = undefined;
  }

  scrollToCards(uid) {
    this.selectedMarkerID = uid;
    const element = document.getElementById(uid);
    element.scrollIntoView({
      behavior: 'smooth'
    });
  }
}
