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
  planId: string = '';

  ngOnInit() {
    this.subService.planoSelecionado.subscribe((plano: Subscription) => {
      this.planoSelecionado = plano;
      console.log(plano);
      this.planId = this.planoSelecionado.id;
      localStorage.setItem('subId', this.planoSelecionado.id);
    });

    this.transaction = this.tranService
      .getById(localStorage.getItem('transactionId'))
      .subscribe((response: any) => {
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
  public clientId: string | null = localStorage.getItem('clientId');

  insertPayment() {
    console.log(this.clientId);
    console.log(this.planId);
    if (this.planId !== null && this.clientId !== null) {
      this.newTransaction.client = this.clientId;
      this.newTransaction.subscription = this.planId;
      this.newTransaction.termInDays = this.planoSelecionado.termInDays;
    }

    this.tranService.post(this.newTransaction).subscribe(
      (response: any) => {
        localStorage.setItem('transactionId', response.id);
        this.router.navigate(['/']);
        return response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
