import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Apollo } from 'apollo-angular';
import { allGasesTypes } from '../../../graphql/allGasesTypes';
import { createGas } from '../../../graphql/createGas';
import { updateGasStatus } from '../../../graphql/updateGasStatus';
import { allGases } from '../../../graphql/allGases';
import { getOrderGases } from '../../../graphql/getOrderGases';
import { Observable } from 'rxjs/Observable';
import { allUsers } from '../../../graphql/allUsers';
import { allGasesTypesQuery, getOrderGasesQuery } from '../../../graphql/schema';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';


@Component({
  selector: 'button-view',
  template: `
 <ng-container [ngSwitch]="rowData.status">
    <button *ngSwitchCase="0" type="button" class="btn btn-tn btn-info btn-block" (click)="onClick()">Solicitar</button>
    <button *ngSwitchCase="1" type="button" class="btn btn-tn btn-warning btn-block" disabled>Pendiente</button>
    <button *ngSwitchCase="3" type="button" class="btn btn-tn btn-primary btn-block" disabled>Solicitado</button>
    <button *ngSwitchCase="4" type="button" class="btn btn-tn btn-success btn-block" disabled>Recibido</button>
 </ng-container>
  `,
})

export class OrderDetailButtonViewComponent implements ViewCell {
  id: string;
  @Input() value: number;
  @Input() rowData: any;

  @Output() requestGas: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
    this.id = this.value.toString();
    console.log(this.rowData)
  }

  onClick() {
    this.requestGas.emit(this.value);
  }
}


@Component({
  selector: 'ngx-modal',
  template: `
    <div class="modal-header" >
      <span>{{ modalHeader }}</span>
      <button class="close" aria-label="Close" (click)="closeModal()">
      <span aria-hidden="true">&times;</span>
      </button>
    </div>

    <div class="modal-body">

      <nb-card>
      <nb-card-header style="padding: 0.8rem 2.4rem;">
        <div style="justify-content: space-between;align-items: center;" class="row">
          <span>Gases</span>
          <button style="padding: .18rem 1.2rem;" type="button" class="btn btn-success btn-icon btn-md" (click)="isCollapsed = !isCollapsed"
          [attr.aria-expanded]="!isCollapsed" aria-controls="collapseExample"><i style="font-size: 32px" class="nb-plus"></i></button>
        </div>
      </nb-card-header>
      <nb-card-body>
        <ng2-smart-table [settings]="settings" [source]="data"></ng2-smart-table>
      </nb-card-body>
      </nb-card>

      <div id="collapseExample" [ngbCollapse]="isCollapsed">
      <form [formGroup]="gasForm" (ngSubmit)="onSubmit()">
      <div class="form-group">
      <label >Gas</label>
      <input id="typeahead-template" class="form-control" formControlName="gasType" type="text" [(ngModel)]="gasModel" [ngbTypeahead]="search" [resultFormatter]="gasTypeInputFormatter" [inputFormatter]="gasTypeInputFormatter"/>
      </div>
      <div class="modal-footer" >
        <button type="submit" class="btn btn-success" (click)="onSubmit()">Crear</button>
      </div>
      </form>
      </div>


    </div>
  `,
})

export class OrderDetailModalComponent {

  //local componet variables
  modalHeader: string;
  orderId: number;
  allGasesTypes = [];
  // GasForm declaration
  gasForm: FormGroup;


  public gasModel: any;

  public isCollapsed = true;

  @Output() gasRequested: EventEmitter<any> = new EventEmitter();
  @Output() gasCreated: EventEmitter<any> = new EventEmitter();

  gasTypeInputFormatter = (result: { name: string, id: number }) => result.name;

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .map(term => term === '' ? [] : this.allGasesTypes.filter(gas => gas.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));



  data: LocalDataSource;
  settings = {

    actions: {
      position: 'right',
      add: false
    },
    hideHeader: true,
    hideSubHeader: true,
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    mode: 'external',

    pager: {
      perPage: 4,
    },

    columns: {

      type: {
        title: 'Gas',
        valuePrepareFunction: (type) => {
          return type.name;
        },
        filterFunction: (type?: any, search?: string): boolean => {
          let match = type.name.toLowerCase().includes(search.toLowerCase());
          if (match || search === '') {
            return true;
          } else {
            return false;
          }
        },
      },
      id: {
        title: 'id',
        type: 'custom',
        editable: false,
        width: '18%',
        renderComponent: OrderDetailButtonViewComponent,
        onComponentInitFunction: (instance) => {
          instance.requestGas.subscribe(requestedGasData => {
            this.requestGas(requestedGasData);
          });
        }
      },
    }
  };

  constructor(private activeModal: NgbActiveModal, private apollo: Apollo) {

  }

  ngOnInit() {
    this.data = new LocalDataSource();
    this.createForm();

    this.apollo.watchQuery<getOrderGasesQuery>({ query: getOrderGases, variables: { orderId: this.orderId } }).valueChanges.map(result => result.data.getOrderGases)
      .subscribe(orderGases => { this.data.empty(), orderGases.forEach((gas) => { this.data.prepend(gas) }) });

    this.apollo.watchQuery<allGasesTypesQuery>({ query: allGasesTypes }).valueChanges.map(result => result.data.allGasesTypes)
      .subscribe(gasTypes => { this.allGasesTypes = gasTypes });

  }

  createForm() {
    this.gasForm = new FormGroup({
      gasType: new FormControl('', {
        validators: Validators.required,
        updateOn: 'submit',
      }),
    });
  }

  closeModal() {
    this.activeModal.close();
  }

  onSubmit() {
    if (this.gasForm.valid) {
      this.apollo.mutate({
        mutation: createGas, variables: {
          gas_type_id: this.gasModel.id,
          order_id: this.orderId,
          rack_id: 1,
          status: 0,
        },
        update: (store, gas: { data: { createGas } }) => {
          console.log(store)

          // Read the data from our cache for this query.
          const data: any = store.readQuery({ query: getOrderGases, variables: { orderId: this.orderId } });
          console.log(data)
          // Add our gas from the mutation to the end.
          data.getOrderGases.push(gas.data.createGas);
          // Write our data back to the cache.
          store.writeQuery({ query: getOrderGases, variables: { orderId: this.orderId }, data });
        },
      }).subscribe(({ data }) => {
        this.gasModel = '',
          this.gasCreated.emit(data);
        //  console.log(data.createGas.type.name)
      }
        , (error) => { console.log(error) }, );
    }
  }


  requestGas(gasId) {


    /*
    this.apollo.mutate({
      mutation: updateGasStatus,
      variables: {
        gas_id: gasId,
        status: 1,
      },
      refetchQueries: [{
        query: allGases
      }],
    }).subscribe((updatedGas) => {
      this.gasRequested.emit(updatedGas);
    });
    */
  }


}
