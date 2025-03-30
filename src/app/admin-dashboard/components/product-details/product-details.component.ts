import { Product } from '@/products/interfaces/products.interface';
import { Component, input } from '@angular/core';
import { ProductCarouselComponent } from "@/products/components/product-carousel/product-carousel.component";

@Component({
  selector: 'product-details',
  imports: [ProductCarouselComponent],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent {
  product = input.required<Product>()
  sizes = ["XS", "S", "M", "L", "XL", "XLL"]
}
