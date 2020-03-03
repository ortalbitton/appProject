import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AdListComponent } from "./advertisements/ad-list/ad-list.component";
import { AdCreateComponent } from "./advertisements/ad-create/ad-create.component";

const routes: Routes = [
  { path: '', component: AdListComponent },
  { path: 'create', component: AdCreateComponent },
  { path: 'edit/:noteId', component: AdCreateComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
