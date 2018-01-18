import { Component } from '@angular/core'
import { Apollo } from 'apollo-angular';
import { ToasterService, ToasterConfig, Toast } from 'angular2-toaster';
import { allGases } from '../../graphql/allGases';
import { allOrdersQuery, allGasesQuery } from '../../graphql/schema';

@Component({
  selector: 'receptions-page',
  templateUrl: './receptions.component.html',
})
export class ReceptionsComponent {
  requestedGases;
  filteredRequestedGases;

  private toasterService: ToasterService;
  public toasterconfig: ToasterConfig = new ToasterConfig({
    positionClass: 'toast-top-right'
  });

  constructor(public apollo: Apollo, toasterService: ToasterService) {
    this.toasterService = toasterService;
  }

  ngOnInit() {
    this.apollo.watchQuery<allGasesQuery>({ query: allGases }).valueChanges.map(result => result.data.allGases)
      .subscribe((data) => {
        this.requestedGases = data.filter(gas => gas.status == 2);
        this.filteredRequestedGases = Object.assign([], this.requestedGases);
      });
  }


  dropDataSuccess($event: any) {
    //  const activeModal = this.modalService.open(EmitGasEntryOrderModalComponent, { size: 'lg', container: 'nb-layout', windowClass: 'modal' });
    //  activeModal.componentInstance.gas = $event.dragData;
    //  activeModal.componentInstance.user = $event.dragData.user;
    //  activeModal.componentInstance.modalHeader = 'Cilindros Vacios Disponibles';
  }


}
