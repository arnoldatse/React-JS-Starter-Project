import Logger from "./Logger";
import Env from "core/env/Env";
import EnvKey from "core/env/EnvKey";

describe("Logger", () => {
    let logger: Logger;
    let mockEnv: jest.Mocked<Env>;

    beforeEach(() => {
        logger = Logger.getInstance();
        mockEnv = {
            get: jest.fn(),
        } as unknown as jest.Mocked<Env>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return the same instance of Logger", () => {
        const logger1 = Logger.getInstance();
        const logger2 = Logger.getInstance();
        expect(logger1).toBe(logger2);
    });

    it("should enable logging when defineLogActivity is called with LOGGING set to 'true'", () => {
        mockEnv.get.mockReturnValue("true");
        logger.defineLogActivity(mockEnv);
        expect(mockEnv.get).toHaveBeenCalledWith(EnvKey.LOGGING);
    });

    it("should not log anything if logging is disabled", () => {
        const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
        const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
        const consoleTraceSpy = jest.spyOn(console, "trace").mockImplementation();
        
        mockEnv.get.mockReturnValue("false");
        logger.defineLogActivity(mockEnv);

        logger.log("Test message", "TestSource");
        expect(consoleLogSpy).not.toHaveBeenCalled();
        expect(consoleErrorSpy).not.toHaveBeenCalled();
        expect(consoleWarnSpy).not.toHaveBeenCalled();
        expect(consoleTraceSpy).not.toHaveBeenCalled();

        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
        consoleWarnSpy.mockRestore();
        consoleTraceSpy.mockRestore();
    });

    it("should log an error message when logging is enabled", () => {
        mockEnv.get.mockReturnValue("true");
        logger.defineLogActivity(mockEnv);

        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
        const error = new Error("Test error");

        logger.log(error, "TestSource");
        expect(consoleErrorSpy).toHaveBeenCalledWith("TestSource", error.message);

        consoleErrorSpy.mockRestore();
    });

    it("should log a warning for an Exception when logging is enabled", () => {
        mockEnv.get.mockReturnValue("true");
        logger.defineLogActivity(mockEnv);

        const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
        const exception = { type: "TestException", message: "Test exception message" };

        logger.log(exception, "TestSource");
        expect(consoleWarnSpy).toHaveBeenCalledWith("Exception in TestSource: ", exception);

        consoleWarnSpy.mockRestore();
    });

    it("should log a generic message when logging is enabled", () => {
        mockEnv.get.mockReturnValue("true");
        logger.defineLogActivity(mockEnv);

        const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
        const message = "Test message";

        logger.log(message, "TestSource");
        expect(consoleLogSpy).toHaveBeenCalledWith("TestSource", message);

        consoleLogSpy.mockRestore();
    });

    it("should log a trace when trace is enabled", () => {
        mockEnv.get.mockReturnValue("true");
        logger.defineLogActivity(mockEnv);

        const consoleTraceSpy = jest.spyOn(console, "trace").mockImplementation();

        logger.log("Test message", "TestSource", true);
        expect(consoleTraceSpy).toHaveBeenCalledWith("Trace log from: ", "TestSource");

        consoleTraceSpy.mockRestore();
    });

    it("should not log a trace when trace is disabled", () => {
        mockEnv.get.mockReturnValue("true");
        logger.defineLogActivity(mockEnv);

        const consoleTraceSpy = jest.spyOn(console, "trace").mockImplementation();

        logger.log("Test message", "TestSource", false);
        expect(consoleTraceSpy).not.toHaveBeenCalled();

        consoleTraceSpy.mockRestore();
    });
});