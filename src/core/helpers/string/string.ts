import DefaultStrings from "core/constants/DefaultStrings";

export const conditionalStringRenderer = (str?: string | null) => {
    const _str = str?.trim();
    return _str && _str.length > 0 ? _str : DefaultStrings.NOT_AVAILABLE;
};