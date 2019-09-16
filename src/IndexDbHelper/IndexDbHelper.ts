import { ILogHelper } from 'Loghelper/ILogHelper';
import { IIndexDbHelper } from './IIndexDbHelper';

export class IndexDbHelper implements IIndexDbHelper {
    private _notImplemented: boolean;

    constructor(
        private _logHelper: ILogHelper | Console,
        private dbName: string = 'Test Db') {
        if (typeof _logHelper === 'undefined' || !_logHelper) {
            this._logHelper = console;
        }

        this._notImplemented = (!window.indexedDB);

        if (this._notImplemented) {
            this._logHelper.warn('Your browser does not support a stable version of IndexDB');
        }
    }

    public openDb = async () : Promise<IDBDatabase> => {
        return new Promise<IDBDatabase>(async (resolve, reject) => {
            if (this._notImplemented) {
                return reject('Your browser does not support a stable version of IndexDB');
            }

            const request: IDBOpenDBRequest = window.indexedDB.open(this.dbName);

            request.onerror = (event: any) : any => {
                this._logHelper.error('Not allowed to open db', event);
                return reject('Not allowed to open db');
            };

            request.onupgradeneeded = (event: any) => {
                const db: IDBDatabase = event.target.result;
                const store = db.createObjectStore('Files', { keyPath: 'id' });
            };

            request.onsuccess = (event: any) => {
                const db: IDBDatabase = event.target.result;

                db.onerror = ((event: any) => {
                    this._logHelper.error('Database error: ', event.target.errorCode);
                });

                return resolve(db);
            };
        });
    }

    public $get = async <T>(store: string, key: string): Promise<T> => {
        return new Promise<T>(async (resolve, reject) => {
            const db = await this.openDb().catch((msg: string) => {
                return reject(msg);
            });

            if (!db) {
                return reject('No Db Found.');
            }

            const request = db.transaction(store)
                .objectStore(store)
                .get(key)
                .onsuccess = (event: any) => {
                    db.close();
                    return resolve(event.target.result);
            };
        });
    }

    public $put = async <T>(store: string, data: T): Promise<T> => {
        return new Promise<T>(async (resolve, reject) => {
            const db = await this.openDb().catch((msg: string) => {
                return reject(msg);
            });

            if (!db) {
                return reject('No Db Found.');
            }

            const request = db.transaction([store], 'readwrite')
                .objectStore(store)
                .put(data)
                .onsuccess = (event: any) => {
                    db.close();
                    return resolve(event.result);
                };
        });
    }
    
    public $putCollection = async (store: string, data: any[]): Promise<boolean> => {
            return new Promise<boolean>(async (resolve, reject) => {
                const db = await this.openDb().catch((msg: string) => {
                    return reject(msg);
                });
    
                if (!db) {
                    return reject('No Db Found.');
                }

                const tx = db.transaction([store], 'readwrite');
                const objStore = tx.objectStore(store);
    
                for (let i = 0; i < data.length; i++) {
                    objStore.put(data[i]);
                }

                tx.oncomplete = () => {
                    this._logHelper.debug('Transaction Complete');
                    db.close();
                    return resolve(true);
                };
            });
    }
}