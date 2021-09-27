import ApiService from "./api.service";
import type AuthCredentials from "../../types/AuthCredentials.type";

class AuthService extends ApiService {
    /** @constructor */
    constructor(serviceName: string | null = null) {
        super(serviceName || "AuthService");
        this.init();
    }

    init() {
        // Chech authentication storage etc.
    }

    async authenticate(credentials: AuthCredentials) {
        const { email, password } = credentials;
        return this.post("users/auth", { email, password });
    }

    redirect(url: string) {
        if (typeof window !== "undefined" && window) {
            window.location.href = url;
        }
    }
}

export default new AuthService();
