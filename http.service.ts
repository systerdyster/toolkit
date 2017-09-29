import axios, { AxiosInstance } from "axios";
import logService, { ILogService } from "./log.service";
import cacheStore, { ICacheStore } from './cache.store';

export interface IHttpService {
    $get<T>(location: string, para?: any, noCache?: boolean): Promise<T>;
    $post<T>(location: string, para?: any): Promise<T>;
    $delete<T>(location: string, para?: any): Promise<T>;

    createCacheKey(location: string, para?: any): string;
};


class HttpService implements IHttpService {
    private basepath: string = "/api/";

    private $http: AxiosInstance;
    private $log: ILogService;
    private $cache: ICacheStore;

    constructor() {
        this.$http = axios.create();
        this.$log = logService;
        this.$cache = cacheStore;
    }

    $get = async <T>(location: string, para?: any, noCache?: boolean): Promise<T> => {
        let cacheKey = this.createCacheKey(location, para);

        if (!noCache) {
            let value = await this.$cache.$get<T>(cacheKey);
            if (value != null) {
                this.$log.info("[Cached]", value);
                return value;
            }
        }

        let response = await this.$http.get(this.basepath + location, { params: para });
        if (response.status == 200 && !noCache) {
            this.$cache.$set(cacheKey, response.data, 10);
        }

        return response.data;
    }

    $post = async <T>(location: string, para?: any): Promise<T> => {
        let response = await this.$http.post(this.basepath + location, { params: para });
        return response.data;
    }

    $delete = async <T>(location: string, para?: any): Promise<T> => {
        let response = await this.$http.delete(this.basepath + location, { params: para });
        return response.data;
    }

    createCacheKey = (location: string, para?: any): string => {
        let cacheKey = location;
        if (typeof (para) != "undefined") {
            for (var property in para) {
                if (para.hasOwnProperty(property)) {
                    cacheKey += `/${property}=${para[property]}`;
                }
            }
        }
        return cacheKey;
    }
};

let httpService = new HttpService();
export default httpService;