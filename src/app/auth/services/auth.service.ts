import { assertPlatform, computed, inject, Injectable, runInInjectionContext, signal } from "@angular/core";
import { User } from "../interfaces/user.interface";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { AuthResponse } from "../interfaces/auth-response.interface";
import { catchError, map, Observable, of, tap } from "rxjs";
import { rxResource } from "@angular/core/rxjs-interop";

type AuthStatus = "checking" | "authenticated" | "not-authenticated"
const baseUrl = environment.baseUrl

@Injectable({ providedIn: "root" })
export class AuthService {
    private _authStatus = signal<AuthStatus>("checking")
    private _user = signal<User | null>(null)
    private _token = signal<string | null>(null)


    private http = inject(HttpClient)


    checkStatusResource = rxResource({
        loader: () => this.checkStatus(),

    })

    public authStatus = computed<AuthStatus>(() => {
        if (this._authStatus() === "checking") return "checking"
        if (this._user()) {
            return "authenticated"
        }
        return "not-authenticated"
    })

    public user = computed<User | null>(() => {
        return this._user()
    })

    public token = computed<string | null>(() => {
        return this._token()
    })

    public login(email: string, password: string): Observable<boolean> {
        return this.http.post<AuthResponse>(`${baseUrl}/auth/login`, {
            email: email,
            password: password
        }).pipe(
            map(resp => this.handleAuthSuccess(resp)),
            catchError((error: unknown) => this.handleAuthError(error))
        )
    }

    public checkStatus(): Observable<boolean> {
        const token = localStorage.getItem("token")
        if (!token) {
            this.logOut()
            return of(false)
        }
        return this.http.get<AuthResponse>(`${baseUrl}/auth/check-status`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).pipe(
            map(resp => this.handleAuthSuccess(resp)),
            catchError((error: unknown) => this.handleAuthError(error))
        )
    }

    public logOut() {
        this._user.set(null)
        this._token.set(null)
        this._authStatus.set("not-authenticated")
        localStorage.removeItem("token")
    }

    private handleAuthSuccess(resp: AuthResponse) {
        this._user.set(resp.user)
        this._authStatus.set("authenticated")
        this._token.set(resp.token)
        localStorage.setItem("token", resp.token)
        return true
    }

    private handleAuthError(error: unknown) {
        this.logOut()
        return of(false)
    }
}