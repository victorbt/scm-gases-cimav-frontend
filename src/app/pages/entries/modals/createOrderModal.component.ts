import { Component, HostBinding } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Apollo } from 'apollo-angular';
import { createOrder } from '../../../graphql/createOrder';
import { Observable } from 'rxjs/Observable';
import { allUsers } from '../../../graphql/allUsers';
import { allUsersQuery } from '../../../graphql/schema';
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
    <input id="typeahead-template" class="form-control" formControlName="userId" type="text" [(ngModel)]="userModel" [ngbTypeahead]="search" [resultFormatter]="formatter" [inputFormatter]="formatter" />
    </div>

    <div class="modal-footer" >
      <button type="submit" class="btn btn-success" (click)="onSubmit()">Crear</button>
    </div>

    </form>
    </div>


  `,
})
export class ModalComponent {
  //modals local variables
  modalHeader: string;
  users = [];

  //form Declaration
  orderForm: FormGroup;

  //type head model for get item data before order user select
  public userModel: any;
  //type head input formater for extract username of user item
  formatter = (result: { username: string, id: number }) => result.username;
  //function for custom search on users type head input
  search = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .map(term => term === '' ? [] : this.users.filter(user => user.username.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));


  constructor(public activeModal: NgbActiveModal, private apollo: Apollo) { }

  //On component init
  ngOnInit() {
    //Initialize Form
    this.createForm();
    //Query all Users for strict order asigment to a existing user
    this.apollo.watchQuery<allUsersQuery>({ query: allUsers }).valueChanges.map(result => result.data.allUsers).subscribe(users => { this.users = users })
  }

  //Method for order creation
  createForm() {
    //Creating form using form control
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

  //function to close this modal
  closeModal() {
    this.activeModal.close();
  }

  //method for orderForm submit
  onSubmit() {
    //verify orderForm it's valid
    if (this.orderForm.valid) {
      if (!this.userModel.id) {
        //not exiting user
      } else {
        //mutation for create the order on database 
        this.apollo.mutate({
          mutation: createOrder, variables: {
            order_identifier: this.orderForm.get('orderIdentifier').value,
            user_id: this.userModel.id
          }
        }).map(result => result.data.createOrder).subscribe((response) => { this.activeModal.close(response) }, (error) => { console.log(error) }, );
      }
    }
  }
}
