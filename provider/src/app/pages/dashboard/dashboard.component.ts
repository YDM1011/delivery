import {Component, OnInit, ViewChild} from '@angular/core';
import {CrudService} from '../../crud.service';
import {AuthService} from '../../auth.service';
import {BaseChartDirective, Color, Label} from "ng2-charts";
import {ChartDataSets, ChartOptions} from "chart.js";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public user;
  public dateStart = new Date();
  public dateEnd = new Date();
  public loading: boolean = false;
  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Выполнены' },
    // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Отменены' },
    // { data: [0, 40, 30, 40, 30, 10, 4], label: 'Отменены', hidden: true}
  ];
  public lineChartLabels = [];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      xAxes: [{
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45
        },
        type: 'time',
        time: {
          unit: 'day',
          unitStepSize: 1,
          displayFormats: {
            'day': 'DD MM YY'
          }
        }
      }],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        // {
        //   id: 'y-axis-1',
        //   position: 'right',
        //   gridLines: {
        //     color: 'rgba(0,0,0,0.45)',
        //   },
        //   ticks: {
        //     fontColor: 'grey',
        //   }
        // }
      ]
    },
    annotation:{}
  };
  public lineChartColors: Color[] = [
    {
      backgroundColor: 'rgba(0,150,136,0.25)',
      borderColor: 'rgba(0,131,120,0.51)',
      pointBackgroundColor: 'rgba(0,131,120,0.51)',
      pointBorderColor: 'rgba(0,131,120,0.51)',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
  public allCounts = {
    first: null,
    second: null,
    third: null,
    forth: null,
    fifth: null
  };
  constructor(
      private crud: CrudService,
      private auth: AuthService
  ) { }

  ngOnInit() {
    this.dateStart.setDate(this.dateStart.getDate() -7);
    this.loading = true;
    this.auth.onMe.subscribe((v: any) => {
      if (!v) {return; }
      this.user = Object.assign({}, v);
    });

    this.crud.get(`providerInfo/byName/1`).then((v: any) => {
      if(!v[0]) {
        this.allCounts['first'] = 0;
        return;
      }
      this.allCounts['first'] = v[0].count;
    });
    this.crud.get(`providerInfo/byName/2`).then((v: any) => {
      if(!v[0]) {
        this.allCounts['second'] = 0;
        return;
      }
      this.allCounts['second'] = v[0].count;
    });
    this.crud.get(`providerInfo/byName/3`).then((v: any) => {
      if(!v[0]) {
        this.allCounts['third'] = 0;
        return;
      }
      this.allCounts['third'] = v[0].count;
    });
    this.crud.get(`providerInfo/byName/4`).then((v: any) => {
      if(!v[0]) {
        this.allCounts['forth'] = 0;
        return;
      }
      this.allCounts['forth'] = v[0].count;
    });
    this.crud.get(`providerInfo/byName/5`).then((v: any) => {
      if(!v[0]) {
        this.allCounts['fifth'] = 0;
        return;
      }
      this.allCounts['fifth'] = v[0].count;
    });
    this.chartFunc();
  }
  chartFunc(){
    this.lineChartLabels = [];
    this.lineChartData[0].data = [];
    // const timeStart = new Date(this.dateStart.getTime() - this.dateStart.getHours()*60*60*1000 - this.dateStart.getMinutes()*60*1000  - this.dateStart.getSeconds()*1000).getTime();
    // const timeEnd = new Date(this.dateEnd.getTime() - this.dateEnd.getHours()*60*60*1000 - this.dateEnd.getMinutes()*60*1000  - this.dateEnd.getSeconds()*999).getTime();

    const timeStart = new Date(this.dateStart.getMonth()+1+'.'+(this.dateStart.getDate()) +'.'+this.dateStart.getFullYear()).getTime();
    const timeEnd = new Date(this.dateEnd.getMonth()+1+'.'+(this.dateEnd.getDate()) +'.'+this.dateEnd.getFullYear()).getTime();

    this.crud.get(`ChartOrder?query={"$and":[{"date":{"$gte":"${timeStart}","$lte":"${timeEnd}"}}]}`).then((chart: any) => {
      // @ts-ignore
      let days = parseInt((timeEnd-timeStart - 1000*60*60*24)/1000/60/60/24);
      let month = 1;
      let triger = 0;
      let year = 0;
      let i = 0;
      let day = new Date(this.dateStart.getMonth()+month+'.'+(this.dateStart.getDate()+triger)+'.'+(this.dateStart.getFullYear()+year));
      while (day.getTime() !== timeEnd && i <= 365*2) {
        day = new Date(this.dateStart.getMonth()+month+'.'+(this.dateStart.getDate()+triger)+'.'+(this.dateStart.getFullYear()+year));
        // const day = new Date(timeStart + i*(1000*60*60*24));
        // console.log(this.dateStart.getMonth()+month+'.'+(this.dateStart.getDate()+triger)+'.'+(this.dateStart.getFullYear()+year), i, triger, month);
        if (isNaN(day.getTime())) {
          if (this.dateStart.getMonth()+month >= 12) {
            year += 1;
            month = -this.dateStart.getMonth() + 1;
            triger = -this.dateStart.getDate() + 1;
          } else {
            month += 1;
            triger = -this.dateStart.getDate() + 1;
          }
          day = new Date(this.dateStart.getMonth()+month+'.'+(this.dateStart.getDate()+triger)+'.'+(this.dateStart.getFullYear()+year));
        }

        this.lineChartLabels.push(day);
        chart.forEach((item, index) => {
          if (this.lineChartData[0].data[i]){
            return;
          }
          // console.log(new Date(item.date).getTime(), day.getTime());
          if (new Date(item.date).getTime() === day.getTime()){
            this.lineChartData[0].data[i] = chart[index].count;
            return;
          }
          this.lineChartData[0].data[i] = 0;
        });
        triger++;
        i++
      }
    })
  }
  changeDate(){
    this.chartFunc();
  }
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
  }
}
