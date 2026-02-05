import { isValidEmail, isValidPhoneNumber, isValidPrice, isValidQuantity } from '@/utils/validation';

describe('Validation Utilities', () => {
    describe('isValidEmail', () => {
        it('should return true for valid emails', () => {
            expect(isValidEmail('test@example.com')).toBe(true);
            expect(isValidEmail('user.name+tag@company.co.kr')).toBe(true);
        });

        it('should return false for invalid emails', () => {
            expect(isValidEmail('invalid-email')).toBe(false);
            expect(isValidEmail('@example.com')).toBe(false);
            expect(isValidEmail('user@')).toBe(false);
            expect(isValidEmail('')).toBe(false);
        });
    });

    describe('isValidPhoneNumber', () => {
        it('should return true for valid Korean mobile numbers', () => {
            expect(isValidPhoneNumber('010-1234-5678')).toBe(true);
            expect(isValidPhoneNumber('01012345678')).toBe(true);
        });

        it('should return false for invalid numbers', () => {
            expect(isValidPhoneNumber('010-123-456')).toBe(false); // Too short
            expect(isValidPhoneNumber('123-4567-8901')).toBe(false); // Not 010
            expect(isValidPhoneNumber('abc-defg-hijk')).toBe(false); // Not numbers
        });
    });

    describe('isValidPrice', () => {
        it('should return true for positive integers', () => {
            expect(isValidPrice(1000)).toBe(true);
            expect(isValidPrice(0)).toBe(true); // 0원 무료 상품 가능
        });

        it('should return false for negative numbers', () => {
            expect(isValidPrice(-100)).toBe(false);
        });

        it('should return false for non-integers', () => {
            expect(isValidPrice(100.5)).toBe(false); // 원화는 정수만
        });
    });

    describe('isValidQuantity', () => {
        it('should return true for positive integers greater than 0', () => {
            expect(isValidQuantity(1)).toBe(true);
            expect(isValidQuantity(100)).toBe(true);
        });

        it('should return false for 0 or negative numbers', () => {
            expect(isValidQuantity(0)).toBe(false); // 수량은 1개 이상되어야 함
            expect(isValidQuantity(-1)).toBe(false);
        });

        it('should return false for non-integers', () => {
            expect(isValidQuantity(1.5)).toBe(false); // 수량은 정수만
        });
    });
});
