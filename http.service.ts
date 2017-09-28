import axios, { AxiosInstance, AxiosResponse } from "axios";
import logService, { ILogService } from "./log.service";
import cacheStore, { ICacheStore } from './cache.store';

export interface IHttpService {
    $get<T>(location: string, para?: any, noCache?: boolean) : Promise<T>;
    $post<T>(location: string, para?: any) : Promise<T>;
    $delete<T>(location: string, para?: any) : Promise<T>;

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

     $get = async <T>(location: string, para?: any, noCache?: boolean) : Promise<T> => {
        try {
            let cacheKey = this.createCacheKey(location, para);

            if(!noCache) {
                let value = await this.$cache.$get<T>(cacheKey);
                if(value != null) {
                    this.$log.info("[Cached]", value);
                    return value;
                }
            }

            let response = await this.$http.get(this.basepath + location, { params: para });
            if(response.status == 200 && !noCache) {
                this.$cache.$set(cacheKey, response.data);
            }

            return response.data; 
        } catch (e) {
            this.$log.error("http.service => ", e);
        }
    }

     $post = async <T>(location: string, para?: any) : Promise<T> => {
        try {
            let response = await this.$http.post(this.basepath + location, { params: para });
            return response.data;
        } catch (e) {
            this.$log.error("http.service => ", e);
        }
    }

     $delete = async <T>(location: string, para?: any) : Promise<T> => {
        try {
            let response = await this.$http.delete(this.basepath + location, { params: para });
            return response.data;
        } catch (e) {
            this.$log.error("http.service => ", e);
        }
    }

    createCacheKey = (location: string, para?: any) : string => {
        let cacheKey = location;
        if (typeof(para) != "undefined") {
            cacheKey += '?' + encodeURIComponent(JSON.stringify(para));
        }
        return cacheKey;
    }
};

let httpService = new HttpService();
export default httpService;