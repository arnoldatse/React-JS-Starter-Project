import DefaultExceptionType from "./DefaultExceptionType";

export default interface Exception<B = unknown, T = unknown> {
    type: DefaultExceptionType | T;
    body?: B;
    message?: string;
}