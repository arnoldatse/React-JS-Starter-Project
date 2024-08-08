import EnvAdapter from "core/env/EnvAdapter";

export default class DotEnvAdapter implements EnvAdapter{
    get(key: string) {
        return process.env[key];
    }
}