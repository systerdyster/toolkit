import { IHttpHelper } from './IHttpHelper';

export class HttpHelper implements IHttpHelper {
    public $get<T>(location: string, para?: any): Promise<T> {
        return new Promise<T>(async (resolve, reject) => {
            const options = <RequestInit> {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            };

            if (para) {
                options.body = JSON.stringify(para);
            }

            return fetch(location, options)
                .then(response => {
                    if (response.ok) {
                        return resolve (response.json().catch(() => undefined));
                    }
                    return resolve();
                })
                .catch((e) => {
                    return reject(e.message);
                });
        });
    }    

    public $post<T>(location: string, para?: any): Promise<T> {
        return new Promise<T>(async (resolve, reject) => {
            const options = <RequestInit> {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            };

            if (para) {
                options.body = JSON.stringify(para);
            }

            return fetch(location, options)
                .then(response => {
                    if (response.ok) {
                        return resolve (response.json().catch(() => undefined));
                    }
                    return reject(response.status);
                })
                .catch((e) => {
                    return reject(e.message);
                });
         });
    }

    public $put<T>(location: string, para?: any): Promise<T> {
        return new Promise<T>(async (resolve, reject) => {
            const options = <RequestInit> {
                method: 'PUT',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            };

            if (para) {
                options.body = JSON.stringify(para);
            }

            return fetch(location, options)
                .then(response => {
                    if (response.ok) {
                        return resolve (response.json().catch(() => undefined));
                    }
                    return resolve();
                })
                .catch((e) => {
                    return reject(e.message);
                });
        });
    }

    public $patch<T>(location: string, para?: any): Promise<T> {
        return new Promise<T>(async (resolve, reject) => {
            const options = <RequestInit> {
                method: 'PATCH',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json-patch+json'
                }
            };

            if (para) {
                options.body = JSON.stringify(para);
            }

            return fetch(location, options)
                .then(response => {
                    if (response.ok) {
                        return resolve (response.json().catch(() => undefined));
                    }
                    return resolve();
                })
                .catch((e) => {
                    return reject(e.message);
                });
        });
    }

    public $delete<T>(location: string, para?: any): Promise<T> {
        return new Promise<T>(async (resolve, reject) => {
            const options = <RequestInit> {
                method: 'DELETE',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            };

            if (para) {
                options.body = JSON.stringify(para);
            }

            return fetch(location, options)
                .then(response => {
                    if (response.ok) {
                        return resolve (response.json().catch(() => undefined));
                    }
                    return resolve();
                })
                .catch((e) => {
                    return reject(e.message);
                });
        });
    }
}