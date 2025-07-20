const browserPaths = {
    HOME: '/',
    LOGIN: 'login',
    DASHBOARD: {
        ROOT: 'dashboard',
        HOME: 'dashboard/home',
        HOME_RELATIVE: 'home',
        OTHER: 'dashboard/underPath/other',
        OTHER_RELATIVE: 'underPath/other',
        ERROR: {
            ROOT_RELATIVE: 'error',
            NOT_FOUND: 'dashboard/error/404',
            NOT_FOUND_RELATIVE: '404',
            UNAUTHORIZED: 'dashboard/error/401'
        }
    },
    ERROR: {
        ROOT_RELATIVE: 'error',
        NOT_FOUND: 'error/404',
        NOT_FOUND_RELATIVE: '404',
        UNAUTHORIZED: 'error/401'
    }
}

export default browserPaths;