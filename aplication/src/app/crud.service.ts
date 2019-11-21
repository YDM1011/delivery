import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../environments/environment';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
    private api = environment.host;
    private domain = environment.domain;
    private company;
    private city;
    private CompanyArr = [];

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

  getAction(city) {
        const date = new Date(new Date(new Date().getMonth()+1+'.'+(new Date().getDate()) +'.'+new Date().getFullYear()).getTime());
        this.city = city;
        return new Promise((resolve, reject) => {
        let links = [];
        this.city.links.forEach(it => {
          links.push({cityLink: it});
        });
        const query = `?query={"$or":${JSON.stringify(links)},"actionGlobal":true,"dateEnd":{"$gte":"${date.toISOString()}"}}&skip=0&limit=7&sort={"date":-1}`;
        this.get('test', '', query).then((v: any) => {
          if (v) {
            resolve(v);
          }
        }).catch((error) => {
          reject(error)
        })
        })
  }
  saveToken (token) {
      this.post('saveToken', {token:token}).then(v=>{
      }).catch(e=>{console.log(e)})
  }

  getCompany(city) {
    this.city = city;
    return new Promise((resolve, reject) => {
      const populate = '&populate=' + JSON.stringify({path: 'brands'});
      const query = `?query={"city":"${this.city._id}","verify":true}${populate}&select=_id,brands`;
      this.get('company', '', query).then((v: any) => {
        if (v) {
          const arr = [];
          this.company = Object.assign([], v);
          v.map(it => arr.push({companyOwner: it._id}));
          this.CompanyArr = arr;
          this.auth.setCompanyCity(arr);
          resolve(arr);
        }
      });
    });
  }
  getDetailCompany(id, company = null) {
    return new Promise((resolve, reject) => {
      const skip = company ? company.categories.orders.length : 0;
      const populate = '?populate=' + JSON.stringify([{path: 'brands'}, {path: 'action'},
        {path: 'categories', populate: {path: 'mainCategory'}, select: '-orders'},
        {path: 'createdBy'}, {path: 'city'}]);
      this.get('company', id, populate).then((v: any) => {
        if (v) {
          resolve(v);
        }
      });
    });
  }
  getDetailProduct(id) {
    return new Promise((resolve, reject) => {
      const populate = '?populate=' + JSON.stringify([{path:'createdBy'}]);
      this.get('order', id, populate).then((v: any) => {
        if (v) {
          resolve(v);
        }
      });
    });
  }
  getCategoryName(name) {
    const params = `${name}`;
    return new Promise((resolve, reject) => {
        this.get('categoryByMainName', params, ).then((v: any) => {
          if (v) {
            resolve(v);
          } else {
            reject('Not found!');
          }
        });
    });
  }
  getBrandName(name, city) {
    const params = `${name}/${city}`;
    return new Promise((resolve, reject) => {
        this.get('brandByMainName', params, ).then((v: any) => {
          if (v) {
            resolve(v);
          } else {
            reject('Not found!');
          }
        });
    });
  }
  orderByCategory(categoryId, skip) {
    const params = `${categoryId}/${skip}`;
    return new Promise((resolve, reject) => {
        this.get('orderByCategory', params, ).then((v: any) => {
          if (v) {
            resolve(v);
          }
        });
    });
  }
  orderByBrand(categoryId, skip) {
    const params = `${categoryId}/${skip}`;
    return new Promise((resolve, reject) => {
        this.get('orderByBrand', params, ).then((v: any) => {
          if (v) {
            resolve(v);
          } else {
            reject();
          }
        });
    });
  }
  orderByCategoryCount(categoryId) {
    return new Promise((resolve, reject) => {
        this.get('orderByCategoryCount', categoryId, ).then((v: any) => {
          if (v) {
            resolve(v);
          } else {
            reject();
          }
        });
    });
  }
  orderByBrandCount(categoryId) {
    return new Promise((resolve, reject) => {
        this.get('orderByBrandCount', categoryId, ).then((v: any) => {
          if (v) {
            resolve(v);
          } else {
            reject();
          }
        });
    });
  }

  getCategory() {
      return new Promise((resolve, reject) => {
        const populate = '&populate=' + JSON.stringify({path: 'mainCategory'});
        const select = '&select=name,mainCategory';
        const query = `?query={"$or":${JSON.stringify(this.CompanyArr)}}`;
        if (this.CompanyArr && this.CompanyArr.length > 0) {
          this.get('category', '', query + select + populate).then((v: any) => {
            if (v) {
              const defIcon = './assets/angular.png';
              let triger = {};
              let arr = [];
              v.forEach(it => {
                if (it.mainCategory) {
                  if (triger[it.mainCategory._id]) return;
                  it["img"] =  `${this.domain}/upload/${it.mainCategory.img}` || defIcon;
                  it["name"] = `${it.mainCategory.name}`;
                  arr.push(it);
                  triger[it.mainCategory._id] = true;
                }
              });
              resolve(arr);
            }
          });
        } else {
          resolve([]);
        }
      });
  }

  getCity() {
    return new Promise((resolve, reject) => {
      this.get('city', '', '').then((v: any) => {
        if (v) {
          v.map(it => {
            it["img"] = it.img ? `${this.domain}/upload/${it.img}` : null;
          });
          this.city = v;
          resolve(v);
        } else {
          reject();
        }
      });
    });
  }
  getBrands() {
    return new Promise((resolve, reject) => {
      let arr = new Set([]);
      this.company.forEach((it) => {
        if (it.brands.length > 0) {
          it.brands.forEach((el) => {
            arr.add({_id: el._id});
          });
        }
      });
        const query = `?query={"$or":${JSON.stringify(Array.from(arr))}}`;
        if (Array.from(arr).length > 0) {
          this.get('brand', '', query).then((v: any) => {
            if (v) {
              const defIcon = './assets/angular.png';
              v.forEach(it => {
                it["img"] = it.img ? `${this.domain}/upload/${it.img}` || defIcon : defIcon;
              });
              resolve(v);
            }
          });
        } else {
          resolve([]);
        }
    });
  }
  getDetailBrand(id) {
    return new Promise((resolve, reject) => {
      this.get('brand', '', `?query={"name":"${id}"}&populate={"path":"orders"}`).then((v: any) => {
        if (v) {
          v = v[0];
          const defIcon = './assets/angular.png';
            v["img"] = v.img ? `${this.domain}/upload/${v.img}` || defIcon : defIcon;
          resolve(v);
        }
      });
    });
  }
  getTopCompany() {
    const page = 0;
    const limit = 7;
    return new Promise((resolve, reject) => {
      const query = `?query={"city":"${this.city._id}","verify":true}&sort={"rating":-1}&limit=${page}&skip=${limit * page}`;
      this.get('company', '', query).then((v: any) => {
        if (v) {
          resolve(v);
        }
      });
    });
  }
  getTopProduct(p, l) {
    const page = p;
    const limit = l;
    return new Promise((resolve, reject) => {
      let links = [];
      this.city.links.forEach(it => {
        links.push({cityLink: it});
      });
      const query = `?query={"$or":${JSON.stringify(links)},"isTop":true}
      &populate={"path":"companyOwner"}
      &sort={"countBought":-1}&limit=${page}&skip=${limit * page}`;
      this.get('order', '', query).then((v:any) => {
        if (v) {
          resolve(v);
        }
      });
    });
  }
  getCountTopProduct() {
    return new Promise((resolve, reject) => {
      let links = [];
      this.city.links.forEach(it => {
        links.push({cityLink: it});
      });
      const query = `?query={"$or":${JSON.stringify(links)},"isTop":true}
      &populate={"path":"companyOwner"}`;
      this.get('order/count', '', query).then((v:any) => {
        if (v) {
          resolve(v);
        }
      });
    });
  }
  signup(data) {
      return new Promise((rs, rj) => {
        this.post('signup', data).then(v => {
          // console.log(v)
          if (v) {
            rs(v);
          } else {
            rj();
          }
        });
      });
  }
  signin(data){
      return new Promise((rs, rj) => {
        this.post('signin', data).then(v => {
          if (v) {
            rs(v);
          }
        }).catch((error) => {
          rj(error);
        });
      });
  }
  favoriteCompany(data) {
      return new Promise((rs, rj) => {
        this.post('favoriteCompany', data).then(v => {
          // console.log(v)
          if (v) {
            rs(v);
          } else {
            rj();
          }
        });
      });
  }
  favoriteProduct(data) {
      return new Promise((rs, rj) => {
        this.post('favoriteProduct', data).then(v => {
          if (v) {
            rs(v);
          } else {
            rj();
          }
        });
      });
  }
  confirmAuth(data) {
      return new Promise((rs, rj) => {
        this.post('confirmAuth', data).then(v => {
          // console.log(v)
          if (v) {
            rs(v);
          } else {
            rj();
          }
        });
      });
  }
}
