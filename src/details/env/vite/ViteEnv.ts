import Env from "core/env/Env";

export default class ViteEnv implements Env{
    get(key: string) {
        return import.meta.env[`VITE_${key}`];
    }
}