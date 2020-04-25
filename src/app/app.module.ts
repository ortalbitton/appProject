import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatRadioModule,
  MatTreeModule,
  MatIconModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatListModule
} from "@angular/material";
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { AppComponent } from "./app.component";
import { AdCreateComponent } from "./advertisements/ad-create/ad-create.component";
import { AdListComponent } from "./advertisements/ad-list/ad-list.component";
import { HeaderComponent } from "./header/header.component";
import { AppRoutingModule } from "./app-routing.module";
import { UserListComponent } from './users/user-list/user-list.component';
import { UserCreateComponent } from './users/user-create/user-create.component';
import { LoginComponent } from './users/login/login.component';
@NgModule({
  declarations: [
    AppComponent,
    AdCreateComponent,
    AdListComponent,
    HeaderComponent,
    UserListComponent,
    UserCreateComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatRadioModule,
    MatTreeModule,
    MatCheckboxModule,
    MatIconModule,
    MatDatepickerModule,
    HttpClientModule,
    NgxMaterialTimepickerModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
