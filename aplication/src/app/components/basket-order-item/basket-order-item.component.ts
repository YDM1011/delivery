import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-basket-order-item',
  templateUrl: './basket-order-item.component.html',
  styleUrls: ['./basket-order-item.component.scss']
})
export class BasketOrderItemComponent implements OnInit {
  @Input() data;
  public chooseAll: boolean = true;
  public showConfirm: boolean = false;
  public removeItemShow: boolean = false;
  public items = [{isChoise: true, _id:123},{isChoise: true, _id:1233}];
  constructor() { }

  ngOnInit() {
    this.mainChack()
  }
  closeConfirm(e) {
    this.showConfirm = e.value;
  }
  removeItem(e) {
    this.removeItemShow = e;
  }
  mainChack(){
    this.chooseAll = !this.chooseAll;
    if (this.chooseAll) {
      this.items.forEach((item,index)=> {
        this.items[index]['isChoise'] = true;
      })
    } else {
      this.items.forEach((item,index)=> {
        this.items[index]['isChoise'] = false;
      })
    }
  }
  otherChack(it){
    console.log(this.items);
    this.items[it].isChoise = !this.items[it].isChoise;
    let count = 0;
    let isAll = true;
    // this.items.forEach((item, index)=> {
    //   if (it == index) {
    //     item.isChoise = !item.isChoise
    //   }
    // });
    this.items.forEach((item, index)=> {
      if(!this.items[index].isChoise) {
        isAll = false;
      }
    });
    this.chooseAll = isAll;
  }
  checkAll(){

  }
}
