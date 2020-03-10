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
  MatCheckboxModule
} from "@angular/material";
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { AppComponent } from "./app.component";
import { AdCreateComponent } from "./advertisements/ad-create/ad-create.component";
import { AdListComponent } from "./advertisements/ad-list/ad-list.component";
import { HeaderComponent } from "./header/header.component";
import { AppRoutingModule } from "./app-routing.module";

@NgModule({
  declarations: [
    AppComponent,
    AdCreateComponent,
    AdListComponent,
    HeaderComponent
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
    HttpClientModule,
    NgxMaterialTimepickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
