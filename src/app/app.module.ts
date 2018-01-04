import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AppComponent } from './app.component';
import { GraphQLModule } from './apollo.module';
import { HomeComponent } from './pages/home.component';
import { LoginComponent } from './pages/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { NbThemeModule } from '@nebular/theme';
import { NbSidebarModule, NbLayoutModule, NbCardModule, NbTabsetModule } from '@nebular/theme';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './pages/modal/modal.component';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service'
import {DndModule} from 'ng2-dnd';
import { Ng2SmartTableModule } from 'ng2-smart-table';

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
    LoginComponent
  ],
  imports: [
    BrowserModule, RouterModule.forRoot(appRoutes),
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

  ],
  entryComponents: [
    ModalComponent,
  ],
  providers: [
    AuthService,
    AuthGuardService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
