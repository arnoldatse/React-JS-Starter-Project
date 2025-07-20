/**
 * Compare objects values
 * if they are all equal return true else false
 * 
 * @param obj1 
 * @param obj2 
 * @returns 
 */
export const isObjectsEquals = (obj1: unknown, obj2: unknown): boolean => {
    if (obj1 === obj2) {
        return true;
    }

    if (obj1 == null || typeof obj1 !== 'object' || obj2 == null || typeof obj2 !== 'object') {
        return false;
    }

    return JSON.stringify(obj1) === JSON.stringify(obj2);
}