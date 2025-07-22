import { Routes } from '@angular/router';
import { Home } from './pages/home/home';


export const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        loadComponent: () => {
            return import("./pages/login/login")
                .then(c => c.LoginComponent)
        }
    },
    {
        path: "home",
        pathMatch: "full",
        loadComponent: () => {
            return import("./pages/home/home")
                .then(c => c.Home)
        }
    },
    {
        path: "dashboard",
        pathMatch: "full",
        loadComponent: () => {
            return import("./pages/dashboard/dashboard")
                .then(c => c.Dashboard)
        }
    },
];
