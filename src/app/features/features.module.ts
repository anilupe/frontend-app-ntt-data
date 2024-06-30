import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { RouterModule } from '@angular/router';
import { FeaturesRoutes } from './features.routing';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductAddComponent } from './product-add/product-add.component';
import { AlertComponent } from '../shared/components/alert/alert.component';



@NgModule({
  
  imports: [
    RouterModule.forChild(FeaturesRoutes),
    CommonModule,
    ReactiveFormsModule  
  ],
  declarations: [ProductEditComponent, ProductAddComponent, AlertComponent    
  ],
})
export class FeaturesModule { }
