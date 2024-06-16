export type ApiResponse<T = any> = {
    data: T,
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null
    },
    meta: {
        per_page: number;
        current_page: number;
        from: number;
        to: number;
        total: number;
        last_page: number;
        path: string;
    },
    status: number;
    success: boolean;
}