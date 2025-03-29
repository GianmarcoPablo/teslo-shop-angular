import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "auth",
        loadChildren: () => import("./auth/auth.routes").then(c => c.authRoutes)
    },
    {
        path: "",
        loadChildren: () => import("./store-front/store-front.routes").then(c => c.storeFrontRoutes)
    },
];
