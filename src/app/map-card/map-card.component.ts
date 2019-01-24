import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-map-card',
  templateUrl: './map-card.component.html',
  styleUrls: ['./map-card.component.css']
})
export class MapCardComponent implements OnInit {

  @Input('Hotel') hotel: any;
  @Input('Generic') generic: any;

  mainImage = '';
  defaultImage = 'assets/error/image-not-available.jpg';

  constructor() {
  }

  ngOnInit() {
  }

}
