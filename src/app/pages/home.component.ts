import { Component, ViewEncapsulation } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { LocalDataSource } from 'ng2-smart-table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './modal/modal.component';
import { allOrders } from '../graphql/allOrders';
import { allOrdersQuery } from '../graphql/schema';
import { Observable } from 'rxjs'
import { DocumentNode } from 'graphql';
import jwtDecode from "jwt-decode";
import { Router } from '@angular/router';


import 'rxjs/add/operator/map';
@Component({
  selector: 'home-page',
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .modal .modal-content{
      margin-top: 28%;
    }
    nav{
      width:100%;
    }
    `
  ],
})
export class HomeComponent {

  simpleDrop: any = null;
  data: LocalDataSource;
  userData;


  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },

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
    mode: 'external',
    actions: { columnTitle: '' },
    hideHeader: true,
    pager: {
      perPage: 6,
    }
  };

  allGases: Observable<any>;

  constructor(public apollo: Apollo, private modalService: NgbModal, public router: Router) {
    this.data = new LocalDataSource();
  }

  ngOnInit() {

    if (localStorage.getItem('token')) {
      this.userData = jwtDecode(localStorage.getItem('token'));
    }

    this.apollo.watchQuery<allOrdersQuery>({ query: allOrders }).valueChanges.map(result => result.data.allOrders)
      .subscribe((data) =>
        this.data.load(data)
      );
  }

  createOrder() {
    const activeModal = this.modalService.open(ModalComponent, { size: 'lg', container: 'nb-layout', windowClass: 'modal' });
    activeModal.componentInstance.modalHeader = 'Large Modal';
  }

  createOrderConfirm() {
    console.log('order created');
  }

  logout() {
    localStorage.setItem('token', '');
    localStorage.setItem('refreshToken', '');
    this.router.navigate(['/login']);
    this.apollo.getClient().resetStore();
  }

}
