import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs'
import { DocumentNode } from 'graphql';
import { LocalDataSource } from 'ng2-smart-table';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalComponent } from './modal/modal.component';

import { allOrders } from '../graphql/allOrders';
import { allOrdersQuery } from '../graphql/schema';


import 'rxjs/add/operator/map';
@Component({
  selector: 'home-page',
  templateUrl: './home.component.html',
})
export class HomeComponent {

  simpleDrop: any = null;
  data: LocalDataSource;

  settings = {
    columns: {
      order_identifier: {
        title: 'O.C.'
      },
      user: {
        title: 'username',
        valuePrepareFunction: (user) => {
          return user.username;
        },
        filterFunction(user?: any, search?: string): boolean {
          let match = user.username.toLowerCase().includes(search.toLowerCase());
          if (match || search === '') {
            return true;
          } else {
            return false;
          }
        },
      },
    },
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    pager: {
      perPage: 6,
    }
  };

  allGases: Observable<any>;

  constructor(public apollo: Apollo, private modalService: NgbModal) {
    this.data = new LocalDataSource();
  }

  ngOnInit() {
    this.apollo.watchQuery<allOrdersQuery>({ query: allOrders }).valueChanges.map(result => result.data.allOrders)
      .subscribe((data) =>
        this.data.load(data)
      );
  }

  showLargeModal() {
    const activeModal = this.modalService.open(ModalComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Large Modal';
  }

}
