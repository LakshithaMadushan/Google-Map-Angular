import {Component, Input, OnInit} from '@angular/core';
import {ConfigService} from '../services/config.service';

@Component({
  selector: 'app-map-card',
  templateUrl: './map-card.component.html',
  styleUrls: ['./map-card.component.css']
})
export class MapCardComponent implements OnInit {

  @Input('Hotel') hotel: any;
  @Input('Generic') generic: any;

  defaultImage: string;

  constructor(private configService: ConfigService) {
    this.defaultImage = this.configService.get('buddy', 'ERROR_IMAGE');
  }

  ngOnInit() {
  }

}
