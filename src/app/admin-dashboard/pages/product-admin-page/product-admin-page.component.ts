import { ProductDetailsComponent } from '@/admin-dashboard/components/product-details/product-details.component';
import { ProductsService } from '@/products/services/products.service';
import { Component, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-product-admin-page',
  imports: [ProductDetailsComponent],
  templateUrl: './product-admin-page.component.html',
})
export class ProductAdminPageComponent {

  private _router = inject(Router)
  private _activateRoute = inject(ActivatedRoute)
  public productService = inject(ProductsService)

  productId = toSignal(
    this._activateRoute.params
      .pipe(map(params => params["id"]))
  )

  productsResource = rxResource({
    request: () => ({ id: this.productId() }),
    loader: ({ request }) => {
      return this.productService.getProductById(request.id)
    }
  })

  redirectEffect = effect(() => {
    if (this.productsResource.error()) { 
      this._router.navigate([`/admin/products`])
    }
  })
}
