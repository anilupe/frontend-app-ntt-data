export interface Product {
  data: ProductItem[];
}

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
}
