import { action, makeObservable, observable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { Router } from "next/router";
import EventEmitter from "../helpers/eventEmitter";
import StorageManager from ".";

export class Routing {
    root: typeof StorageManager | null;
    router: Router | null = null;
    events: EventEmitter;

    activeRoutePath: string;

    constructor(root: typeof StorageManager = null) {
        makeObservable(this, {
            activeRoutePath: observable,
            setActiveRoutePath: action,
        });
        makePersistable(this, {
            name: "router",
            properties: ["activeRoutePath"],
        });

        this.root = root;
        // this.router = createRouter('/', {}, ) as NextRouter;
        this.events = new EventEmitter(this);

        // this.init();
    }

    init(): void {
        if (this.router && this.router.events) {
            this.router.events.on("routeChangeStart", (url) => {
                // console.log("test: ", test);
                this.setActiveRoutePath(url);
            });
            console.log("check!");
            this.setActiveRoutePath(this.router.asPath);
        }
    }

    setRouter(router: Router): void {
        if (!this.router) {
            this.router = router;
            this.init();
        }
    }

    setActiveRoutePath(route: string): void {
        this.activeRoutePath = route;
    }

    // Just for testing
    render(item: JSX.Element): unknown {
        return {
            when: (condition = false): JSX.Element => {
                if (condition) {
                    return item;
                }
                return null;
            },
        };
    }
}
