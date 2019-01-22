import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {Point} from './Point';
import {Marker} from './Marker';
import {MapTypeId} from './MapTypeId.enum';
import {Animation} from './Animation.enum';

declare var google;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @Input('MarkersList') markersList: Array<Marker>;
  @Input('ZoomLevel') mapZoomLevel = 5;

  map: any;
  scriptLoadingPromise: Promise<void>;
  selectedMarker: any;

  constructor(private _elem: ElementRef) {
    this.markersList = [
      {point: {lat: 25.774252, lng: -80.190262}, uid: 1, icon: 'assets/icons/marker-hotel.png', animation: Animation.DROP},
      {point: {lat: 18.466465, lng: -66.118292}, uid: 2, icon: 'assets/icons/marker-hotel.png', animation: Animation.DROP},
      {point: {lat: 32.321384, lng: -64.757370}, uid: 3, icon: 'assets/icons/marker-hotel.png', animation: Animation.DROP}
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
        zoom: this.mapZoomLevel,
        center: new google.maps.LatLng(25.774252, -80.190262),
        mapTypeId: MapTypeId.roadmap
      });

      this.mapMarkers();

      return;
    });
  }

  public marker(lat, lng, uid, icon, animation): any {
    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lng),
      icon: icon,
      map: this.map,
      animation: animation,
      unique_id: uid
    });

    google.maps.event.addListener(marker, 'click', (() => {
      if (this.selectedMarker) {
        console.log(this.selectedMarker);
        this.selectedMarker.setMap(null);
        this.marker(this.selectedMarker.internalPosition.lat(), this.selectedMarker.internalPosition.lng(), this.selectedMarker.unique_id, this.selectedMarker.icon, Animation.NONE);
      }
      this.clickOnMarker(marker);
    }));

    return marker;
  }

  public mapMarkers() {
    if (this.markersList.length > 0) {
      this.markersList.forEach((marker) => {
        this.marker(marker.point.lat, marker.point.lng, marker.uid, marker.icon, marker.animation);
      });
    }
  }

  public clickOnMarker(clickedMarker) {
    clickedMarker.setMap(null);
    if (this.markersList.length > 0) {
      this.markersList.forEach((marker) => {
        if (marker.uid === clickedMarker.get('unique_id')) {
          this.selectedMarker = this.marker(marker.point.lat, marker.point.lng, marker.uid, marker.icon, Animation.BOUNCE);
        }
      });
    }
  }
}
