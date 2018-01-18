import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Apollo } from 'apollo-angular';
import { updateGasStatus } from '../../../graphql/updateGasStatus';
import { getUserGases } from '../../../graphql/getUserGases';
import { getUserGasesQuery } from '../../../graphql/schema';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { allGases } from '../../../graphql/allGases';

@Component({
  selector: 'button-view',
  template: `
    <button type="button" class="btn btn-outline-primary btn-block " (click)="onClick()">{{ id }}</button>
  `,
})
export class EmitGasEntryOrderModelViewComponent implements ViewCell {
  id: string;

  @Input() value: number;
  @Input() rowData: any;

  @Output() requestGas: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
    this.id = this.value.toString();
  }

  onClick() {
    this.requestGas.emit(this.rowData);
  }
}


@Component({
  selector: 'ngx-modal',
  template: `
    <div class="modal-header">
      <span>{{ modalHeader }}</span>
      <button class="close" aria-label="Close" (click)="closeModal()">
      <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
    <div>{{gas| json}}</div>
    <ng2-smart-table [settings]="settings" [source]="data"></ng2-smart-table>
    </div>
    <div class="modal-footer" >
      <button type="button" class="btn btn-outline-info btn-block "  (click)="emitWhithIncrement()">Emitir Orden de Incrmento En Dotaciones</button>
    </div>
  `,
})
export class EmitGasEntryOrderModalComponent {

  modalHeader: string;
  data: LocalDataSource;
  gas: any;
  user: any;

  @Output() updatedRequestedGases: EventEmitter<any> = new EventEmitter();

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
    mode: 'external',
    hideHeader: true,
    hideSubHeader: true,
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
        filter: false,
        renderComponent: EmitGasEntryOrderModelViewComponent,
        onComponentInitFunction: (instance) => {
          instance.requestGas.subscribe(GasData => {
            this.requestGas(GasData);
          });
        }
      },
    }
  };

  constructor(private activeModal: NgbActiveModal, private apollo: Apollo) {
  }

  ngOnInit() {
    this.data = new LocalDataSource();
    this.apollo.watchQuery<getUserGasesQuery>({ query: getUserGases, variables: { userId: this.user.id } }).valueChanges.map(result => result.data.getUserGases)
      .subscribe((data) => {
        this.data.load(data.filter(gas => gas.status == 5));
      });
  }

  closeModal() {
    this.activeModal.close();
    this.updatedRequestedGases.emit()
  }

  emitWhithIncrement(gasData) {
    this.apollo.mutate({
      mutation: updateGasStatus,
      variables: {
        gas_id: this.gas.id,
        status: 2,
      },
      refetchQueries: [{
        query: allGases
      }],
    }).subscribe((updatedGas) => {
      console.log(updatedGas),
        this.updatedRequestedGases.emit()
    });
  }

  requestGas(gasData) {

  }

}
