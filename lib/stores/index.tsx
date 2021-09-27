import { Context, createContext, useContext } from "react";
import { configurePersistable } from "mobx-persist-store";
import * as localforage from "localforage";
// import * as memoryDriver from "localforage-driver-memory";

import { App } from "./app.store";
import { Users } from "./users.store";
import { Routing } from "./router.store";
// import { configure } from 'mobx';

const isDevelopment: boolean = process.env.NODE_ENV === "development";

const debugMobx = false;

// localforage.defineDriver(memoryDriver);
// localforage.setDriver(memoryDriver._driver);

if (isDevelopment && typeof window !== "undefined") {
    window.localforage = localforage;
}

configurePersistable({
    storage: localforage,
    // storage: window.localStorage,
    // window.localStorage
    stringify: false,
    debugMode: process.env.NODE_ENV === "development" && debugMobx,
});

// configure({
// 	enforceActions: 'always',
// 	computedRequiresReaction: true,
// 	reactionRequiresObservable: true,
// 	observableRequiresReaction: true,
// 	disableErrorBoundaries: false
// });

class StoreManager {
    app: App;
    users: Users;
    routing: Routing;

    constructor() {
        this.app = new App(this);
        this.users = new Users(this);
        this.routing = new Routing(this);

        // Session data
        // ? TODO: this.routerData = new RouterData();
    }
}

const storeManager: StoreManager = new StoreManager();
const StoreContext: Context<StoreManager> = createContext(storeManager);

export const StoreProvider = ({
    children,
    storeManager,
}: {
    children: React.ReactElement | unknown[];
    storeManager: StoreManager;
}): JSX.Element => {
    return <StoreContext.Provider value={storeManager}>{children}</StoreContext.Provider>;
};
export const useStore = (): StoreManager => useContext(StoreContext);

export default storeManager;
