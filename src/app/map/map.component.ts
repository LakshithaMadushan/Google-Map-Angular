import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MapTypeId} from './MapTypeId.enum';
import {Animation} from './Animation.enum';
import {GetMapStylesService} from './get-map-styles.service';
import {HotelMarkerData} from '../map-widget/HotelMarkerData';

declare var google;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnChanges {

  @Input('HotelMarkerDataList') hotelMarkerDataList: Array<HotelMarkerData>;
  @Input('ZoomLevel') mapZoomLevel;
  @Input('ClickEnable') clickEnable = true;
  @Input('EnablePlaceSearch') placeSearch = false;
  @Input('MapStyle') setMapStyle;

  markersList: any = [];
  map: any;
  infoWindow: any;
  searchBox: any;
  scriptLoadingPromise: Promise<void>;
  selectedMarker: any;
  searchPlaces: any;
  searchPlaceMarkers: any = [];
  mapStyles: any;

  constructor(private _elem: ElementRef, private getMapStylesService: GetMapStylesService) {
    // this.markersList = [
    //   {point: {lat: 25.774252, lng: -80.190262}, uid: 1, icon: 'assets/icons/marker-hotel.png', animation: Animation.DROP},
    //   {point: {lat: 18.466465, lng: -66.118292}, uid: 2, icon: 'assets/icons/marker-hotel.png', animation: Animation.DROP},
    //   {point: {lat: 32.321384, lng: -64.757370}, uid: 3, icon: 'assets/icons/marker-hotel.png', animation: Animation.DROP}
    // ];
  }

  ngOnInit() {
    const container = this._elem.nativeElement.querySelector('#map');

    if (this.setMapStyle) {
      this.getMapStylesService.getStyle.subscribe(data => {
          this.mapStyles = (JSON.parse(data['_body'])[this.setMapStyle.toString()]);
          this.createMap(container);
        }, (error) => {
          this.mapStyles = undefined;
          this.createMap(container);
          console.log(error);
        }
      );
    } else {
      this.createMap(container);
    }

    this.hotelMarkerDataList.forEach((data) => {
      this.markersList.push(
        {
          point: {lat: data.marker.point.lat, lng: data.marker.point.lng},
          uid: data.marker.uid,
          icon: 'assets/icons/marker-hotel.png',
          animation: Animation.DROP
        });
    });

    console.log(this.markersList);
  }

  ngOnChanges(changes: SimpleChanges): void {
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
        zoom: (this.mapZoomLevel) ? (this.mapZoomLevel) : 5,
        center: new google.maps.LatLng(24.466667, 54.366669),
        mapTypeId: MapTypeId.roadmap,
        gestureHandling: 'cooperative',
        mapTypeControl: false,
        styles: this.mapStyles,
        streetViewControl: true,
        fullscreenControl: true,
        fullscreenControlOptions: {
          position: google.maps.ControlPosition.BOTTOM_RIGHT
        }
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
