const logErrorHandler = (error: unknown, sourceError: string) => {
    if (error instanceof Error) {
        console.error(error.message, sourceError);
    }
    else {
        console.log(error, sourceError);
    }
}

export default logErrorHandler;