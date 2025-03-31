import { Product } from '@/products/interfaces/products.interface';
import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { ProductCarouselComponent } from "@/products/components/product-carousel/product-carousel.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from 'src/app/utils/form-utils';
import { FormErrorLabelComponent } from "../../../shared/components/form-error-label/form-error-label.component";
import { ProductsService } from '@/products/services/products.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'product-details',
  imports: [ProductCarouselComponent, ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {

  public fb = inject(FormBuilder)
  private _router = inject(Router)
  public productService = inject(ProductsService)


  public wasSave = signal<boolean>(false)
  public imageFileList: FileList | undefined = undefined
  public tempImages = signal<string[]>([])
  public product = input.required<Product>()

  public imagesToCarousel = computed(() => {
    const currentProductImages = [...this.product().images, ...this.tempImages()]
    return currentProductImages
  })

  public formUtils = FormUtils

  public productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: [
      '',
      [Validators.required, Validators.pattern(FormUtils.slugPattern)],
    ],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [[]],
    tags: [''],
    gender: [
      'men',
      [Validators.required, Validators.pattern(/men|women|kid|unisex/)],
    ],
  });

  public sizes = ["XS", "S", "M", "L", "XL", "XLL"]

  public ngOnInit(): void {
    this.productForm.reset(this.product() as any)
  }

  public setFormValue(formLike: Partial<Product>) {
    this.productForm.patchValue(formLike as any)
    this.productForm.patchValue({ tags: formLike.tags?.join(",") })
  }

  onSizeClicked(size: string) {
    const currentSizes = this.productForm.value.sizes ?? []
    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1)
    } else {
      currentSizes.push(size)
    }

    this.productForm.patchValue({ sizes: currentSizes })
  }

  public async onSubmit() {
    const isValid = this.productForm.valid
    this.productForm.markAllAsTouched()
    if (!isValid) return
    const formValue = this.productForm.value

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags: formValue.tags?.toLocaleLowerCase().split(",").map(tag => tag.trim()) ?? []
    }

    if (this.product().id === "new") {
      const product = await firstValueFrom(
        this.productService.createProduct(productLike)
      )
      this._router.navigate(["/admin/products", product.id])
    } else {
      await firstValueFrom(
        this.productService.updateProduct(this.product().id, productLike)
      )
    }

    this.wasSave.set(true)
    setTimeout(() => { this.wasSave.set(false) }, 3000)
  }

  onFilesChange(event: Event) {
    const fileList = (event.target as HTMLInputElement).files
    this.imageFileList = fileList ?? undefined
    const imageUrl = Array.from(fileList ?? []).map(file => URL.createObjectURL(file))
    this.tempImages.set(imageUrl)
  }
}
