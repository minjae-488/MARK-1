import { formatDate, addDays, getDaysDiff, isBusinessDay } from '@/utils/date';

describe('Date Utilities', () => {
    describe('formatDate', () => {
        it('should format date to YYYY-MM-DD string', () => {
            // Given: 2024년 1월 1일
            const date = new Date('2024-01-01T00:00:00Z');

            // When
            const formatted = formatDate(date);

            // Then
            expect(formatted).toBe('2024-01-01');
        });

        it('should pad single digits with zero', () => {
            // Given: 2024년 5월 5일
            const date = new Date('2024-05-05T00:00:00Z');

            // When
            const formatted = formatDate(date);

            // Then
            expect(formatted).toBe('2024-05-05');
        });
    });

    describe('addDays', () => {
        it('should add days correctly', () => {
            // Given: 2024-01-01
            const date = new Date('2024-01-01');

            // When: +5일
            const newDate = addDays(date, 5);

            // Then: 2024-01-06
            expect(formatDate(newDate)).toBe('2024-01-06');
        });

        it('should handle month change', () => {
            // Given: 2024-01-31
            const date = new Date('2024-01-31');

            // When: +1일
            const newDate = addDays(date, 1);

            // Then: 2024-02-01
            expect(formatDate(newDate)).toBe('2024-02-01');
        });

        it('should handle leap year correctly', () => {
            // Given: 2024-02-28 (윤년)
            const date = new Date('2024-02-28');

            // When: +1일
            const newDate = addDays(date, 1);

            // Then: 2024-02-29
            expect(formatDate(newDate)).toBe('2024-02-29');
        });

        it('should subtract days when days argument is negative', () => {
            // Given: 2024-01-05
            const date = new Date('2024-01-05');

            // When: -4일
            const newDate = addDays(date, -4);

            // Then: 2024-01-01
            expect(formatDate(newDate)).toBe('2024-01-01');
        });
    });

    describe('getDaysDiff', () => {
        it('should return 0 for same dates', () => {
            const date1 = new Date('2024-01-01');
            const date2 = new Date('2024-01-01');

            expect(getDaysDiff(date1, date2)).toBe(0);
        });

        it('should return positive days when date2 is after date1', () => {
            const date1 = new Date('2024-01-01');
            const date2 = new Date('2024-01-10');

            expect(getDaysDiff(date1, date2)).toBe(9);
        });

        it('should return negative days when date2 is before date1', () => {
            const date1 = new Date('2024-01-10');
            const date2 = new Date('2024-01-01');

            expect(getDaysDiff(date1, date2)).toBe(-9);
        });
    });

    describe('isBusinessDay', () => {
        it('should return true for Monday to Friday', () => {
            // 2024-01-01 (Monday)
            expect(isBusinessDay(new Date('2024-01-01'))).toBe(true);
            // 2024-01-05 (Friday)
            expect(isBusinessDay(new Date('2024-01-05'))).toBe(true);
        });

        it('should return false for Saturday', () => {
            // 2024-01-06 (Saturday)
            expect(isBusinessDay(new Date('2024-01-06'))).toBe(false);
        });

        it('should return false for Sunday', () => {
            // 2024-01-07 (Sunday)
            expect(isBusinessDay(new Date('2024-01-07'))).toBe(false);
        });
    });
});
