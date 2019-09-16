import { ILogHelper } from './ILogHelper';

export class LogHelper implements ILogHelper {
    constructor(private _debug: boolean) {
    }

    public debug = (message?: any, ...optionalParams: any[]): void => {
        /* tslint:disable */
        if (this._debug || (<any> window).debug) {
            if (optionalParams.length === 0) {
                console.debug(message);
            } else {
                console.debug(message, ...optionalParams);
            }
        }
        /* tslint:enable */
    };

    public info = (message?: any, ...optionalParams: any[]): void => {
        /* tslint:disable */
            if (optionalParams.length === 0) {
                console.info(message);
            } else {
                console.info(message, ...optionalParams);
            }
        /* tslint:enable */
    };

    public warn = (message?: any, ...optionalParams: any[]): void => {
        if (optionalParams.length === 0) {
            console.warn(message);
        } else {
            console.warn(message, ...optionalParams);
        }
    };

    public error = (message?: any, ...optionalParams: any[]): void => {
        if (optionalParams.length === 0) {
            console.error(message);
        } else {
            console.error(message, ...optionalParams);
        }
    };

    public table = (...tabularData: any[]): void => {
        if (this._debug || (<any> window).debug) {
            console.table(...tabularData);
        }
    }
}