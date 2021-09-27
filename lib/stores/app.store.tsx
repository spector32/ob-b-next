import { makeObservable, observable, action, computed, runInAction } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { AuthService } from "../services";
import EventEmitter from "../helpers/eventEmitter";
import { setToAsyncStorage, getFromAsyncStorage, removeFromAsyncStorage } from "../helpers/asyncStorage";
import type User from "../services/api/models/User.interface";
import type AuthCredentials from "../types/AuthCredentials.type";
import StorageManager from ".";

enum LoadStatus {
    IDLE = "idle",
    READY = "ready",
    LOADING = "loading",
    REQUESTED = "requested",
    DONE = "done",
    FAILED = "failed",
}

type UserWithToken = User & {
    token: string;
};

// type AllowedEvents = {};

// const getMethods = (obj) => Object.getOwnPropertyNames(obj).filter((item) => typeof obj[item] === "function");

export class App {
    root: typeof StorageManager | null;
    events: EventEmitter;
    service: typeof AuthService;

    _status: LoadStatus = LoadStatus.LOADING;

    sessionToken: string = null;
    user: User = null;
    isReady = false;

    constructor(root: typeof StorageManager = null) {
        makeObservable(this, {
            user: observable,
            sessionToken: observable,
            isReady: observable,
            status: computed,
            isLoading: computed,
            isAuthenticated: computed,
            login: action,
            logout: action,
            setSessionData: action,
        });
        makePersistable(this, {
            name: "app",
            properties: ["user", "sessionToken"],
        });

        this.root = root;
        this.service = AuthService;
        this.events = new EventEmitter(this);

        this.init();
    }

    // ? Consider making it ASYNC
    async init(): Promise<void> {
        const storageItems: Record<string, unknown> = (await getFromAsyncStorage(["token", "_user"])) as Record<
            string,
            unknown
        >;

        if (storageItems) {
            runInAction(() => {
                if (storageItems.token) this.sessionToken = storageItems.token as string;
                if (storageItems._user) this.user = storageItems._user as User;
            });
        }

        runInAction(() => {
            this.isReady = true;
        });
    }

    async login(credentials: AuthCredentials): Promise<User | null> {
        const response: Response = await this.service.authenticate(credentials);
        if (response.status === 200) {
            const userWithToken: UserWithToken = await response.json();
            const { token, ...user } = userWithToken;
            this.setSessionData(token, user);
            this.events.dispatch("authenticated");
            return Promise.resolve(user);
        }
        return Promise.reject(null);
    }

    async logout(): Promise<boolean | null> {
        this.unsetSessionData();
        this.events.dispatch("loggedout");
        return Promise.resolve(true);
        // const response: Response = await this.service.authenticate(`users`, credentials);
        // if (response.status === 200) {
        //     const user: User = await response.json();
        //     this.addUser(user);
        //     return Promise.resolve(user);
        // }

        // ON ERROR
        // return Promise.reject(null);
    }

    async setSessionData(token: string, _user: User): Promise<void> {
        const storageItems: Record<string, unknown> = await setToAsyncStorage({
            token,
            _user,
        });
        if (storageItems.token) this.sessionToken = storageItems.token as string;
        if (storageItems._user) this.user = storageItems._user as User;
    }

    unsetSessionData(): void {
        const storageItems = removeFromAsyncStorage(["token", "_user"]);
        if (storageItems) {
            this.user = null;
            this.sessionToken = null;
        }
    }

    get isAuthenticated(): boolean {
        return !!this.sessionToken && !!this.user;
    }

    get isLoading(): boolean {
        return [LoadStatus.REQUESTED, LoadStatus.LOADING].includes(this._status);
    }

    // get isReady(): boolean {
    //     return !this.isLoading;
    // }

    get status(): LoadStatus {
        return this._status;
    }
}
