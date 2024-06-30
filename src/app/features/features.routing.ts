import { Routes } from "@angular/router";
import { ProductEditComponent } from "./product-edit/product-edit.component";
import { ProductAddComponent } from "./product-add/product-add.component";



export const FeaturesRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'edit',
				component: ProductEditComponent
			},
			{
				path: 'add',
				component: ProductAddComponent
			}
			
		]
	}
];