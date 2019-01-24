import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-map-card-star-rating',
  templateUrl: './map-card-star-rating.component.html',
  styleUrls: ['./map-card-star-rating.component.css']
})
export class MapCardStarRatingComponent implements OnInit, OnChanges {

  @Input() starCount: any;
  @Input() starValue: any;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['starValue'].currentValue) {
      if (this.starValue != null && isNaN(this.starValue)) {
        if (this.starValue.length > 0) {
          if (this.starValue[0] === '*') {
            this.starValue = this.starValue.length;
          } else {
            this.starValue = parseFloat(this.starValue);
          }
        } else {
          this.starValue = 0;
        }
      }
    }
  }

  starArray(starCount: number): Array<number> {
    return Array(starCount);
  }

  getPercentage() {
    return ((this.starValue / this.starCount) * 100).toString();
  }
}
