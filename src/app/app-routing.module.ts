import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AdListComponent } from "./advertisements/ad-list/ad-list.component";
import { AdCreateComponent } from "./advertisements/ad-create/ad-create.component";
import { LoginComponent } from './users/login/login.component';
import { UserCreateComponent } from "./users/user-create/user-create.component";

const routes: Routes = [
  { path: '', component: AdListComponent },
  { path: 'create', component: AdCreateComponent },
  { path: 'edit/:advertisementId', component: AdCreateComponent },
  { path: 'login', component: LoginComponent },
  { path: 'createUser', component: UserCreateComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
