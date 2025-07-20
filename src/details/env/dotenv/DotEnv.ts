import Env from "core/env/Env";

export default class DotEnv implements Env{
    get(key: string) {
        return process.env[key];
    }
}