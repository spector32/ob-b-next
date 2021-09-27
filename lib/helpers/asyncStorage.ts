import localforage from "localforage";

const resolveStoragePromise = async (storage: unknown[]): Promise<Record<string, unknown>> => {
    let storageObject = {};
    if (storage.length) {
        storageObject = storage.reduce(
            (prev: Record<string, unknown>, curr: Record<string, unknown>): Record<string, unknown> => {
                return {
                    ...prev,
                    ...curr,
                };
            },
            storageObject,
        );
    }
    return storageObject;
};

const setToAsyncStorage = async (
    items: Record<string, unknown> | string,
    value?: unknown,
): Promise<Record<string, unknown>> => {
    if (typeof items === "object") {
        const promises = [];
        for (const key of Object.keys(items)) {
            const value = items[key];
            promises.push(
                new Promise((resolve, reject) => {
                    localforage
                        .setItem(key, value)
                        .then((item) => {
                            resolve({ [key]: item });
                        })
                        .catch((err) => {
                            reject(err);
                        });
                }),
            );
        }

        const promiseAll = await Promise.all(promises);
        return await resolveStoragePromise(promiseAll);
    } else {
        return await new Promise((resolve, reject) => {
            localforage
                .setItem(items, value)
                .then((item) => {
                    resolve({ [items]: item });
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
};

const getFromAsyncStorage = async (keys: string[] | string): Promise<Record<string, unknown> | unknown> => {
    if (Array.isArray(keys)) {
        const promises = [];
        for (const key of keys) {
            promises.push(
                new Promise((resolve, reject) => {
                    console.log("did it work?");
                    localforage
                        .getItem(key)
                        .then((item) => {
                            resolve({ [key]: item });
                        })
                        .catch((err) => {
                            reject(err);
                        });
                }),
            );
        }

        const promiseAll = await Promise.all(promises);
        return await resolveStoragePromise(promiseAll);
    } else {
        return await localforage.getItem(keys);
    }
};

const removeFromAsyncStorage = async (keys: string[] | string): Promise<Record<string, unknown> | unknown> => {
    if (Array.isArray(keys)) {
        const promises = [];
        for (const key of keys) {
            promises.push(
                new Promise((resolve, reject) => {
                    localforage
                        .removeItem(key)
                        .then((item) => {
                            resolve({ [key]: item });
                        })
                        .catch((err) => {
                            reject(err);
                        });
                }),
            );
        }
        const promiseAll = await Promise.all(promises);
        return await resolveStoragePromise(promiseAll);
    } else {
        return await localforage.removeItem(keys);
    }
};

const asyncStorage: {
    setItem: typeof setToAsyncStorage;
    getItem: typeof getFromAsyncStorage;
    removeItem: typeof removeFromAsyncStorage;
} = {
    setItem: setToAsyncStorage,
    getItem: getFromAsyncStorage,
    removeItem: removeFromAsyncStorage,
};

export { setToAsyncStorage, getFromAsyncStorage, removeFromAsyncStorage };

export default asyncStorage;
