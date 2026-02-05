# Test-Driven Development (TDD) 규칙

## 원칙

**UI를 제외한 모든 코어 로직은 반드시 TDD로 구현합니다.**

---

## 1. TDD 사이클 (Red-Green-Refactor)

모든 비즈니스 로직, 서비스, 유틸리티 함수는 다음 순서로 개발합니다:

### 🔴 Red: 실패하는 테스트 작성
```typescript
// ❌ 아직 구현되지 않은 함수를 테스트
describe('OrderService', () => {
  it('should create a new order', async () => {
    const orderData = { ... };
    const result = await orderService.createOrder(orderData);
    expect(result.id).toBeDefined();
  });
});
```

### 🟢 Green: 테스트를 통과하는 최소한의 코드 작성
```typescript
// ✅ 테스트를 통과시키는 가장 단순한 구현
class OrderService {
  async createOrder(data: OrderData): Promise<Order> {
    return { id: 'generated-id', ...data };
  }
}
```

### 🔵 Refactor: 코드 개선 (테스트는 여전히 통과)
```typescript
// ♻️ 더 나은 구조로 리팩토링
class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private idGenerator: IdGenerator
  ) {}
  
  async createOrder(data: OrderData): Promise<Order> {
    const id = await this.idGenerator.generate();
    const order = Order.create({ id, ...data });
    return this.orderRepository.save(order);
  }
}
```

---

## 2. 테스트 작성 규칙

### ✅ 테스트 필수 대상

다음 항목들은 **반드시** 테스트를 먼저 작성합니다:

- **비즈니스 로직**
  - 주문 처리 로직
  - 합배송 그룹핑 알고리즘
  - 수요 예측 계산
  - 다이내믹 프라이싱 로직
  - 재고 관리 로직

- **서비스 레이어**
  - `OrderService`
  - `ProductService`
  - `FulfillmentService`
  - `PricingService`
  - `ForecastService`

- **도메인 모델 메서드**
  - `Order.calculateTotal()`
  - `Product.updatePrice()`
  - `FulfillmentGroup.canAddOrder()`

- **유틸리티 함수**
  - 날짜 계산
  - 가격 계산
  - 데이터 변환
  - 유효성 검증

- **API 엔드포인트** (통합 테스트)
  - 요청/응답 검증
  - 에러 핸들링
  - 인증/인가

### ⚠️ 테스트 제외 대상

다음은 **자동화된 테스트를 작성하지 않습니다** (수동 테스트로 진행):

- **모든 UI 컴포넌트 (React, Next.js)**
  - ❌ 컴포넌트 렌더링 테스트 (Testing Library)
  - ❌ E2E UI 테스트 (Playwright, Cypress)
  - ❌ 스냅샷 테스트
  - ✅ 수동 테스트: 브라우저에서 직접 확인
  - ✅ 예외: UI 로직을 Custom Hook으로 분리한 경우, Hook은 테스트 작성
  
- **설정 파일**
  - `next.config.js`, `tailwind.config.js` 등

- **타입 정의만 있는 파일**
  - `types.ts`, `interfaces.ts`

- **스타일 파일**
  - CSS, SCSS 파일

### ✅ 반드시 TDD로 작성하는 코어 로직

- **백엔드 API** (Controllers, Services, Repositories)
- **비즈니스 로직** (주문 처리, 가격 계산, 수요 예측 등)
- **유틸리티 함수** (날짜 계산, 데이터 변환 등)
- **Custom Hooks** (복잡한 UI 로직을 분리한 경우)
- **ML 모델** (예측 정확도, 성능 테스트)
- **데이터 처리 파이프라인**

---

## 3. 테스트 작성 가이드

### 3.1 테스트 구조 (AAA 패턴)

```typescript
describe('ClassName', () => {
  describe('methodName', () => {
    it('should [expected behavior] when [condition]', () => {
      // Arrange (준비)
      const input = { ... };
      const expectedOutput = { ... };
      
      // Act (실행)
      const result = service.method(input);
      
      // Assert (검증)
      expect(result).toEqual(expectedOutput);
    });
  });
});
```

### 3.2 테스트 네이밍 규칙

**형식:** `should [기대 결과] when [조건]`

**좋은 예:**
```typescript
it('should create order when valid data is provided', ...)
it('should throw error when product is out of stock', ...)
it('should group orders when they have same supplier and postal code', ...)
```

**나쁜 예:**
```typescript
it('test order creation', ...) // ❌ 너무 모호
it('works', ...) // ❌ 무엇을 테스트하는지 불명확
```

### 3.3 테스트 커버리지 목표

- **Unit Tests:** 코드 커버리지 **80% 이상**
- **Integration Tests:** 주요 API 엔드포인트 **100%**
- **E2E Tests:** 핵심 사용자 플로우 **100%**

---

## 4. 테스트 격리 (Isolation)

### 4.1 Mock 및 Stub 사용

외부 의존성은 반드시 Mock/Stub으로 대체합니다:

```typescript
// ✅ 좋은 예: 외부 API를 모킹
describe('OrderService', () => {
  let orderService: OrderService;
  let mockChannelApi: jest.Mocked<ChannelApi>;
  
  beforeEach(() => {
    mockChannelApi = {
      fetchOrders: jest.fn().mockResolvedValue([...])
    };
    orderService = new OrderService(mockChannelApi);
  });
  
  it('should fetch orders from channel API', async () => {
    await orderService.collectOrders('smartstore');
    expect(mockChannelApi.fetchOrders).toHaveBeenCalledWith('smartstore');
  });
});
```

### 4.2 데이터베이스 테스트

- **Unit Test:** In-memory repository 또는 Mock 사용
- **Integration Test:** 테스트 전용 DB (Docker) 사용

```typescript
// Unit Test - Mock Repository
const mockOrderRepo = {
  save: jest.fn().mockResolvedValue(order),
  findById: jest.fn().mockResolvedValue(order)
};

// Integration Test - 실제 DB (테스트 환경)
beforeAll(async () => {
  await db.connect(TEST_DATABASE_URL);
});

afterEach(async () => {
  await db.clear(); // 각 테스트 후 데이터 클리어
});

afterAll(async () => {
  await db.disconnect();
});
```

---

## 5. 테스트 유형별 가이드

### 5.1 Unit Test (단위 테스트)

**대상:** 개별 함수, 메서드, 클래스

**예시:**
```typescript
// src/services/pricing.service.spec.ts
describe('PricingService', () => {
  describe('calculateOptimalPrice', () => {
    it('should return minimum allowed price when competitor price is too low', () => {
      const service = new PricingService();
      const product = { costPrice: 10000, minMarginRate: 20 };
      const competitorPrice = 8000; // 원가보다 낮음
      
      const result = service.calculateOptimalPrice(product, competitorPrice);
      
      expect(result).toBe(12000); // costPrice * 1.2
    });
    
    it('should return 99% of competitor price when it ensures minimum margin', () => {
      const service = new PricingService();
      const product = { costPrice: 10000, minMarginRate: 20 };
      const competitorPrice = 15000;
      
      const result = service.calculateOptimalPrice(product, competitorPrice);
      
      expect(result).toBe(14850); // competitorPrice * 0.99
    });
  });
});
```

### 5.2 Integration Test (통합 테스트)

**대상:** 여러 모듈 간 상호작용

**예시:**
```typescript
// src/api/orders/orders.controller.spec.ts
describe('OrdersController (Integration)', () => {
  let app: INestApplication;
  
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    
    app = moduleRef.createNestApplication();
    await app.init();
  });
  
  it('POST /api/orders - should create a new order', async () => {
    const orderData = {
      channelType: 'smartstore',
      productId: 'prod-123',
      quantity: 2
    };
    
    const response = await request(app.getHttpServer())
      .post('/api/orders')
      .send(orderData)
      .expect(201);
    
    expect(response.body.id).toBeDefined();
    expect(response.body.status).toBe('new');
  });
});
```

### 5.3 E2E Test (End-to-End)

**대상:** 전체 사용자 플로우

**예시:**
```typescript
// e2e/order-fulfillment.spec.ts
import { test, expect } from '@playwright/test';

test('complete order fulfillment flow', async ({ page }) => {
  // 1. 로그인
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');
  
  // 2. 주문 수집 확인
  await page.goto('/orders');
  await expect(page.locator('.order-item')).toHaveCount(5);
  
  // 3. 자동 발주 실행
  await page.click('button:has-text("자동 발주")');
  await expect(page.locator('.toast-success')).toBeVisible();
  
  // 4. 발주 상태 확인
  await expect(page.locator('.order-status')).toHaveText('발주 완료');
});
```

---

## 6. ML 모델 테스트

### 6.1 예측 정확도 테스트

```python
# tests/ml/test_demand_forecast.py
import pytest
from src.ml.demand_forecast import DemandForecastModel

def test_forecast_accuracy_within_threshold():
    """수요 예측 MAPE가 20% 이하인지 검증"""
    model = DemandForecastModel()
    test_data = load_test_dataset('sales_history_2025.csv')
    
    predictions = model.predict(test_data.features)
    mape = calculate_mape(predictions, test_data.actual)
    
    assert mape < 20.0, f"MAPE {mape}% exceeds threshold"

def test_forecast_returns_valid_range():
    """예측값이 유효한 범위 내에 있는지 검증"""
    model = DemandForecastModel()
    predictions = model.predict(sample_data)
    
    assert all(p >= 0 for p in predictions), "Negative predictions found"
    assert all(p < 10000 for p in predictions), "Unrealistic high predictions"
```

### 6.2 모델 성능 회귀 테스트

```python
def test_model_performance_not_degraded():
    """새 모델이 기존 모델보다 성능이 떨어지지 않는지 검증"""
    baseline_model = load_model('models/baseline_v1.0.h5')
    new_model = load_model('models/candidate_v1.1.h5')
    
    test_data = load_test_dataset()
    
    baseline_mape = evaluate_model(baseline_model, test_data)
    new_mape = evaluate_model(new_model, test_data)
    
    assert new_mape <= baseline_mape * 1.05, \
        f"New model MAPE {new_mape} is worse than baseline {baseline_mape}"
```

---

## 7. 테스트 실행 명령어

### 개발 중
```bash
# Watch 모드로 테스트 실행 (변경 시 자동 재실행)
npm run test:watch

# 특정 파일만 테스트
npm run test -- order.service.spec.ts
```

### CI/CD
```bash
# 전체 테스트 + 커버리지
npm run test:cov

# 커버리지 80% 미만 시 실패
npm run test:cov -- --coverageThreshold='{"global":{"lines":80}}'
```

### E2E 테스트
```bash
# Playwright E2E 테스트
npm run test:e2e

# 특정 브라우저만
npm run test:e2e -- --project=chromium
```

---

## 8. CI/CD 통합

### GitHub Actions 워크플로우

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npm run test:cov
      - name: Check coverage threshold
        run: |
          if [ $(cat coverage/coverage-summary.json | jq '.total.lines.pct') -lt 80 ]; then
            echo "Coverage below 80%"
            exit 1
          fi

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npx playwright install
      - run: npm run test:e2e
```

---

## 9. 레거시 코드 처리

이미 테스트 없이 작성된 코드가 있다면:

1. **새 기능 추가 시:** 반드시 테스트 먼저 작성
2. **버그 수정 시:**
   - 버그를 재현하는 테스트를 먼저 작성
   - 테스트가 실패하는 것을 확인
   - 버그 수정
   - 테스트 통과 확인
3. **리팩토링 시:**
   - 기존 동작을 보호하는 테스트 추가
   - 테스트가 통과하는 것을 확인
   - 리팩토링 진행

---

## 10. 체크리스트

코드 작성 전 항상 확인:

- [ ] 이 코드는 비즈니스 로직인가? → **TDD 필수**
- [ ] 테스트를 먼저 작성했는가?
- [ ] 테스트가 실패하는 것을 확인했는가?
- [ ] 최소한의 코드로 테스트를 통과시켰는가?
- [ ] 리팩토링 후에도 테스트가 통과하는가?
- [ ] 커버리지가 80% 이상인가?
- [ ] 모든 엣지 케이스를 테스트했는가?

---

## 11. 참고 자료

- [Jest 공식 문서](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [Playwright E2E Testing](https://playwright.dev/)
- [Test-Driven Development by Example (Kent Beck)](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530)

---

**이 규칙을 지키면:**
✅ 버그가 줄어듭니다  
✅ 리팩토링이 안전해집니다  
✅ 문서화가 자동으로 됩니다  
✅ 설계가 개선됩니다
