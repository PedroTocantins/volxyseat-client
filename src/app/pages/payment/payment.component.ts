import { Subscription } from './../../models/SubscriptionModel/Subscription';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Transaction } from 'src/app/models/SubscriptionModel/Transaction';
import { SubscriptionService } from 'src/app/services/Subscription.service';
import { TransactionsService } from 'src/app/services/transactions.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent {
  planoSelecionado: Subscription;
  username: string | null = null;
  transaction: any;

  ngOnInit() {
    this.subService.planoSelecionado.subscribe((plano: Subscription) => {
      this.planoSelecionado = plano;
      localStorage.setItem('subscriptionId', this.planoSelecionado.id);
    });

    this.transaction = this.tranService
      .getById(localStorage.getItem('transactionId'))
      .subscribe((response: any) => {
        // localStorage.setItem('clientId', response.client);
        return response;
      });
  }

  constructor(
    private subService: SubscriptionService,
    private tranService: TransactionsService,
    private router: Router
  ) {
    this.planoSelecionado = this.subService.getPlano();
  }

  checkUserLogin() {
    this.username = localStorage.getItem('username');
  }

  public newTransaction: Transaction = new Transaction();
  public subId: string | null = localStorage.getItem('subscriptionId');
  public clientId: string | null = localStorage.getItem('clientId');

  insertPayment() {
    console.log(this.clientId);
    console.log(this.subId);
    if (this.subId != null && this.clientId != null) {
      this.newTransaction.client = this.clientId;
      this.newTransaction.subscription = this.subId;
      this.newTransaction.termInDays = this.planoSelecionado.termInDays;
    }

    this.tranService.post(this.newTransaction).subscribe(
      (response: any) => {
        localStorage.setItem('transactionId', response.id);
        this.router.navigate(['/payment']);
        return response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
