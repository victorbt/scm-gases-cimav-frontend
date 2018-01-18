import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { GraphQLModule } from './apollo.module';
import { HomeComponent } from './pages/home.component';
import { LoginComponent } from './pages/login/login.component';
import { EntriesComponent } from './pages/entries/entries.component';
import { OrderDetailModalComponent, OrderDetailButtonViewComponent } from './pages/entries/modals/orderDetailModal.component';
import { EmitGasEntryOrderModalComponent, EmitGasEntryOrderModelViewComponent } from './pages/entries/modals/emitGasEntryOrderModal.component';
import { ReceptionsComponent } from './pages/receptions/receptions.component'
import { NbThemeModule } from '@nebular/theme';
import { NbSidebarModule, NbLayoutModule, NbCardModule, NbTabsetModule } from '@nebular/theme';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './pages/entries/modals/createOrderModal.component';

import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service'
import { DndModule } from 'ng2-dnd';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ToasterModule } from 'angular2-toaster';

const appRoutes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' },

];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ModalComponent,
    LoginComponent,
    EntriesComponent,
    OrderDetailModalComponent,
    OrderDetailButtonViewComponent,
    EmitGasEntryOrderModalComponent,
    EmitGasEntryOrderModelViewComponent,
    ReceptionsComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    GraphQLModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NgbModule.forRoot(),
    NbSidebarModule,
    NbLayoutModule,
    NbCardModule,
    NbTabsetModule,
    DndModule.forRoot(),
    Ng2SmartTableModule,
    BrowserAnimationsModule,
    ToasterModule
  ],
  entryComponents: [
    ModalComponent,
    OrderDetailModalComponent,
    OrderDetailButtonViewComponent,
    EmitGasEntryOrderModalComponent,
    EmitGasEntryOrderModelViewComponent,
  ],
  providers: [
    AuthService,
    AuthGuardService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
