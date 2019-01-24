import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-map-card',
  templateUrl: './map-card.component.html',
  styleUrls: ['./map-card.component.css']
})
export class MapCardComponent implements OnInit {

  mainImage = '';
  defaultImage = 'assets/error/image-not-available.jpg';

  constructor() {
  }

  ngOnInit() {
  }

}
