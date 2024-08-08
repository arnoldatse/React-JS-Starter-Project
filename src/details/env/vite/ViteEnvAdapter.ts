import EnvAdapter from "core/env/EnvAdapter";

export default class ViteEnvAdapter implements EnvAdapter{
    get(key: string) {
        return import.meta.env[key];
    }
}