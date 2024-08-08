import EnvKeys from "core/env/EnvKeys";
import ViteEnvAdapter from "details/env/vite/ViteEnvAdapter";

const baseUrl = new ViteEnvAdapter().get(EnvKeys.BACKEND_BASE_URL);

export const loginUrl = () => `${baseUrl}/auth`;
export const logoutUrl = (token: string) => `${baseUrl}/logout/${token}`;