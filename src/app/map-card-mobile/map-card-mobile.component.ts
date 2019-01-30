import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-map-card-mobile',
  templateUrl: './map-card-mobile.component.html',
  styleUrls: ['./map-card-mobile.component.css']
})
export class MapCardMobileComponent implements OnInit {

  @Input('Hotel') hotel: any;
  @Input('Generic') generic: any;

  constructor() { }

  ngOnInit() {
  }

}
