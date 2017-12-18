import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

import { HomeComponent } from './pages/home.component'

import { NbThemeModule } from '@nebular/theme';
import { NbSidebarModule, NbLayoutModule, NbCardModule, NbTabsetModule } from '@nebular/theme';

import {DndModule} from 'ng2-dnd';
import { Ng2SmartTableModule } from 'ng2-smart-table';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },

];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule, RouterModule.forRoot(appRoutes),
    NbThemeModule.forRoot({ name: 'default' }),
    NbSidebarModule,
    NbLayoutModule,
    NbCardModule,
    NbTabsetModule,
    DndModule.forRoot(),
    Ng2SmartTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
