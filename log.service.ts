export interface ILogService {
    info(msg: string, object?: any);
    warn(msg: string, object?: any);
    error(msg: string, object: any);
}

class LogService implements ILogService {
    info = (msg: string, object?: any) : void => {
        console.info(msg, object);
    }

    warn = (msg: string, object?: any) : void => {
        console.warn(msg);
    }

    error = (msg: string, object?: any): void => {
        console.error(msg);
    }
}

let logService = new LogService();
export default logService;