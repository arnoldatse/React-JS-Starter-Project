import backendBaseUrl from "../backendBaseUrl";

export const loginUrl = () => `${backendBaseUrl}/auth`;
export const logoutUrl = (token: string) => `${backendBaseUrl}/logout/${token}`;