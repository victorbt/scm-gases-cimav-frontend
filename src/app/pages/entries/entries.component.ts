import { Component, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './modals/createOrderModal.component';
import { OrderDetailModalComponent } from './modals/orderDetailModal.component';
import { allOrders } from '../../graphql/allOrders';
import { allGases } from '../../graphql/allGases';
import { allOrdersQuery, allGasesQuery } from '../../graphql/schema';
import { ToasterService, ToasterConfig, Toast } from 'angular2-toaster';
import { EmitGasEntryOrderModalComponent } from './modals/emitGasEntryOrderModal.component';

import 'style-loader!angular2-toaster/toaster.css';

@Component({
  selector: 'entries-page',
  styleUrls: ['./entries.component.scss'],
  templateUrl: './entries.component.html'
})
export class EntriesComponent {

  //local arrays variables
  pendingGases;
  filteredPendingGases;
  requestedGases;
  filteredRequestedGases;

  //gas name filter function to use in arrays filters
  includeGas = (includedGas) =>
    (gas: any) => gas.type.name.toLowerCase().indexOf(includedGas.toLowerCase()) > -1;

  //order identifier filter function to use in arrays filters
  includeOrder = (includedOrder) =>
    (gas: any) => gas.order.order_identifier.toLowerCase().indexOf(includedOrder.toLowerCase()) > -1;

  //custom 'and' created for arrays filters using spread Operator
  and = (...funcs) => (...innerArgs) => funcs.every(func => func(...innerArgs));

  //smart-table data source
  public data: LocalDataSource;

  //smart table data settings
  settings = {
    //set smart-table external mode for aneable component outup events
    mode: 'external',

    //hide smart-table header and sub header
    hideHeader: true,
    hideSubHeader: true,

    //set custom actions icons on table and request confirm on item delete
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },

    //set actions column position to right
    actions: {
      position: 'right',
    },

    //set table columns without filters to not conflict with external custom filter
    columns: {
      order_identifier: {
        title: 'O.C.',
        filter: false,
      },
      user: {
        title: 'Usuario',
        //function for extract embedded attribute value on object
        valuePrepareFunction: (user) => {
          return user.username;
        },
        filter: false,
      },
    },

    //set table items limit for each page
    pager: {
      perPage: 6,
    }
  };

  //toaster and toasterconfig for notifications
  private toasterService: ToasterService;
  public toasterconfig: ToasterConfig = new ToasterConfig({
    positionClass: 'toast-top-right'
  });

  constructor(public apollo: Apollo, private modalService: NgbModal, toasterService: ToasterService) {
    //Initialize toasterService and smart-table data source
    this.toasterService = toasterService;
    this.data = new LocalDataSource();
  }

  //On Component init
  ngOnInit() {
    //Query all orders and load it into the smart table data source
    this.apollo.watchQuery<allOrdersQuery>({ query: allOrders }).valueChanges.map(result => result.data.allOrders)
      .subscribe((data) => {
        data.forEach(order => { this.data.prepend(order) })
      });

    //Query all Gases and divide it between pending and already requested gases,
    // then load arrays as filtered items on UI panels
    this.apollo.watchQuery<allGasesQuery>({ query: allGases }).valueChanges.map(result => result.data.allGases)
      .subscribe((data) => {
        this.pendingGases = data.filter(gas => gas.status == 1);
        this.requestedGases = data.filter(gas => gas.status == 2)
        this.filteredPendingGases = Object.assign([], this.pendingGases);
        this.filteredRequestedGases = Object.assign([], this.requestedGases);
      });
  }

  //method for create a order
  createOrder() {
    //declare as const the modalService open function for then access to it's result and open order creation modal
    const activeModal = this.modalService.open(ModalComponent, { size: 'lg', container: 'nb-layout', windowClass: 'modal' });
    //set modal header atribute
    activeModal.componentInstance.modalHeader = 'Crear Orden De Compra';
    //if modals have a succes result open the order detail modal of the new order for gases creation,
    // prepend on orders array the new one and notify the user with a toast
    activeModal.result.then((resultData) => {
      if (!resultData) { } else {
        const modal = this.modalService.open(OrderDetailModalComponent, { size: 'lg', container: 'nb-layout', windowClass: 'modal' })
        modal.componentInstance.modalHeader = resultData.order_identifier + '/             ' + resultData.user.username;
        modal.componentInstance.orderId = resultData.id;
        this.data.prepend(resultData);
        this.popOrderCreationToast(resultData.order_identifier);
      }

    });
  }

  //method for smart-table edit event output
  editOrder(event: any) {
    //declare as const the modalService open function for then access to it's result and open order detail modal
    const modal = this.modalService.open(OrderDetailModalComponent, { size: 'lg', container: 'nb-layout', windowClass: 'modal' })
    modal.componentInstance.modalHeader = event.data.order_identifier + '/             ' + event.data.user.username;
    modal.componentInstance.orderId = event.data.id;
    modal.componentInstance.gasRequested.subscribe(requestedGas => {

      if (!requestedGas) { }
      else { this.popGasRequestedToast(requestedGas) }
    })
    modal.componentInstance.gasCreated.subscribe(createdGas => {
      console.log('ya')
      if (!createdGas) { }
      else { this.popGasCreationToast(createdGas) }
    })
  }

  //methos for custom search on smart-table
  onSearch(query: string = '') {
    if (query === '') {
      this.data.setFilter([], true);
    } else {
      //set smart-table data source filter
      this.data.setFilter([
        {
          field: 'order_identifier',
          search: query
        },
        {
          field: 'user',
          search: query,
          //custom filter function for user to compare with it`s username attribute
          filter: (user?: any, search?: string): boolean => {
            let match = user.username.toLowerCase().includes(search.toLowerCase());
            if (match || search === '') {
              return true;
            } else {
              return false;
            }
          }
        }
      ], false);
    }
  }

  //method for filter pending gases
  filterPendingGases(gasName, gasOrder) {
    const orderFilter = this.includeOrder(gasOrder);
    const nameFilter = this.includeGas(gasName);
    this.filteredPendingGases = Object.assign([], this.pendingGases).filter(this.and(nameFilter, orderFilter));
    //  this.filteredRequestedGases = Object.assign([], this.pendingGases).filter(this.and(nameFilter, orderFilter));
  }

  //method for request gas on drop
  dropDataSuccess($event: any) {
    //declare as const the modalService open function for then access to it's result and open gas entry order modal
    const activeModal = this.modalService.open(EmitGasEntryOrderModalComponent, { size: 'lg', container: 'nb-layout', windowClass: 'modal' });
    activeModal.componentInstance.gas = $event.dragData;
    activeModal.componentInstance.user = $event.dragData.user;
    activeModal.componentInstance.modalHeader = 'Cilindros Vacios Disponibles';
  }

  popOrderCreationToast(data) {
    const toast: Toast = {
      type: 'success',
      title: 'Orden Creada',
      body: data
    };
    this.toasterService.pop(toast);
  }


  popGasCreationToast(data) {
    const toast: Toast = {
      type: 'success',
      title: 'Gas creado',
      body: data
    };
    this.toasterService.pop(toast);
  }

  popGasRequestedToast(data) {
    const toast: Toast = {
      type: 'success',
      title: 'Gas solicitado',
      body: data
    };
    this.toasterService.pop(toast);
  }

}
