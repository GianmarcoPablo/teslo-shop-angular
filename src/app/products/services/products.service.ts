import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Product, ProductsResponse } from "../interfaces/products.interface";
import { count, Observable, of, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { User } from "@/auth/interfaces/user.interface";

const baseUrl = environment.baseUrl

interface Options {
    limit?: number;
    offset?: number;
    gender?: string
}

const emptyProduct: Product = {
    id: "new",
    title: "",
    price: 0,
    description: "",
    slug: "",
    stock: 0,
    sizes: [],
    gender: "men",
    tags: [],
    images: [],
    user: {} as User
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

        if (id == "new") {
            return of(emptyProduct)
        }

        if (this.productCache.has(key)) {
            return of(this.productCache.get(key)!)
        }

        return this.http.get<Product>(`${baseUrl}/products/${id}`).pipe(
            tap(resp => this.productCache.set(key, resp))
        )
    }

    updateProduct(id: string, productLike: Partial<Product>): Observable<Product> {
        return this.http.patch<Product>(`${baseUrl}/products/${id}`, productLike).pipe(
            tap((product) => this.updateProductCache(product))
        )
    }

    createProduct(productLike: Partial<Product>): Observable<Product> {
        return this.http.post<Product>(`${baseUrl}/products`, productLike).pipe(
            tap((product) => this.updateProductCache(product))
        )
    }

    updateProductCache(product: Product) {
        const productid = product.id
        this.productCache.set(productid, product)

        this.productsCache.forEach(response => {
            response.products = response.products.map((currentProduct) => {
                return currentProduct.id === productid ? product : currentProduct
            })
        })
    }


}