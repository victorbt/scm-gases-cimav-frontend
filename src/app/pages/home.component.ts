import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs'
import { DocumentNode } from 'graphql';
import { LocalDataSource } from 'ng2-smart-table';

import {allGases} from '../graphql/allGases';
import { allGasesQuery } from '../graphql/schema';

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
      name: {
        title: 'Full Name'
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

  constructor(public apollo: Apollo) {
    this.data = new LocalDataSource();
  }

  ngOnInit() {
    this.apollo.watchQuery<allGasesQuery>({ query: allGases }).valueChanges.map(result => result.data.allGases).subscribe((data) => {
      this.data.load(data);
    });
  }
}
