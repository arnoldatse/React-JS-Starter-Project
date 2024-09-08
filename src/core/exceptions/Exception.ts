import DefaultExceptionTypes from "./DefaultExceptionTypes";

export default interface Exception<B = unknown, T = unknown> {
    type: DefaultExceptionTypes | T;
    body?: B;
    message?: string;
}