// export enum Events {
//     SET_TITLE = "set_title",
//     // use an enum to keep track of events similar to action types set as variables in redux
// }

type CallbackType = (...params: unknown[]) => unknown;

class EventEmitter {
    _resource = null;
    _events = {};

    constructor(resource: unknown = null) {
        if (resource) {
            this._resource = resource;
        }
    }

    dispatch(event: string, data: unknown = undefined): void {
        if (!this._events[event]) return;
        this._events[event].forEach((callback: CallbackType) => callback(data, this._resource));
    }

    subscribe(event: string, callback: CallbackType): void {
        if (!this._events[event]) this._events[event] = [];
        this._events[event].push(callback);
    }

    unsubscribe(event: string): void {
        if (!this._events[event]) return;
        delete this._events[event];
    }
}

export default EventEmitter;
