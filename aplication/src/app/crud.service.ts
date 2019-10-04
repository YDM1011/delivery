import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../environments/environment';
import { City, Category, Brands } from './db';
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class CrudService {
    private api = environment.host;
    private domain = environment.domain;


    constructor( private http: HttpClient, private auth: AuthService) { }

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

    getCompany(city){
      return new Promise((resolve, reject) => {
        const query = `?query={"city":"${city._id}"}&select=_id`;
        this.get('company', '', query).then((v:any)=>{
          if (v) {
            let arr = [];
            v.map(it => arr.push({companyOwner: it._id}));
            this.auth.setCompanyCity(arr);
            resolve(arr)
          } else {
            reject()
          }
        });
        // resolve(Category);
      });
    }

    getCategory(company = null) {
        return new Promise((resolve, reject) => {
          const populate = '&populate='+JSON.stringify({path:'mainCategory'});
          const select = '&select=name,mainCategory';
          const query = `?query={"$or":${JSON.stringify(company)}}`;
          if (company.length > 0) {
            this.get('category', '', query+select+populate).then((v: any) => {
              if (v) {
                const defIcon = './assets/angular.png';
                let triger = {};
                let arr = [];
                v.forEach(it => {
                  if (it.mainCategory){
                    if (triger[it.mainCategory._id]) return;
                    it["img"] =  `${this.domain}/upload/${it.mainCategory.img}` || defIcon;
                    it["name"] = `${it.mainCategory.name}`;
                    arr.push(it)
                    triger[it.mainCategory._id] = true;
                  }

                });
                resolve(arr)
              } else {
                reject()
              }
            });
          } else {

            resolve([])
          }
        });
    }

    getCity() {
        return new Promise((resolve, reject) => {
          this.get('city', '', '').then((v:any)=>{
            if (v) {
              v.map(it=>{
                it["img"] = it.img ? `${this.domain}/upload/${it.img}` : null;
              });
              resolve(v)
            } else {
              reject()
            }
          });
        });
    }
    getBrands(company) {
      return new Promise((resolve, reject) => {
        // const populate = '&populate='+JSON.stringify({path:'mainCategory'});
        // const select = '&select=name,mainCategory';
        const query = `?query={"$or":${JSON.stringify(company)}}`;
        if (company.length > 0) {
          this.get('brands', '').then((v: any) => {
            if (v) {
              const defIcon = './assets/angular.png';
              v.map(it => {
                it["img"] = it.img ? `${this.domain}/upload/${it.img}` || defIcon : defIcon;
              });
              resolve(v)
            } else {
              reject()
            }
          });
        } else {

          resolve([])
        }
      });
    }
}
