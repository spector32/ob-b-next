import ApiService from "./api.service";

class EntityService extends ApiService {
    /** @constructor */
    constructor(serviceName: string | null = null) {
        super(serviceName || "EntityService");
    }

    redirect(url: string) {
        if (typeof window !== "undefined" && window) {
            window.location.href = url;
        }
    }
}

export default new EntityService();
