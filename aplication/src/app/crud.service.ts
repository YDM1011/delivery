import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../environments/environment';
import { City, Category, Brands } from './db';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
    private api = environment.host;
    constructor( private http: HttpClient ) { }

    get(api, id = null, any = null) {
        return new Promise((resolve, reject) => {
            this.http.get(`${this.api}${api}${id ? '/' + id : ''}${any ? any : ''}`).subscribe(data => {
                resolve(data);
            }, error => {
                reject(error);
            });
        });
    }

    post(api, obj, id = null) {
        return new Promise((resolve, reject) => {
          this.http.post(`${this.api}${api}${id ? '/' + id : ''}`, obj).subscribe(data => {
           resolve(data);
          }, error => {
            reject(error);
          });
        });
    }

    logout(api, obj) {
        return new Promise((resolve, reject) => {
          this.http.post(`${this.api}${api}`, obj).subscribe(data => {
           resolve(data);
          }, error => {
            reject(error);
          });
        });
    }

    delete(api, id = null) {
        return new Promise((resolve, reject) => {
            this.http.delete(`${this.api}${api}/${id ? id : ''}`).subscribe(data => {
                resolve(data || true);
            }, error => {
                reject(error);
            });
        });
    }

    find(property, id, data, type = 'index') {
        for (let i = 0; i < data.length; i++) {
            if (data[i][property] === id) {
                let dataItem = null;
                switch (type) {
                    case 'index': dataItem = i;
                        break;
                    case 'obj': dataItem = data[i];
                        break;
                    default: break;
                }
                return dataItem;
            }
        }
    }
    arrObjToArrId(data) {
        const arr = [];
        data.map(obj => {
            arr.push(obj._id);
        });
        return arr;
    }

    getCategory() {
        return new Promise((resolve, reject) => {
            resolve(Category);
        });
    }

    getCity() {
        return new Promise((resolve, reject) => {
            resolve(City);
        });
    }
    getBrands() {
        return new Promise((resolve, reject) => {
            resolve(Brands);
        });
    }
}
