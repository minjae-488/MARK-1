/**
 * 날짜 처리 유틸리티
 * 
 * 날짜 포맷팅, 계산 및 검증을 위한 함수들을 제공합니다.
 * 기본적인 Date 객체 조작을 더 안전하고 편하게 만듭니다.
 */

/**
 * Date 객체를 YYYY-MM-DD 형식의 문자열로 변환합니다.
 * UTC 기준으로 변환합니다.
 * 
 * @param date - 변환할 Date 객체
 * @returns 'YYYY-MM-DD' 형식 문자열
 * 
 * @example
 * formatDate(new Date('2024-01-01')) // '2024-01-01'
 */
export function formatDate(date: Date): string {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

/**
 * 특정 날짜에 일(day)을 더하거나 뺍니다.
 * 원본 Date 객체를 변경하지 않고 새로운 Date 객체를 반환합니다 (Immutability).
 * 
 * @param date - 기준 날짜
 * @param days - 더할 일수 (음수일 경우 뺌)
 * @returns 계산된 새로운 Date 객체
 */
export function addDays(date: Date, days: number): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
}

/**
 * 두 날짜 사이의 일수 차이를 계산합니다.
 * (date2 - date1)의 일수를 반환합니다.
 * 시간(Time)은 무시하고 날짜만 기준으로 계산합니다.
 * 
 * @param date1 - 시작 날짜
 * @param date2 - 종료 날짜
 * @returns 일수 차이 (정수)
 */
export function getDaysDiff(date1: Date, date2: Date): number {
    // 시간을 00:00:00으로 초기화하여 순수 날짜 차이만 계산
    const d1 = new Date(date1);
    d1.setHours(0, 0, 0, 0);

    const d2 = new Date(date2);
    d2.setHours(0, 0, 0, 0);

    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}

/**
 * 해당 날짜가 영업일(평일)인지 확인합니다.
 * 현재는 토/일 여부만 판단하며, 공휴일은 고려하지 않습니다.
 * 
 * @param date - 확인할 날짜
 * @returns 평일이면 true, 주말이면 false
 */
export function isBusinessDay(date: Date): boolean {
    const day = date.getDay();
    // 0: Sunday, 6: Saturday
    return day !== 0 && day !== 6;
}
