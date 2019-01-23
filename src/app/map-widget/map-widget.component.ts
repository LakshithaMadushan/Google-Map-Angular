import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Http} from '@angular/http';
import {HotelMarkerData} from './HotelMarkerData';
import {Point} from '../map/Point';
import {Marker} from '../map/Marker';

@Component({
  selector: 'app-map-widget',
  templateUrl: './map-widget.component.html',
  styleUrls: ['./map-widget.component.css']
})
export class MapWidgetComponent implements OnInit {

  @Output() enterMapCard: EventEmitter<any> = new EventEmitter();
  @Output() leaveMapCard: EventEmitter<any> = new EventEmitter();

  loadMap = false;
  hotelMarkerDataList: any = [];
  enteredMapCardID: number;

  constructor(private http: Http) {
    this.getHotelData();
  }

  ngOnInit() {
  }

  getHotelData() {
    this.http.get('mocks/mapData.json').subscribe(data => {
      const results = (JSON.parse(data['_body'])['results']);
      results.forEach((result) => {
        const hotels = result.product.items.filter((item) => {
          return (item.productCode === 'HTL');
        });

        const tempPointObj = new Point();
        const tempMarkerObj = new Marker();
        const tempHotelMarkerObj = new HotelMarkerData();

        tempPointObj.lat = hotels[0].latitude;
        tempPointObj.lng = hotels[0].longitude;

        tempMarkerObj.point = tempPointObj;
        tempMarkerObj.uid = hotels[0].accomId;

        tempHotelMarkerObj.marker = tempMarkerObj;

        this.hotelMarkerDataList.push(tempHotelMarkerObj);

        this.loadMap = true;
      });
    }, (error) => {
      this.loadMap = true;
      console.log(error);
    });
  }

  mouseEnterMapCard(data, i) {
    this.enteredMapCardID = ((data['marker'])['uid']);
  }

  mouseLeaveMapCard(data, i) {
    this.enteredMapCardID = undefined;
  }
}
