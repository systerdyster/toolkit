export interface IIndexDbHelper {
    openDb(): Promise<IDBDatabase>;
    $get<T>(store: string, key: string): Promise<T>;
    $put<T>(store: string, data: T): Promise<T>;
    $putCollection(store: string, data: any[]): Promise<boolean>;
}
