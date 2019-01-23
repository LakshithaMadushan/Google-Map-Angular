import {Injectable} from '@angular/core';
import {Http} from '@angular/http';


@Injectable()
export class GetMapStylesService {

  constructor(private http: Http) {
  }

  get getStyle(): any {
    return this.http.get('assets/map-styles/style.json');
  }
}
