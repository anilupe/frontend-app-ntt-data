import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './features/product-list/product-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DeleteModalComponent } from './features/product-delete/delete-modal/delete-modal.component';
import { SkeletonComponent } from './shared/skeleton/skeleton.component';
import { AddModalComponent } from './features/product-add/add-modal/add-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    DeleteModalComponent,
    SkeletonComponent,
    AddModalComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
