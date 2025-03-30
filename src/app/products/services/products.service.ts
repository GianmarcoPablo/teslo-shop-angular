import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Product, ProductsResponse } from "../interfaces/products.interface";
import { count, Observable, of, tap } from "rxjs";
import { environment } from "src/environments/environment";

const baseUrl = environment.baseUrl

interface Options {
    limit?: number;
    offset?: number;
    gender?: string
}

@Injectable({ providedIn: "root" })
export class ProductsService {
    private http = inject(HttpClient);

    private productsCache = new Map<string, ProductsResponse>()
    private productCache = new Map<string, Product>()

    getProducts(options: Options): Observable<ProductsResponse> {

        const { gender = "", limit = 9, offset = 0 } = options

        const key = `${limit}-${offset}-${gender}`

        if (this.productsCache.has(key)) {
            return of(this.productsCache.get(key)!)
        }

        return this.http.get<ProductsResponse>(`${baseUrl}/products`, {
            params: {
                limit,
                offset,
                gender
            }
        }).pipe(
            tap(data => console.log(data)),
            tap(resp => this.productsCache.set(key, resp))
        )
    }

    getProductByIdSlug(idSlug: string): Observable<Product> {

        const key = `${idSlug}`

        if (this.productCache.has(key)) {
            return of(this.productCache.get(key)!)
        }

        return this.http.get<Product>(`${baseUrl}/products/${idSlug}`).pipe(
            tap(resp => this.productCache.set(key, resp))
        )
    }

    getProductById(id: string): Observable<Product> {
        const key = `${id}`

        if (this.productCache.has(key)) {
            return of(this.productCache.get(key)!)
        }

        return this.http.get<Product>(`${baseUrl}/products/${id}`).pipe(
            tap(resp => this.productCache.set(key, resp))
        )
    }

}