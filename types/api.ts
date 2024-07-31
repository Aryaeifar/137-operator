export interface ApiRoutesOptions {
    name: string;
    url: string;
}

export interface ApiOptions {
    url: string;
    routes?: Array<ApiRoutesOptions>;
}

export type RequestOptions = {
	method?: 'GET' | 'POST'
	body?: RequestInit['body'] | Record<string, any> | FormData | undefined
	pick?: string[]
	params?: Record<string, unknown>
    headers?: HeadersInit
    cache?: boolean
    upload?: boolean
    progress?: Function
    route?: ApiRoutesOptions
    key?: string
}