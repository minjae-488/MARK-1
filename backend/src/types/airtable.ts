/**
 * Airtable 데이터 타입 정의
 * 
 * airtable-schemas/*.json에 정의된 스키마와 일치해야 합니다.
 */

// -----------------------------------------------------------------------------
// Enums (Select 옵션들)
// -----------------------------------------------------------------------------

export type SalesChannel = 'Smartstore' | 'Coupang' | '11st';

export type OrderStatus =
    | 'Paid'           // 결제 완료
    | 'Processing'     // 상품 준비 중
    | 'Ordered'        // 도매처 발주 완료
    | 'Shipped'        // 배송 중
    | 'Delivered'      // 배송 완료
    | 'Cancelled';     // 취소됨

export type ProductStockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export type OrderMethod = 'Email' | 'Website' | 'API' | 'KakaoTalk';

export type FulfillmentGroupStatus =
    | 'Collecting'     // 주문 수집 중
    | 'Ready to Order' // 발주 대기 (조건 충족)
    | 'Ordered'        // 발주 완료
    | 'Shipped'        // 배송 시작
    | 'Completed';     // 완료


// -----------------------------------------------------------------------------
// 테이블 인터페이스
// -----------------------------------------------------------------------------

/**
 * Airtable 공통 필드
 */
export interface AirtableRecord {
    id: string;          // Airtable 내부 Record ID (예: recXXXXXXXXXXXXXX)
    createdTime: string; // 생성 시간 (ISO 8601)
}

/**
 * Orders 테이블
 */
export interface Order extends AirtableRecord {
    fields: {
        'Order ID': string;
        'Channel': SalesChannel;
        'Status': OrderStatus;
        'Product Name': string;
        'Option Code'?: string;
        'Quantity': number;
        'Order Amount': number;
        'Customer Name': string;
        'Phone Number': string;
        'Address': string;
        'Postal Code': string;
        'Tracking Number'?: string;
        'Order Date': string;
        'Fulfillment Group'?: string[]; // Link to Fulfillment Groups
    };
}

/**
 * Products 테이블
 */
export interface Product extends AirtableRecord {
    fields: {
        'Product ID': string;
        'Product Name': string;
        'Supplier'?: string[]; // Link to Suppliers
        'Cost Price': number;
        'Selling Price': number;
        'Margin Rate'?: number; // Formula
        'Stock Status': ProductStockStatus;
        'Smartstore Link'?: string;
        'Memo'?: string;
    };
}

/**
 * Suppliers 테이블
 */
export interface Supplier extends AirtableRecord {
    fields: {
        'Supplier ID': string;
        'Name': string;
        'Order Method': OrderMethod;
        'Contact Email'?: string;
        'Website URL'?: string;
        'Login ID'?: string;
        'Products'?: string[]; // Link to Products
        'Reliability Score'?: number;
    };
}

/**
 * Fulfillment Groups 테이블
 */
export interface FulfillmentGroup extends AirtableRecord {
    fields: {
        'Group ID'?: string; // Formula
        'Supplier'?: string[]; // Link to Suppliers
        'Status': FulfillmentGroupStatus;
        'Orders'?: string[]; // Link to Orders
        'Total Quantity'?: number; // Rollup
        'Postal Prefix'?: string;
        'Created At'?: string;
    };
}
