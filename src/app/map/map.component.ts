import {Component, ElementRef, Input, OnInit} from '@angular/core';
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
  @Input('ClickEnable') clickEnable = true;
  @Input('EnablePlaceSearch') placeSearch = false;

  map: any;
  infoWindow: any;
  searchBox: any;
  scriptLoadingPromise: Promise<void>;
  selectedMarker: any;
  searchPlaces: any;
  searchPlaceMarkers: any = [];

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
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBcvPWrmeyWma-ADpfiLnU9jf8T5j9VhRo&libraries=places&callback=initMap';

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
        mapTypeId: MapTypeId.roadmap,
        gestureHandling: 'cooperative',
        mapTypeControl: false,
        styles: [
          {
            elementType: 'geometry',
            stylers: [
              {
                color: '#f5f5f5'
              }
            ]
          },
          {
            elementType: 'labels.icon',
            stylers: [
              {
                visibility: 'off'
              }
            ]
          },
          {
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#616161'
              }
            ]
          },
          {
            elementType: 'labels.text.stroke',
            stylers: [
              {
                color: '#f5f5f5'
              }
            ]
          },
          {
            featureType: 'administrative.land_parcel',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#858ea1'
              }
            ]
          },
          {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [
              {
                color: '#eff0f2'
              }
            ]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#757575'
              }
            ]
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [
              {
                color: '#e1f4c1'
              }
            ]
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#858ea1'
              }
            ]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [
              {
                color: '#f8f9fa'
              }
            ]
          },
          {
            featureType: 'road.arterial',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#858ea1'
              }
            ]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [
              {
                color: '#dbdee4'
              }
            ]
          },
          {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#858ea1'
              }
            ]
          },
          {
            featureType: 'road.local',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#858ea1'
              }
            ]
          },
          {
            featureType: 'transit.line',
            elementType: 'geometry',
            stylers: [
              {
                color: '#eff0f2'
              }
            ]
          },
          {
            featureType: 'transit.station',
            elementType: 'geometry',
            stylers: [
              {
                color: '#eff0f2'
              }
            ]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [
              {
                color: '#dbdee4'
              }
            ]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#9e9e9e'
              }
            ]
          }
        ]
      });

      this.mapMarkers();
      this.infoWindow = new google.maps.InfoWindow();

      if (this.placeSearch) {
        const input = document.getElementById('pac-input');
        this.searchBox = new google.maps.places.SearchBox(input);
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        this.map.addListener('bounds_changed', () => {
          this.searchBox.setBounds(this.map.getBounds());
        });

        this.searchBox.addListener('places_changed', () => {
          if (this.searchBox.getPlaces().length > 0) {
            this.searchPlaces = this.searchBox.getPlaces();
          } else {
            this.searchPlaces = undefined;
          }

          this.searchPlaceMarkers.forEach((marker) => {
            marker.setMap(null);
          });
          this.searchPlaceMarkers = [];

          const bounds = new google.maps.LatLngBounds();
          this.searchPlaces.forEach((place) => {
            if (!place.geometry) {
              console.log('Returned place contains no geometry');
              return;
            }

            this.searchPlaceMarkers.push(new google.maps.Marker({
              map: this.map,
              icon: 'https://surffleximg.codegen.net/~fdmqa/surf-root/images/map-itinerary-hotel.png',
              title: place.name,
              position: place.geometry.location
            }));

            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          this.map.fitBounds(bounds);
        });

      }

      google.maps.event.addListener(this.map, 'click', (() => {
        this.resetBouncingMarker(this.selectedMarker);
        this.selectedMarker = undefined;
      }));

      google.maps.event.addListener(this.infoWindow, 'closeclick', (() => {
        this.resetBouncingMarker(this.selectedMarker);
        this.selectedMarker = undefined;
      }));

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
      if (this.selectedMarker && (marker.unique_id !== this.selectedMarker.unique_id)) {
        this.resetBouncingMarker(this.selectedMarker);
        this.selectedMarker = undefined;
      }
      this.clickOnMarker(marker);
    }));

    return marker;
  }

  resetBouncingMarker(selectedMarker) {
    if (selectedMarker) {
      selectedMarker.setMap(null);
      this.marker(selectedMarker.internalPosition.lat(), selectedMarker.internalPosition.lng(), selectedMarker.unique_id, selectedMarker.icon, Animation.NONE);
    }
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
          this.infoWindow.setContent(
            '<div class=\'info-card\'>' +
            '<div class=\'info-card-top\'>' +
            '<div class=\'info-card-meta\'>' +
            '<div class=\'info-card-heading\'>' +
            'lakshitha' + marker.uid +
            '</div>' +
            '<div class=\'info-card-subheading\'>' +
            'lakshitha' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class=\'info-card-bottom\'>' +
            '<p>' + 'lakshitha' + '</p>' +
            '</div>' +
            '</div>'
          );
          this.infoWindow.open(this.map, this.selectedMarker);
        }
      });
    }
  }
}
