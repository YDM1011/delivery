import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
    private api = environment.host;
    private DB = {};
    constructor( private http: HttpClient ) { }

    get(api, id = null) {
        return new Promise((resolve, reject) => {
          id = id ? '/' + id : id;
          this.http.get(`${this.api}${api}${id ? id : ''}`).subscribe(data => {
              resolve(data);
          }, error => {
              reject(error);
          });
        });
    }

    // getNoCache(api, id = null, any = null) {
    //     return new Promise((resolve, reject) => {
    //         this.http.get(`${this.api}${api}${id ? '/' + id : ''}${any ? any : ''}`).subscribe(data => {
    //             resolve(data);
    //         }, error => {
    //             reject(error);
    //         });
    //     });
    // }

    post(api, obj, id = null, isUpdate: any = false, isAlert = true) {
        return new Promise((resolve, reject) => {
          this.http.post(`${this.api}${api}${id ? '/' + id : ''}`, obj).subscribe(data => {
           resolve(data);
           if (isAlert) {
               Swal.fire('Success', '', 'success');
           }
           if (isUpdate) {
               isUpdate.map(property => {
                   this.update(property, obj, id);
               });

           }
          }, error => {
            reject(error);
          });
        });
    }

    logout(api, obj) {
        return new Promise((resolve, reject) => {
          this.http.post(`${this.api}${api}`, obj).subscribe(data => {
           resolve(data);
           this.DB = {};
          }, error => {
            reject(error);
          });
        });
    }

    delete(api, id = null, ogjAfterDel: any = null, isUpdate: any = false) {
        return new Promise((resolve, reject) => {
            Swal.fire({
                title: 'Do you confirm the deletion?',
                type: 'warning',
                showCloseButton: true,
                showCancelButton: true,
                focusConfirm: true,
                reverseButtons: true,
                cancelButtonText: 'Cancel!',
                confirmButtonText: 'Delete',
                confirmButtonColor: '#dd4535',
            }).then((result) => {
                if (result.value) {
                    this.http.delete(`${this.api}${api}/${id ? id : ''}`).subscribe(data => {
                        resolve(data || true);
                        if (isUpdate && ogjAfterDel) {
                            isUpdate.map(property => {
                                this.update(property, ogjAfterDel, 'delete');
                            });
                        }
                    }, error => {
                        reject(error);
                    });
                }
            });
        });
    }
    deleteOrder(api, id = null, ogjAfterDel: any = null, isUpdate: any = false) {
        return new Promise((resolve, reject) => {
            this.http.delete(`${this.api}${api}/${id ? id : ''}`).subscribe(data => {
                resolve(data || true);
                if (isUpdate && ogjAfterDel) {
                    isUpdate.map(property => {
                        this.update(property, ogjAfterDel, 'delete');
                    });
                }
            }, error => {
                reject(error);
            });
        });
    }
    update(property, data, type = null) {
        if (typeof this.DB[this.api + property] === 'object') {
            if (type === 'delete') {
                try {
                    if (this.DB[this.api + property].length > 0) {
                        const index = this.find('_id', data._id, this.DB[this.api + property]);
                        if (index) {
                            this.DB[this.api + property].splice(index, 1);
                        }
                        console.log(this.DB[this.api + property], index);
                    }
                } catch (e) {
                    alert('update error');
                }
            }
            if (!type) {
                try {
                    if (this.DB[this.api + property].length > 0) {
                        this.DB[this.api + property].push(data);
                    }
                } catch (e) {

                }
            } else {
                try {
                    if (this.DB[this.api + property].length > 0) {
                        const index = this.find('_id', data._id, this.DB[this.api + property]);
                        if (index) {
                            this.DB[this.api + property ][index] = data;
                        }
                        console.log(this.DB[this.api + property], index);
                    }
                    if (type === data._id) {
                        this.DB[this.api + property + '/' + type] = data;
                        console.log(this.DB[this.api + property]);
                    }
                } catch (e) {
                    alert('update error');
                }
            }
        }
        // this.DB[this.api+property] = data;

        // console.log(this.DB);
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
}
