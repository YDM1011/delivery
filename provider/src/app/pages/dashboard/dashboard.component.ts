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
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Выполнены' },
    // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Отменены' },
    { data: [0, 40, 30, 40, 30, 10, 4], label: 'Отменены', hidden: true}
  ];
  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      xAxes: [{}],
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
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    // { // dark grey
    //   backgroundColor: 'rgba(77,83,96,0.2)',
    //   borderColor: 'rgba(77,83,96,1)',
    //   pointBackgroundColor: 'rgba(77,83,96,1)',
    //   pointBorderColor: '#fff',
    //   pointHoverBackgroundColor: '#fff',
    //   pointHoverBorderColor: 'rgba(77,83,96,1)'
    // },
    {
      backgroundColor: 'rgba(255,255,255,0.5)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
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
      this.allCounts['first'] = v[0].count;
    });
    this.crud.get(`providerInfo/byName/2`).then((v: any) => {
      this.allCounts['second'] = v[0].count;
    });
    this.crud.get(`providerInfo/byName/3`).then((v: any) => {
      this.allCounts['third'] = v[0].count;
    });
    this.crud.get(`providerInfo/byName/4`).then((v: any) => {
      this.allCounts['forth'] = v[0].count;
    });
    this.crud.get(`providerInfo/byName/5`).then((v: any) => {
      this.allCounts['fifth'] = v[0].count;
    })
  }
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
  }
}
