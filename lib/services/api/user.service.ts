import ApiService from "./api.service";

class UserService extends ApiService {
    /** @constructor */
    constructor(serviceName: string | null = null) {
        super(serviceName || "UserService");
    }
}

export default new UserService();
