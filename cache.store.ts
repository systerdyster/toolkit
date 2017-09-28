import logService, { ILogService } from "./log.service"; 

export interface ICacheStore {
    $get<T>(cacheKey: string): Promise<T>;
    $set(cacheKey: string, value: any): void;
    $remove(cacheKey): void;
}

class CacheStore implements ICacheStore {
    private cache: any;
    private localStorage: Storage;
    private useLocalStorage: boolean;
    private $log: ILogService;

    constructor() {
        this.$log = logService;
        this.cache = {};
        this.useLocalStorage = (typeof(Storage) !== "undefined");

        if(this.useLocalStorage) {
            this.localStorage = window.localStorage;
        }
    }

    $get = async <T>(cacheKey: string) : Promise<T> => {
        try {
            let valueJson;

            if(this.useLocalStorage) {
                valueJson = await this.localStorage.getItem(cacheKey);
            } else {
                valueJson = await this.cache[cacheKey];
            }

            if(typeof(valueJson) != "undefined") {
                return JSON.parse(valueJson) as T;
            }
            return null;
        } catch(e) {
            this.$log.error("cache.store => ", e);
        }
    }

    $set = (cacheKey: string, value: any) : void => {
        try {
            let valueJson = JSON.stringify(value);

            if(this.useLocalStorage) {
                this.localStorage.setItem(cacheKey, valueJson);
            } else {
                this.cache[cacheKey] = valueJson;
            }
        } catch(e) {
            this.$log.error("cache.store => ", e);
        }
    } 
    
    $remove = (cacheKey) : void => {
        try {
            if(this.useLocalStorage) {
                this.localStorage.removeItem(cacheKey);
            } else {
                this.cache[cacheKey] = undefined;
            }
        } catch(e) {
            this.$log.error("cache.store => ", e);
        }
    }
}

let cacheStore = new CacheStore();
export default cacheStore;