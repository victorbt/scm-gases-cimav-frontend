import { Component, HostBinding } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Apollo } from 'apollo-angular';
import { createOrder } from '../../graphql/createOrder';
import {Observable} from 'rxjs/Observable';
import { allUsers } from '../../graphql/allUsers';
import { allUsersQuery } from '../../graphql/schema';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';

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
    <form [formGroup]="orderForm" (ngSubmit)="onSubmit()">

    <div class="form-group">
    <label >O.C.</label>
    <input class="form-control" formControlName="orderIdentifier"/>
    </div>

    <div class="form-group">
    <label for="typeahead-template">Users</label>
    <input id="typeahead-template" class="form-control" formControlName="userId" type="text" [(ngModel)]="model" [ngbTypeahead]="search" [resultFormatter]="formatter" [inputFormatter]="formatter" />
    </div>

    <div class="modal-footer" >
      <button type="submit" class="btn btn-success" (click)="onSubmit()">Crear</button>
    </div>

    </form>
    </div>


  `,
})
export class ModalComponent {
  modalHeader: string;
  orderForm: FormGroup;
  users = [];
  public model: any;
  userId;
  formatter = (result: { username: string, id: number }) => result.username;

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .map(term => term === '' ? [] : this.users.filter(user => user.username.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));

  constructor(private activeModal: NgbActiveModal, private apollo: Apollo) { }

  ngOnInit() {
    this.createForm();
    this.apollo.watchQuery<allUsersQuery>({ query: allUsers }).valueChanges.map(result => result.data.allUsers).subscribe(users => { this.users = users })
  }


  createForm() {
    this.orderForm = new FormGroup({
      orderIdentifier: new FormControl('', {
        validators: Validators.required,
        updateOn: 'submit',
      }),
      userId: new FormControl('', {
        validators: Validators.required,
        updateOn: 'submit',
      }),
    });
  }

  closeModal() {
    this.activeModal.close();
  }

  onSubmit() {
    if (this.orderForm.valid) {
      if (!this.model.id) {
        //not exiting user
      } else {
        this.apollo.mutate({
          mutation: createOrder, variables: {
            order_identifier: this.orderForm.get('orderIdentifier').value,
            user_id: this.model.id,
          }
        }).subscribe(({data}) => { console.log(data), this.activeModal.close() }, (error) => { console.log(error) }, );
      }
    }
  }
}
