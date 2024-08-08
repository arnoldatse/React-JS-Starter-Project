export type StringsType = Record<StringsKeys, string>;

enum StringsKeys {
    french = "french",
    english = "english",
    hello = "hello",
    dashbord = "dashbord",
    failedGettingUserRole = "failedGettingUserRole",
    backToHome = "backToHome",
    pageNotFound = "pageNotFound",
    WeCouldntFindThePageYouAreLookingFor = "WeCouldntFindThePageYouAreLookingFor",
    internalServerError = "internalServerError",
    oopsSomethingWentWrong = "oopsSomethingWentWrong",
    youAreNotAuthorized = "youAreNotAuthorized",
    youDonTHavePermissionToAccessThisPage = "youDonTHavePermissionToAccessThisPage",
    welcomeTo = "welcomeTo",
    pleaseSignIn = "pleaseSignIn",
    password = "password",
    rememberMe = "rememberMe",
    credentials = "credentials",
    badCredentials = "badCredentials",
    emailOrPasswordInvalid = "emailOrPasswordInvalid",
    forgotPassword = "forgotPassword",
    login = "login",
    newOnOurPlatform = "newOnOurPlatform",
    createAnAccount = "createAnAccount",
    or = "or",
    errorOccurred = "errorOccurred",
    unexpectedOrNetworkError = "unexpectedOrNetworkError",
    logout = "logout",
    logoutFailed = "logoutFailed",
}

export default StringsKeys;