import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AdListComponent } from "./advertisements/ad-list/ad-list.component";
import { AdCreateComponent } from "./advertisements/ad-create/ad-create.component";
import { UserCreateComponent } from "./users/user-create/user-create.component";
import { UserListComponent } from "./users/user-list/user-list.component";


const routes: Routes = [
  { path: '', component: AdListComponent },
  { path: 'create', component: AdCreateComponent },
  { path: 'edit/:advertisementId', component: AdCreateComponent },
  { path: 'createUser', component: UserCreateComponent },
  { path: 'editUser/:userId', component: UserCreateComponent },
  { path: 'listofuser', component: UserListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
