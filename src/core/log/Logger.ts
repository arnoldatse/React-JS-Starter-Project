import Env from "core/env/Env";
import EnvKey from "core/env/EnvKey";
import Exception from "core/exceptions/Exception";

export default class Logger {
    private static instance: Logger;

    private enabled: boolean = false;

    private constructor() { }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }

        return Logger.instance;
    }

    log(e: unknown, sourceLog: string, trace: boolean = true) {
        if (this.enabled) {
            if (e instanceof Error) {
                console.error(sourceLog, e.message);
            }
            else if ((e as Exception).type) {
                console.warn(`Exception in ${sourceLog}: `, e);
            }
            else {
                console.log(sourceLog, e);
            }

            if (trace) {
                console.trace('Trace log from: ', sourceLog);
            }
        }
    }

    defineLogActivity(env: Env) {
        this.enabled = env.get(EnvKey.LOGGING) === 'true';
    }
}