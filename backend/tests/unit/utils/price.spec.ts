import { calculateMarginRate, calculateSellingPrice, applyDiscount } from '@/utils/price';

describe('Price Utilities', () => {
    describe('calculateMarginRate', () => {
        it('should calculate margin rate correctly', () => {
            // Given: 원가 10,000원, 판매가 15,000원
            const costPrice = 10000;
            const sellingPrice = 15000;

            // When: 마진율 계산
            const marginRate = calculateMarginRate(costPrice, sellingPrice);

            // Then: 50% 마진율
            expect(marginRate).toBe(50);
        });

        it('should return 0 when selling price equals cost price', () => {
            // Given: 원가와 판매가가 동일
            const price = 10000;

            // When
            const marginRate = calculateMarginRate(price, price);

            // Then: 마진율 0%
            expect(marginRate).toBe(0);
        });

        it('should return negative margin for loss', () => {
            // Given: 역마진 (판매가 < 원가)
            const costPrice = 15000;
            const sellingPrice = 10000;

            // When
            const marginRate = calculateMarginRate(costPrice, sellingPrice);

            // Then: -33.33% (소수점 2자리)
            expect(marginRate).toBe(-33.33);
        });

        it('should throw error when cost price is 0', () => {
            // Given: 원가 0원 (잘못된 입력)
            const costPrice = 0;
            const sellingPrice = 10000;

            // When & Then: 에러 발생
            expect(() => {
                calculateMarginRate(costPrice, sellingPrice);
            }).toThrow('Cost price must be greater than 0');
        });

        it('should throw error when prices are negative', () => {
            // Given: 음수 가격
            const costPrice = -10000;
            const sellingPrice = 15000;

            // When & Then
            expect(() => {
                calculateMarginRate(costPrice, sellingPrice);
            }).toThrow('Prices must be positive');
        });
    });

    describe('calculateSellingPrice', () => {
        it('should calculate selling price from cost and margin rate', () => {
            // Given: 원가 10,000원, 마진율 50%
            const costPrice = 10000;
            const marginRate = 50;

            // When: 판매가 계산
            const sellingPrice = calculateSellingPrice(costPrice, marginRate);

            // Then: 15,000원
            expect(sellingPrice).toBe(15000);
        });

        it('should return cost price when margin rate is 0', () => {
            // Given: 마진율 0%
            const costPrice = 10000;
            const marginRate = 0;

            // When
            const sellingPrice = calculateSellingPrice(costPrice, marginRate);

            // Then: 원가와 동일
            expect(sellingPrice).toBe(costPrice);
        });

        it('should calculate price with decimal margin rate', () => {
            // Given: 원가 10,000원, 마진율 33.5%
            const costPrice = 10000;
            const marginRate = 33.5;

            // When
            const sellingPrice = calculateSellingPrice(costPrice, marginRate);

            // Then: 13,350원
            expect(sellingPrice).toBe(13350);
        });

        it('should throw error for invalid inputs', () => {
            // Given: 잘못된 입력들

            // When & Then
            expect(() => calculateSellingPrice(0, 50)).toThrow();
            expect(() => calculateSellingPrice(-10000, 50)).toThrow();
            expect(() => calculateSellingPrice(10000, -10)).toThrow();
        });
    });

    describe('applyDiscount', () => {
        it('should apply percentage discount correctly', () => {
            // Given: 원가 10,000원, 10% 할인
            const originalPrice = 10000;
            const discountRate = 10;

            // When: 할인 적용
            const discountedPrice = applyDiscount(originalPrice, discountRate);

            // Then: 9,000원
            expect(discountedPrice).toBe(9000);
        });

        it('should return 0 for 100% discount', () => {
            // Given: 100% 할인
            const originalPrice = 10000;
            const discountRate = 100;

            // When
            const discountedPrice = applyDiscount(originalPrice, discountRate);

            // Then: 0원
            expect(discountedPrice).toBe(0);
        });

        it('should throw error for discount rate over 100%', () => {
            // Given: 100% 초과 할인
            const originalPrice = 10000;
            const discountRate = 150;

            // When & Then
            expect(() => {
                applyDiscount(originalPrice, discountRate);
            }).toThrow('Discount rate must be between 0 and 100');
        });

        it('should throw error for negative discount rate', () => {
            // Given: 음수 할인율
            const originalPrice = 10000;
            const discountRate = -10;

            // When & Then
            expect(() => {
                applyDiscount(originalPrice, discountRate);
            }).toThrow('Discount rate must be between 0 and 100');
        });
    });
});
