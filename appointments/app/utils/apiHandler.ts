// utils/apiHandler.ts
type QueryParams = Record<string, string | number | boolean>;

function buildUrl(url: string, query: QueryParams = {}): string {
    const config = useRuntimeConfig();
    const queryString = new URLSearchParams(
        query as Record<string, string>,
    ).toString();
    return `${config.public.API_BASE}${url}${queryString ? `?${queryString}` : ""}`;
}

function buildHeaders(
    token: string | null = null,
    includeContentType = true,
): HeadersInit {
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    if (includeContentType) headers["Content-Type"] = "application/json";
    return headers;
}

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
    // avoid firing multiple parallel refresh calls if several requests 401 at once
    if (isRefreshing && refreshPromise) return refreshPromise;

    isRefreshing = true;
    refreshPromise = (async () => {
        try {
            const { setToken } = useUser();
            const config = useRuntimeConfig();
            const res = await fetch(`${config.public.API_BASE}/auth/refresh`, {
                method: "POST",
                credentials: "include", // sends the httpOnly refresh cookie
            });

            if (!res.ok) return null;

            const data = await res.json();

            setToken(data.accessToken);

            return data.accessToken as string;
        } catch {
            return null;
        } finally {
            isRefreshing = false;
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}

/**
 * Centralized error snackbar. Called once, here, instead of after every
 * call site. Pass `silent: true` on any request where you want to handle
 * the error yourself (e.g. inline form validation like login failures).
 */
function notifyError(message?: string) {
    const snackbarStore = useSnackbar();
    snackbarStore.showSnackbar({
        message: message ?? "Something went wrong. Please try again.",
        title: "Error",
        type: "error",
    });
}

async function request<T = any>(
    url: string,
    options: RequestInit,
    token: string | null,
    silent = false,
): Promise<T> {
    let res: Response;
    let data: any;

    try {
        res = await fetch(url, {
            ...options,
            credentials: "include",
        });
    } catch (e) {
        // network failure — server unreachable, timeout, offline, etc.
        if (!silent)
            notifyError(
                "Unable to reach the server. Please check your connection.",
            );
        throw e;
    }

    if (res.status === 401) {
        const newToken = await refreshAccessToken();

        if (!newToken) {
            const { resetStore } = useUser();
            resetStore();

            navigateTo("/");
            throw new Error("Session expired");
        }

        // retry original request once, with the new token
        const retryHeaders = new Headers(options.headers);
        retryHeaders.set("Authorization", `Bearer ${newToken}`);

        res = await fetch(url, {
            ...options,
            headers: retryHeaders,
            credentials: "include",
        });
    }

    data = await res.json();

    if (data?.error && !silent) {
        notifyError(data.error.message);
    }

    return data;
}

export async function fetchJsonData<T = any>(
    url: string,
    token: string | null = null,
    query: QueryParams = {},
    silent = false,
): Promise<T> {
    return request<T>(
        buildUrl(url, query),
        { method: "GET", headers: buildHeaders(token) },
        token,
        silent,
    );
}

export async function fetchBlobData(
    url: string,
    token: string | null = null,
    query: QueryParams = {},
): Promise<Blob> {
    const res = await fetch(buildUrl(url, query), {
        method: "GET",
        headers: buildHeaders(token),
        credentials: "include",
    });
    return await res.blob();
}

export async function postJsonData<T = any>(
    url: string,
    body: unknown = {},
    token: string | null = null,
    silent = false,
): Promise<T> {
    return request<T>(
        buildUrl(url),
        {
            method: "POST",
            headers: buildHeaders(token),
            body: JSON.stringify(body),
        },
        token,
        silent,
    );
}

export async function postFormData<T = any>(
    url: string,
    body: FormData = new FormData(),
    token: string | null = null,
    silent = false,
): Promise<T> {
    return request<T>(
        buildUrl(url),
        { method: "POST", headers: buildHeaders(token, false), body },
        token,
        silent,
    );
}

export async function updateJsonData<T = any>(
    url: string,
    body: unknown = {},
    token: string | null = null,
    silent = false,
): Promise<T> {
    return request<T>(
        buildUrl(url),
        {
            method: "PATCH",
            headers: buildHeaders(token),
            body: JSON.stringify(body),
        },
        token,
        silent,
    );
}

export async function deleteJsonData<T = any>(
    url: string,
    body: unknown = {},
    token: string | null = null,
    silent = false,
): Promise<T> {
    return request<T>(
        buildUrl(url),
        {
            method: "DELETE",
            headers: buildHeaders(token),
            body: JSON.stringify(body),
        },
        token,
        silent,
    );
}
