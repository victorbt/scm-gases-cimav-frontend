import { Component, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, QueryRef } from 'apollo-angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jwtDecode from "jwt-decode";


@Component({
  selector: 'home-page',
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .modal .modal-content{
      margin-top: 20%;
    }
    nav{
      width:100%;
    }
    `
  ],
})
export class HomeComponent {
  userData;

  constructor(public apollo: Apollo, public router: Router) {
  }

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.userData = jwtDecode(localStorage.getItem('token'));
    }
  }

  logout() {
    localStorage.setItem('token', '');
    localStorage.setItem('refreshToken', '');
    this.router.navigate(['/login']);
    this.apollo.getClient().resetStore();
  }

}
