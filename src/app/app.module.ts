import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { GraphQLModule } from './apollo.module';
import { HomeComponent } from './pages/home.component'
import { HttpClientModule } from '@angular/common/http';
import { NbThemeModule } from '@nebular/theme';
import { NbSidebarModule, NbLayoutModule, NbCardModule, NbTabsetModule } from '@nebular/theme';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './pages/modal/modal.component';

import {DndModule} from 'ng2-dnd';
import { Ng2SmartTableModule } from 'ng2-smart-table';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },

];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule, RouterModule.forRoot(appRoutes),
    NbThemeModule.forRoot({ name: 'default' }),
    NgbModule.forRoot(),
    NbSidebarModule,
    NbLayoutModule,
    NbCardModule,
    NbTabsetModule,
    DndModule.forRoot(),
    Ng2SmartTableModule,
    GraphQLModule,
    HttpClientModule,

  ],
  entryComponents: [

    ModalComponent

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
