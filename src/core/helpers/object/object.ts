/**
 * Compare objects values
 * if they are all equal return true else false
 * 
 * @param obj1 
 * @param obj2 
 * @returns 
 */
export const isObjectsEquals = (obj1: any, obj2: any): boolean => {
    if (obj1 === obj2) {
        return true;
    }

    if (obj1 == null || typeof obj1 !== 'object' || obj2 == null || typeof obj2 !== 'object') {
        return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (const key of keys1) {
        if (!keys2.includes(key) || !isObjectsEquals(obj1[key], obj2[key])) {
            return false;
        }
    }

    return true;
}