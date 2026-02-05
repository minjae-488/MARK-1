# Airtable Schemas

이 디렉토리는 Airtable 데이터베이스의 테이블 스키마를 JSON 형식으로 저장합니다.

## 📋 파일 목록

- `orders.json` - 주문 테이블 스키마
- `products.json` - 상품 테이블 스키마
- `suppliers.json` - 도매처 테이블 스키마
- `fulfillment_groups.json` - 합배송 그룹 테이블 스키마

## 📚 스키마 상세 내용

### orders.json
주문 정보를 저장하는 메인 테이블입니다.

**주요 필드:**
- order_id (Text): 주문 고유 ID
- channel (Single Select): 판매 채널
- status (Single Select): 주문 상태
- created_at (Date): 주문 생성 시간

### products.json
상품 정보를 관리하는 테이블입니다.

**주요 필드:**
- product_id (Text): 상품 고유 ID
- name (Text): 상품명
- cost_price (Number): 원가
- selling_price (Number): 판매가
- margin_rate (Formula): 마진율 자동 계산

### suppliers.json
도매처 정보를 관리하는 테이블입니다.

**주요 필드:**
- supplier_id (Text): 도매처 ID
- name (Text): 도매처명
- contact (Email): 연락처
- api_endpoint (URL): API 엔드포인트

### fulfillment_groups.json
합배송을 위한 그룹 테이블입니다.

**주요 필드:**
- group_id (Text): 그룹 ID
- supplier (Link): 도매처 연결
- postal_prefix (Text): 우편번호 앞 3자리
- total_quantity (Rollup): 총 수량

## 🔧 사용 방법

1. Airtable에서 새 Base 생성
2. 각 JSON 파일을 참고하여 테이블 생성
3. 필드 타입과 옵션 설정
4. Formula 및 Lookup 필드 추가

## 📚 참고 문서

- [TECH_SPEC.md - Airtable 스키마](../TECH_SPEC.md#21-데이터베이스-설계-airtable)
- [Airtable API 문서](https://airtable.com/developers/web/api/introduction)
