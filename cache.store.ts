import { cache } from 'awesome-typescript-loader/dist/cache';
import logService, { ILogService } from "./log.service";

interface ICacheHeader {
    key: string;
    expires: number;
}

export interface ICacheStore {
    $get<T>(cacheKey: string): Promise<T>;
    $set(cacheKey: string, value: any, cacheMinutes: number);
    $remove(cacheKey): void;
}

class CacheStore implements ICacheStore {
    private localStorage: Storage;
    private useLocalStorage: boolean;
    private $log: ILogService;
    private cacheHeaders: string = "cacheHeaders";

    constructor() {
        this.$log = logService;
        this.useLocalStorage = (typeof (Storage) !== "undefined");

        if (this.useLocalStorage) {
            this.localStorage = window.localStorage;
            this.$clean();
        }
    }

    $get = async <T>(cacheKey: string): Promise<T> => {
        let valueJson;
        if (this.useLocalStorage) {
            valueJson = await this.localStorage.getItem(cacheKey);
        }

        if (typeof (valueJson) != "undefined") {
            return JSON.parse(valueJson) as T;
        }
        return null;
    }

    $set = async (cacheKey: string, value: any, cacheMinutes: number) => {
        try {
            let valueJson = JSON.stringify(value);
            if (this.useLocalStorage) {
                this.localStorage.setItem(cacheKey, valueJson);
                this.$updateCacheHeaders(cacheKey, 2);
            }
        } catch (e) {
            this.$log.warn("Failed to put item in cache.", e);
        }
    }

    $remove = async (cacheKey: string) => {
        this.$log.info("Remove item", cacheKey);
        if (this.useLocalStorage) {
            this.localStorage.removeItem(cacheKey);
            let h = await this.$get<Date[]>(this.cacheHeaders);
            let index = Object.keys(h).indexOf(cacheKey);
            h.splice(index, 1);
            this.localStorage.setItem(this.cacheHeaders, JSON.stringify(h));
        }
    }

    $clean = async () => {
        let h = await this.$get<ICacheHeader[]>(this.cacheHeaders);
        if(h == null) {
            return;
        }
        
        var now = new Date().getTime();
        for(let i = 0; i < h.length; i++) {
            if(h[i].expires <= now) {
                await this.$remove(h[i].key);
                h.splice(i, 1);
            }
        }
        this.localStorage.setItem(this.cacheHeaders, JSON.stringify(h));
    }

    $updateCacheHeaders = async (cacheKey: string, minutes: number) => {
        let h = await this.$get<ICacheHeader[]>(this.cacheHeaders);
        if(h == null) {
            h = <ICacheHeader[]> [];
        }
        
        let item = <ICacheHeader> {
            key: cacheKey,
            expires: this.futureTime(minutes)
        };

        let updated = false;
        for(let i = 0; i < h.length; i++) {
            if(h[i].key === cacheKey) {
                h[i] = item;
                updated = true;
                break;
            }
        }

        if(!updated) {
            h.push(item);
        }
        this.localStorage.setItem(this.cacheHeaders, JSON.stringify(h));
    }

    futureTime = (minutes: number) : number => {
        var now = new Date();
        now.setMinutes(now.getMinutes() + minutes);
        return now.getTime();
    }
}

let cacheStore = new CacheStore();
export default cacheStore;