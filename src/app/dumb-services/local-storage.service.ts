import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

  constructor() { }

  setString(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  setNumber(key: string, value: number) {
    localStorage.setItem(key, value.toString());
  }

  setObject(key: string, object: Object) {
    if (object === Object(object)) {
      localStorage.setItem(key, JSON.stringify(object));
    } else {
      localStorage.setItem(key, object.toString());
    }
  }

  resolveString(key: string, defaultValue?: string) {
    const str = localStorage.getItem(key);

    if (str) {
      return str;
    } else if (defaultValue) {
      return defaultValue;
    } else {
      return '';
    }
  }

  resolveNumber(key: string, defaultValue?: number) {
    const str = localStorage.getItem(key);

    if (str) {
      return Number(str);
    } else if (defaultValue) {
      return defaultValue;
    } else {
      return 0;
    }
  }

  resolveObject(key: string, defaultValue?: Object) {
    const str = localStorage.getItem(key);

    if (str) {
      return JSON.parse(str);
    } else if (defaultValue) {
      return defaultValue;
    } else {
      return null;
    }
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }
}
