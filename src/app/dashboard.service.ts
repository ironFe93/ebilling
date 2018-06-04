import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SocketioService } from './socketio.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Dashboard } from './models/dashboard';
import { tap } from 'rxjs/operators';

@Injectable()
export class DashboardService {

  private productsDash$ = new BehaviorSubject(new Array<Dashboard>());
  private reqsDash$ = new BehaviorSubject(new Array<Dashboard>());
  private pOrdersDash$ = new BehaviorSubject(new Array<Dashboard>());
  private dashboardUrl = '/api/dashboard';

  constructor(private http: HttpClient, private socketService: SocketioService) {
    this.getDashboard();
    this.subscribeToDashMsgs();
  }

  public getDashboard() {
    this.http.get<Dashboard[]>(this.dashboardUrl + '/getAll',
    ).subscribe(dashboard => {
      if (dashboard) {
        this.populateSubjects(dashboard);
      }
    });
  }

  public populateSubjects(dashboard: Dashboard[]) {
    dashboard.forEach(reg => {
      this.appendToDashArray(reg);
    });
  }

  public getProductDashAs$() {
    return this.productsDash$.asObservable();
  }

  public getReqDashAs$() {
    return this.reqsDash$.asObservable();
  }

  public getOrderDashAs$() {
    return this.pOrdersDash$.asObservable();
  }

  public subscribeToDashMsgs() {
    console.log('subscribed!');
    this.socketService.getDashMsgs$().subscribe(
      (x: Dashboard) => {
        this.appendToDashArray(x);
      }
    );
  }

  public appendToDashArray(reg: Dashboard) {
    switch (reg.model) {
      case 'products':
        this.pushIntoSubject(this.productsDash$, reg);
        break;
      case 'requisitions':
        this.pushIntoSubject(this.reqsDash$, reg);
        break;
      case 'pOrders':
        this.pushIntoSubject(this.pOrdersDash$, reg);
        break;
    }
  }

  pushIntoSubject = (subject: BehaviorSubject<Dashboard[]>, reg: Dashboard) => {
    const arr = subject.getValue();
    arr.push(reg);
    subject.next(arr);
  }
}
