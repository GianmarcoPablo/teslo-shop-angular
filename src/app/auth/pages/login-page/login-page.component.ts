import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms"
import { AuthService } from '@/auth/services/auth.service';
@Component({
  selector: 'auth-login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {

  public authService = inject(AuthService)
  public router = inject(Router)

  private _fb = inject(FormBuilder)
  public hasError = signal<boolean>(false)
  public isPosting = signal<boolean>(false)

  public loginForm = this._fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(6)]]

  })

  onSubmit() {
    if (this.loginForm.invalid) {
      this.hasError.set(true)
      setTimeout(() => {
        this.hasError.set(false)
      }, 2000)
      return
    }

    const { email = "", password = "" } = this.loginForm.value

    this.authService.login(email!, password!).subscribe(isAuth => {
      if (isAuth) {
        this.router.navigateByUrl("/")
        return
      }

      this.hasError.set(true)
      setTimeout(() => {
        this.hasError.set(false)
      }, 2000)
      return
    })
    console.log(this.loginForm.value)
  }
}
