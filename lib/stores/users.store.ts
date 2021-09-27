import { makeObservable, observable, action, computed } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { UserService } from "../services";
import type User from "../services/api/models/User.interface";
import StorageManager from ".";

enum ErrorCode {
    falsy = 123,
    TEST = "test_error",
}

enum LoadStatus {
    IDLE = "idle",
    REQUESTED = "requested",
    DONE = "done",
    FAILED = "failed",
}

export class Users {
    root: typeof StorageManager | null;
    service: typeof UserService;

    data: User[] = [];
    _status: LoadStatus = LoadStatus.IDLE;

    constructor(root: typeof StorageManager = null) {
        makeObservable(this, {
            data: observable,
            get: action,
            post: action,
            update: action,
            delete: action,
            totalUsers: computed,
            status: computed,
            isLoading: computed,
        });
        makePersistable(this, {
            name: "users",
            properties: ["data"],
        });

        this.root = root;
        this.service = UserService;
    }

    setUsers(users: User[]): void {
        this.data = users;
    }

    addUser(user: User): void {
        const find = this.data.find((f) => f.id === user.id);

        if (!find) {
            this.data.push(user);
        } else {
            const updateUser = {
                ...find,
                ...user,
            };
            // Possibly need to add this: this.data = ..
            this.data.map((listUser: User) => (listUser.id === updateUser.id ? updateUser : listUser));
        }
    }

    removeUser(user: User): void {
        this.data = this.data.filter((f: User) => f.id !== user.id);
    }

    get isLoading(): boolean {
        return this._status === LoadStatus.REQUESTED;
    }

    get status(): LoadStatus {
        return this._status;
    }

    get totalUsers(): number {
        return this.data.length;
    }

    async get(pageNumber: number | null = null, pageLimit: number | null = null): Promise<User[] | null | ErrorCode> {
        this._status = LoadStatus.REQUESTED;
        const response: Response = await this.service.get(`users`, { page: pageNumber, limit: pageLimit });
        if (response.status === 200) {
            const users: [] = await response.json();
            this.setUsers(
                users.map((data: User): User => {
                    return { ...data };
                }),
            );
        }
        this._status = LoadStatus.DONE;
        // Resolve errors here by rejecting the Promise
        // Promise.reject(any value);
        return Promise.resolve([]);
    }

    async post(data: User): Promise<User | null | ErrorCode> {
        const response: Response = await this.service.post(`users`, data);
        if (response.status === 200) {
            const user: User = await response.json();
            this.addUser(user);
            return Promise.resolve(user);
        }
        return Promise.reject(null);
    }

    async update(data: User): Promise<User | null | ErrorCode> {
        const response: Response = await this.service.put(`users/${data.id}`, data);
        if (response.status === 200) {
            const user: User = await response.json();
            this.setUsers([user]);
            return Promise.resolve(user);
        }
        return Promise.reject(null);
    }

    async delete(id: number | string): Promise<User | string | number | ErrorCode> {
        const response: Response = await this.service.put(`users/${id}`);
        if (response.status === 200) {
            const user: User = await response.json();
            this.removeUser(user);
            return Promise.resolve(user);
        }
        return Promise.reject(null);
    }
}
