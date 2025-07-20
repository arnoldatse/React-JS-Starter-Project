import EnvKey from "core/env/EnvKey";
import ViteEnv from "details/env/vite/ViteEnv";

const backendBaseUrl = new ViteEnv().get(EnvKey.BACKEND_BASE_URL);

export default backendBaseUrl;