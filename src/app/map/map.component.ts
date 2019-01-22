import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {Point} from './Point';

declare var google;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @Input('MarkersList') markersList: Array<Point>;

  map: any;
  scriptLoadingPromise: Promise<void>;

  constructor(private _elem: ElementRef) {
    this.markersList = [
      {lat: 25.774252, lng: -80.190262, uid: 1},
      {lat: 18.466465, lng: -66.118292, uid: 2},
      {lat: 32.321384, lng: -64.757370, uid: 3}
    ];
  }

  ngOnInit() {
    const container = this._elem.nativeElement.querySelector('#map');
    this.createMap(container);
  }

  load(): Promise<void> {

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.id = 'mapScript';
    const callbackName = `initMap`;
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCplGJs4HttZiPbULm-6GcfS6HJi0m7poM&callback=initMap';

    this.scriptLoadingPromise = new Promise<void>((resolve: Function, reject: Function) => {
      (<any>window)[callbackName] = () => {
        resolve();
      };
      script.onerror = (error: Event) => {
        reject(error);
      };
    });
    document.body.appendChild(script);

    return this.scriptLoadingPromise;

  }

  public createMap(el: HTMLElement): Promise<void> {
    return this.load().then(() => {
      this.map = new google.maps.Map(el, {
        zoom: 2,
        center: new google.maps.LatLng(2.8, -187.3),
        mapTypeId: 'terrain'
      });

      this.mapMarkers();

      return;
    });
  }

  public marker(lat, lng, uid): void {
    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lng),
      icon: 'assets/icons/marker-hotel.png',
      map: this.map,
      animation: google.maps.Animation.BOUNCE,
      unique_id: uid
    });

    google.maps.event.addListener(marker, 'click', (() => console.log(marker.get('unique_id'))));
  }

  public mapMarkers() {
    if (this.markersList.length > 0) {
      this.markersList.forEach((point) => {
        this.marker(point.lat, point.lng, point.uid);
      });
    }
  }
}
