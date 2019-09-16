export interface IHttpHelper {
    $get<T>(location: string, para?: any): Promise<T>;
    $post<T>(location: string, para?: any): Promise<T>;
    $put<T>(location: string, para?: any): Promise<T>;
    $patch<T>(location: string, para?: any): Promise<T>;
    $delete<T>(location: string, para?: any): Promise<T>;
}