/**
 * 데이터 검증 유틸리티
 * 
 * 이메일, 전화번호, 가격, 수량 등 이커머스 핵심 데이터의 유효성을 검증합니다.
 */

/**
 * 이메일 주소 유효성 검증
 * 기본적인 이메일 형식을 정규식으로 확인합니다.
 * 
 * @param email - 검증할 이메일 문자열
 * @returns 유효하면 true, 아니면 false
 */
export function isValidEmail(email: string): boolean {
    if (!email) return false;
    // 기본적인 이메일 정규식 (RFC 5322 완벽 준수는 아님)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

/**
 * 한국 휴대전화 번호 유효성 검증
 * 010으로 시작하는 11자리 번호 (하이픈 허용)
 * 
 * @param phone - 검증할 전화번호 문자열
 * @returns 유효하면 true, 아니면 false
 */
export function isValidPhoneNumber(phone: string): boolean {
    if (!phone) return false;
    // 하이픈 제거
    const cleanPhone = phone.replace(/-/g, '');
    // 010으로 시작하고 총 11자리 숫자
    const phoneRegex = /^010\d{8}$/;
    return phoneRegex.test(cleanPhone);
}

/**
 * 가격 유효성 검증
 * 0 이상의 정수인지 확인 (원화 기준)
 * 
 * @param price - 검증할 가격
 * @returns 유효하면 true, 아니면 false
 */
export function isValidPrice(price: number): boolean {
    return Number.isInteger(price) && price >= 0;
}

/**
 * 수량 유효성 검증
 * 1 이상의 정수인지 확인
 * 
 * @param qty - 검증할 수량
 * @returns 유효하면 true, 아니면 false
 */
export function isValidQuantity(qty: number): boolean {
    return Number.isInteger(qty) && qty > 0;
}
