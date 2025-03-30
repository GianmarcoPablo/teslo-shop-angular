import { inject } from "@angular/core";
import { CanMatchFn, Route, Router, UrlSegment } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { firstValueFrom } from "rxjs";

export const NotAuthGuard: CanMatchFn = async (route: Route, segments: UrlSegment[]) => {

    const authService = inject(AuthService)
    const router = inject(Router)

    const isAuth = await firstValueFrom(authService.checkStatus())

    if (isAuth) {
        router.navigateByUrl("/")
        return false
    }

    return true
}