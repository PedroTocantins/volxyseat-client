import { Component } from '@angular/core';
import { Subscription } from 'src/app/models/SubscriptionModel/Subscription';
import { SubscriptionService } from 'src/app/services/Subscription.service';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css'],
})
export class SubscriptionComponent {
  constructor(
    private subService: SubscriptionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getSubscriptions();
  }

  public subscriptions!: Subscription[];

  token: string | null = localStorage.getItem('token');
  transaction: string | null = localStorage.getItem('transaction');
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: this.token ? `Bearer ${this.token}` : '',
  });

  getSubscriptions() {
    this.subService.getAll(this.headers).subscribe(
      (subscriptions: any) => {
        this.subscriptions = subscriptions;
      },
      (erro: any) => {
        console.log(erro);
      }
    );
  }

  signPlan(selectedSubscription: any) {
    const token = localStorage.getItem('token');

    if (token) {
      this.subService.setPlano(selectedSubscription);
      this.router.navigate(['/payment']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
