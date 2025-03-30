import { Routes } from '@angular/router';
import { NotAuthGuard } from './auth/guards/not-auth.guard';

export const routes: Routes = [
    {
        path: "auth",
        loadChildren: () => import("./auth/auth.routes").then(c => c.authRoutes),
        canMatch: [
            NotAuthGuard
        ]
    },
    {
        path: "admin",
        loadChildren: () => import("./admin-dashboard/admin-dashboard.routes").then(c => c.adminDashboardRoutes)
    },
    {
        path: "",
        loadChildren: () => import("./store-front/store-front.routes").then(c => c.storeFrontRoutes)
    },
];
