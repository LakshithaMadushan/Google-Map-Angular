import {Injectable} from '@angular/core';

@Injectable()
export class ConfigService {

  get(domain: string, key: string) {
    if (window[domain]) {
      return window[domain][key];
    }
    return undefined;
  }

  set(domain: string, key: string, value: any) {
    if (window[domain]) {
      window[domain][key] = value;
    }
  }

}
