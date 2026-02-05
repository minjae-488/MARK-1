/**
 * 가격 계산 유틸리티
 * 
 * 이커머스 플랫폼의 핵심 가격 계산 로직을 제공합니다.
 * - 마진율 계산
 * - 판매가 계산
 * - 할인 적용
 */

/**
 * 마진율 계산
 * 
 * @param costPrice - 원가 (양수, 0보다 커야 함)
 * @param sellingPrice - 판매가 (양수)
 * @returns 마진율 (%) - 소수점 2자리까지
 * 
 * @example
 * calculateMarginRate(10000, 15000) // 50
 * calculateMarginRate(10000, 10000) // 0
 * calculateMarginRate(15000, 10000) // -33.33 (역마진)
 */
export function calculateMarginRate(
    costPrice: number,
    sellingPrice: number
): number {
    // 입력 검증
    if (costPrice < 0 || sellingPrice < 0) {
        throw new Error('Prices must be positive');
    }

    if (costPrice === 0) {
        throw new Error('Cost price must be greater than 0');
    }

    // 마진율 계산: ((판매가 - 원가) / 원가) * 100
    const marginRate = ((sellingPrice - costPrice) / costPrice) * 100;

    // 소수점 2자리로 반올림
    return Math.round(marginRate * 100) / 100;
}

/**
 * 판매가 계산
 * 
 * @param costPrice - 원가 (양수, 0보다 커야 함)
 * @param marginRate - 마진율 (%, 0 이상)
 * @returns 판매가 (정수)
 * 
 * @example
 * calculateSellingPrice(10000, 50) // 15000
 * calculateSellingPrice(10000, 0) // 10000
 * calculateSellingPrice(10000, 33.5) // 13350
 */
export function calculateSellingPrice(
    costPrice: number,
    marginRate: number
): number {
    // 입력 검증
    if (costPrice <= 0) {
        throw new Error('Cost price must be greater than 0');
    }

    if (marginRate < 0) {
        throw new Error('Margin rate must be non-negative');
    }

    // 판매가 계산: 원가 * (1 + 마진율/100)
    const sellingPrice = costPrice * (1 + marginRate / 100);

    // 정수로 반올림
    return Math.round(sellingPrice);
}

/**
 * 할인 적용
 * 
 * @param originalPrice - 원가 (양수)
 * @param discountRate - 할인율 (%, 0~100)
 * @returns 할인된 가격 (정수)
 * 
 * @example
 * applyDiscount(10000, 10) // 9000
 * applyDiscount(10000, 100) // 0
 * applyDiscount(10000, 0) // 10000
 */
export function applyDiscount(
    originalPrice: number,
    discountRate: number
): number {
    // 입력 검증
    if (originalPrice < 0) {
        throw new Error('Price must be positive');
    }

    if (discountRate < 0 || discountRate > 100) {
        throw new Error('Discount rate must be between 0 and 100');
    }

    // 할인 적용: 원가 * (1 - 할인율/100)
    const discountedPrice = originalPrice * (1 - discountRate / 100);

    // 정수로 반올림
    return Math.round(discountedPrice);
}
