import { isObjectsEquals } from './object';

describe('isObjectsEquals', () => {
    it('should return true for equal objects', () => {
        const obj1 = { name: 'John', age: 30 };
        const obj2 = { name: 'John', age: 30 };

        expect(isObjectsEquals(obj1, obj2)).toBe(true);
    });

    it('should return false for different objects', () => {
        const obj1 = { name: 'John', age: 30 };
        const obj2 = { name: 'Jane', age: 25 };

        expect(isObjectsEquals(obj1, obj2)).toBe(false);
    });

    it('should return false for objects with different properties', () => {
        const obj1 = { name: 'John', age: 30 };
        const obj2 = { name: 'John', age: 30, city: 'New York' };

        expect(isObjectsEquals(obj1, obj2)).toBe(false);
    });

    it('should return false for objects with different nested objects', () => {
        const obj1 = { name: 'John', address: { city: 'New York' } };
        const obj2 = { name: 'John', address: { city: 'Los Angeles' } };

        expect(isObjectsEquals(obj1, obj2)).toBe(false);
    });

    it('should return true for objects with equal nested objects', () => {
        const obj1 = { name: 'John', address: { city: 'New York' } };
        const obj2 = { name: 'John', address: { city: 'New York' } };

        expect(isObjectsEquals(obj1, obj2)).toBe(true);
    });

    it('should return false for objects with different array values', () => {
        const obj1 = { name: 'John', hobbies: ['reading', 'running'] };
        const obj2 = { name: 'John', hobbies: ['reading', 'swimming'] };

        expect(isObjectsEquals(obj1, obj2)).toBe(false);
    });

    it('should return true for objects with equal array values', () => {
        const obj1 = { name: 'John', hobbies: ['reading', 'running'] };
        const obj2 = { name: 'John', hobbies: ['reading', 'running'] };

        expect(isObjectsEquals(obj1, obj2)).toBe(true);
    });
});