# SOLID 원칙 준수 규칙

## 원칙

**모든 코드는 SOLID 원칙을 따라 설계하고 구현합니다.**

---

## SOLID란?

객체지향 설계의 5가지 핵심 원칙:

- **S**ingle Responsibility Principle (단일 책임 원칙)
- **O**pen/Closed Principle (개방-폐쇄 원칙)
- **L**iskov Substitution Principle (리스코프 치환 원칙)
- **I**nterface Segregation Principle (인터페이스 분리 원칙)
- **D**ependency Inversion Principle (의존성 역전 원칙)

---

## 1. Single Responsibility Principle (SRP)
### 단일 책임 원칙: 하나의 클래스는 하나의 책임만 가진다

### ❌ 나쁜 예: 여러 책임을 가진 클래스

```typescript
class OrderProcessor {
  // 책임 1: 주문 검증
  validateOrder(order: Order): boolean {
    // ...
  }
  
  // 책임 2: 주문 저장
  saveToDatabase(order: Order): void {
    // ...
  }
  
  // 책임 3: 이메일 발송
  sendConfirmationEmail(order: Order): void {
    // ...
  }
  
  // 책임 4: 재고 업데이트
  updateInventory(order: Order): void {
    // ...
  }
}
```

**문제점:**
- 변경 이유가 4가지 (검증 로직, DB 스키마, 이메일 템플릿, 재고 정책)
- 테스트하기 어려움
- 재사용 불가능

### ✅ 좋은 예: 책임을 분리

```typescript
// 책임 1: 주문 검증만 담당
class OrderValidator {
  validate(order: Order): ValidationResult {
    // 검증 로직만
  }
}

// 책임 2: 주문 저장만 담당
class OrderRepository {
  save(order: Order): Promise<Order> {
    // DB 저장 로직만
  }
}

// 책임 3: 이메일 발송만 담당
class EmailService {
  sendOrderConfirmation(order: Order): Promise<void> {
    // 이메일 발송 로직만
  }
}

// 책임 4: 재고 업데이트만 담당
class InventoryService {
  decreaseStock(productId: string, quantity: number): Promise<void> {
    // 재고 업데이트 로직만
  }
}

// 조율자: 각 책임을 조합
class OrderService {
  constructor(
    private validator: OrderValidator,
    private repository: OrderRepository,
    private emailService: EmailService,
    private inventoryService: InventoryService
  ) {}
  
  async createOrder(orderData: CreateOrderDto): Promise<Order> {
    // 1. 검증
    const validationResult = this.validator.validate(orderData);
    if (!validationResult.isValid) {
      throw new ValidationException(validationResult.errors);
    }
    
    // 2. 저장
    const order = await this.repository.save(orderData);
    
    // 3. 재고 업데이트
    await this.inventoryService.decreaseStock(order.productId, order.quantity);
    
    // 4. 이메일 발송
    await this.emailService.sendOrderConfirmation(order);
    
    return order;
  }
}
```

**장점:**
- 각 클래스가 하나의 이유로만 변경됨
- 테스트가 쉬움 (각각 독립적으로 테스트 가능)
- 재사용 가능 (EmailService를 다른 곳에서도 사용)

---

## 2. Open/Closed Principle (OCP)
### 개방-폐쇄 원칙: 확장에는 열려있고, 수정에는 닫혀있어야 한다

### ❌ 나쁜 예: 새 채널 추가 시 기존 코드 수정 필요

```typescript
class OrderCollector {
  async collectOrders(channel: string): Promise<Order[]> {
    if (channel === 'smartstore') {
      return this.collectFromSmartstore();
    } else if (channel === 'coupang') {
      return this.collectFromCoupang();
    } else if (channel === '11st') {
      return this.collectFrom11st();
    }
    // 새 채널 추가 시 이 코드를 계속 수정해야 함 ❌
  }
}
```

### ✅ 좋은 예: 인터페이스를 활용한 확장

```typescript
// 추상화된 인터페이스
interface ChannelAdapter {
  fetchOrders(from: Date, to: Date): Promise<Order[]>;
  updateTrackingNumber(orderId: string, trackingNumber: string): Promise<void>;
}

// 각 채널별 구현체
class SmartstoreAdapter implements ChannelAdapter {
  async fetchOrders(from: Date, to: Date): Promise<Order[]> {
    // 스마트스토어 API 호출
  }
  
  async updateTrackingNumber(orderId: string, trackingNumber: string): Promise<void> {
    // 스마트스토어 송장 등록
  }
}

class CoupangAdapter implements ChannelAdapter {
  async fetchOrders(from: Date, to: Date): Promise<Order[]> {
    // 쿠팡 API 호출
  }
  
  async updateTrackingNumber(orderId: string, trackingNumber: string): Promise<void> {
    // 쿠팡 송장 등록
  }
}

// 새 채널 추가 시 기존 코드 수정 없이 새 클래스만 추가
class AliExpressAdapter implements ChannelAdapter {
  async fetchOrders(from: Date, to: Date): Promise<Order[]> {
    // 알리익스프레스 API 호출
  }
  
  async updateTrackingNumber(orderId: string, trackingNumber: string): Promise<void> {
    // 알리익스프레스 송장 등록
  }
}

// 사용하는 쪽은 변경 불필요
class OrderCollectorService {
  constructor(private adapters: Map<string, ChannelAdapter>) {}
  
  async collectFromChannel(channelType: string): Promise<Order[]> {
    const adapter = this.adapters.get(channelType);
    if (!adapter) {
      throw new Error(`Unknown channel: ${channelType}`);
    }
    return adapter.fetchOrders(new Date(), new Date());
  }
}

// DI Container에서 어댑터 등록
const adapters = new Map<string, ChannelAdapter>([
  ['smartstore', new SmartstoreAdapter()],
  ['coupang', new CoupangAdapter()],
  ['aliexpress', new AliExpressAdapter()] // 새 채널 추가
]);

const collectorService = new OrderCollectorService(adapters);
```

---

## 3. Liskov Substitution Principle (LSP)
### 리스코프 치환 원칙: 자식 클래스는 부모 클래스를 완전히 대체할 수 있어야 한다

### ❌ 나쁜 예: 자식 클래스가 부모의 계약을 위반

```typescript
class Product {
  applyDiscount(percentage: number): void {
    if (percentage < 0 || percentage > 100) {
      throw new Error('Invalid discount percentage');
    }
    this.price = this.price * (1 - percentage / 100);
  }
}

// ❌ LSP 위반: 특정 상황에서 예외 발생
class DigitalProduct extends Product {
  applyDiscount(percentage: number): void {
    if (percentage > 30) {
      // 부모는 허용하지만 자식은 거부 → LSP 위반
      throw new Error('Digital products cannot have discount over 30%');
    }
    super.applyDiscount(percentage);
  }
}

// 사용하는 코드가 깨짐
function applySeasonalDiscount(products: Product[]) {
  products.forEach(product => {
    product.applyDiscount(50); // DigitalProduct에서 예외 발생! 💥
  });
}
```

### ✅ 좋은 예: 계약을 준수하는 설계

```typescript
// 할인 정책을 별도 클래스로 분리
interface DiscountPolicy {
  calculateDiscount(price: number, percentage: number): number;
}

class StandardDiscountPolicy implements DiscountPolicy {
  calculateDiscount(price: number, percentage: number): number {
    if (percentage < 0 || percentage > 100) {
      throw new Error('Invalid discount percentage');
    }
    return price * (1 - percentage / 100);
  }
}

class DigitalProductDiscountPolicy implements DiscountPolicy {
  calculateDiscount(price: number, percentage: number): number {
    if (percentage < 0 || percentage > 30) {
      throw new Error('Invalid discount percentage for digital products');
    }
    return price * (1 - percentage / 100);
  }
}

class Product {
  constructor(
    public price: number,
    private discountPolicy: DiscountPolicy
  ) {}
  
  applyDiscount(percentage: number): void {
    this.price = this.discountPolicy.calculateDiscount(this.price, percentage);
  }
}

// 사용
const physicalProduct = new Product(10000, new StandardDiscountPolicy());
const digitalProduct = new Product(5000, new DigitalProductDiscountPolicy());

physicalProduct.applyDiscount(50); // ✅ OK
digitalProduct.applyDiscount(50);  // ❌ 에러 (예상된 동작)
```

---

## 4. Interface Segregation Principle (ISP)
### 인터페이스 분리 원칙: 클라이언트는 사용하지 않는 인터페이스에 의존하지 않아야 한다

### ❌ 나쁜 예: 거대한 인터페이스

```typescript
// 모든 기능이 하나의 인터페이스에
interface SupplierApi {
  // 주문 관련
  placeOrder(items: OrderItem[]): Promise<string>;
  cancelOrder(orderId: string): Promise<void>;
  
  // 재고 관련
  checkStock(productId: string): Promise<number>;
  updateStock(productId: string, quantity: number): Promise<void>;
  
  // 송장 관련
  getTrackingNumber(orderId: string): Promise<string>;
  
  // 가격 관련
  getPriceList(): Promise<PriceList>;
  negotiatePrice(productId: string, targetPrice: number): Promise<boolean>;
}

// 문제: 송장 번호만 필요한 서비스도 모든 메서드를 구현해야 함
class TrackingNumberService {
  constructor(private supplierApi: SupplierApi) {}
  
  async getTracking(orderId: string): Promise<string> {
    // 이 메서드만 필요함
    return this.supplierApi.getTrackingNumber(orderId);
  }
}
```

### ✅ 좋은 예: 인터페이스를 역할별로 분리

```typescript
// 주문 관련 인터페이스
interface OrderableSupplier {
  placeOrder(items: OrderItem[]): Promise<string>;
  cancelOrder(orderId: string): Promise<void>;
}

// 재고 관련 인터페이스
interface StockProvider {
  checkStock(productId: string): Promise<number>;
  updateStock(productId: string, quantity: number): Promise<void>;
}

// 배송 추적 인터페이스
interface TrackingProvider {
  getTrackingNumber(orderId: string): Promise<string>;
}

// 가격 협상 인터페이스
interface PriceNegotiable {
  getPriceList(): Promise<PriceList>;
  negotiatePrice(productId: string, targetPrice: number): Promise<boolean>;
}

// 각 서비스는 필요한 인터페이스만 의존
class TrackingNumberService {
  constructor(private trackingProvider: TrackingProvider) {}
  
  async getTracking(orderId: string): Promise<string> {
    return this.trackingProvider.getTrackingNumber(orderId);
  }
}

class InventoryService {
  constructor(private stockProvider: StockProvider) {}
  
  async checkAvailability(productId: string, requiredQty: number): Promise<boolean> {
    const available = await this.stockProvider.checkStock(productId);
    return available >= requiredQty;
  }
}

// 실제 구현체는 필요한 인터페이스들을 모두 구현
class DomamaeSupplierAdapter 
  implements OrderableSupplier, StockProvider, TrackingProvider {
  
  async placeOrder(items: OrderItem[]): Promise<string> { /* ... */ }
  async cancelOrder(orderId: string): Promise<void> { /* ... */ }
  async checkStock(productId: string): Promise<number> { /* ... */ }
  async updateStock(productId: string, quantity: number): Promise<void> { /* ... */ }
  async getTrackingNumber(orderId: string): Promise<string> { /* ... */ }
}
```

---

## 5. Dependency Inversion Principle (DIP)
### 의존성 역전 원칙: 고수준 모듈은 저수준 모듈에 의존하지 않고, 둘 다 추상화에 의존해야 한다

### ❌ 나쁜 예: 구체적인 구현에 직접 의존

```typescript
import { PostgresDatabase } from './postgres-database';
import { SendGridEmailService } from './sendgrid-email-service';

// 고수준 모듈이 저수준 모듈의 구체적 구현에 의존
class OrderService {
  private db = new PostgresDatabase(); // ❌ 직접 생성
  private emailService = new SendGridEmailService(); // ❌ 직접 생성
  
  async createOrder(orderData: CreateOrderDto): Promise<Order> {
    const order = await this.db.orders.insert(orderData);
    await this.emailService.send(order.customerEmail, 'Order Confirmation', '...');
    return order;
  }
}

// 문제점:
// 1. PostgresDatabase를 교체하려면 OrderService 수정 필요
// 2. 테스트 시 실제 DB와 이메일을 사용해야 함
// 3. 의존성이 강하게 결합됨
```

### ✅ 좋은 예: 추상화에 의존 (Dependency Injection)

```typescript
// 추상화된 인터페이스 (고수준)
interface Database {
  orders: {
    insert(data: CreateOrderDto): Promise<Order>;
    findById(id: string): Promise<Order | null>;
  };
}

interface EmailService {
  send(to: string, subject: string, body: string): Promise<void>;
}

// 고수준 모듈: 추상화에만 의존
class OrderService {
  constructor(
    private database: Database,
    private emailService: EmailService
  ) {}
  
  async createOrder(orderData: CreateOrderDto): Promise<Order> {
    const order = await this.database.orders.insert(orderData);
    await this.emailService.send(
      order.customerEmail,
      'Order Confirmation',
      `Your order ${order.id} has been confirmed`
    );
    return order;
  }
}

// 저수준 모듈: 인터페이스 구현
class PostgresDatabaseAdapter implements Database {
  orders = {
    async insert(data: CreateOrderDto): Promise<Order> {
      // PostgreSQL 구현
    },
    async findById(id: string): Promise<Order | null> {
      // PostgreSQL 구현
    }
  };
}

class SendGridEmailAdapter implements EmailService {
  async send(to: string, subject: string, body: string): Promise<void> {
    // SendGrid API 호출
  }
}

// Mock 구현 (테스트용)
class InMemoryDatabase implements Database {
  private orders: Order[] = [];
  
  orders = {
    async insert(data: CreateOrderDto): Promise<Order> {
      const order = { id: 'test-id', ...data };
      this.orders.push(order);
      return order;
    },
    async findById(id: string): Promise<Order | null> {
      return this.orders.find(o => o.id === id) || null;
    }
  };
}

class MockEmailService implements EmailService {
  sentEmails: Array<{ to: string; subject: string; body: string }> = [];
  
  async send(to: string, subject: string, body: string): Promise<void> {
    this.sentEmails.push({ to, subject, body });
  }
}

// 프로덕션 사용
const orderService = new OrderService(
  new PostgresDatabaseAdapter(),
  new SendGridEmailAdapter()
);

// 테스트 사용
const testOrderService = new OrderService(
  new InMemoryDatabase(),
  new MockEmailService()
);
```

---

## 6. 실전 적용 예시

### 예시 1: 수요 예측 서비스

```typescript
// ❌ SOLID 원칙 위반
class ForecastService {
  async predictDemand(productId: string): Promise<number> {
    // SRP 위반: 데이터 수집 + 예측 + 저장을 모두 담당
    const salesData = await fetch(`/api/sales/${productId}`).then(r => r.json());
    const prediction = this.runLSTMModel(salesData);
    await this.saveToDatabase(prediction);
    return prediction;
  }
  
  // DIP 위반: TensorFlow에 직접 의존
  private runLSTMModel(data: any): number {
    const tf = require('@tensorflow/tfjs');
    // ...
  }
}
```

```typescript
// ✅ SOLID 원칙 준수
// 1. SRP: 각 책임을 분리
interface SalesDataProvider {
  fetchSalesHistory(productId: string, days: number): Promise<SalesData>;
}

interface ForecastModel {
  predict(input: SalesData): Promise<ForecastResult>;
}

interface ForecastRepository {
  save(forecast: ForecastResult): Promise<void>;
}

// 2. DIP: 추상화에 의존
class DemandForecastService {
  constructor(
    private dataProvider: SalesDataProvider,
    private model: ForecastModel,
    private repository: ForecastRepository
  ) {}
  
  async predictDemand(productId: string, horizon: number): Promise<ForecastResult> {
    // 1. 데이터 수집
    const salesData = await this.dataProvider.fetchSalesHistory(productId, 60);
    
    // 2. 예측
    const forecast = await this.model.predict(salesData);
    
    // 3. 저장
    await this.repository.save(forecast);
    
    return forecast;
  }
}

// 3. OCP: 새 모델 추가 시 기존 코드 수정 불필요
class LSTMForecastModel implements ForecastModel {
  async predict(input: SalesData): Promise<ForecastResult> {
    // LSTM 구현
  }
}

class ARIMAForecastModel implements ForecastModel {
  async predict(input: SalesData): Promise<ForecastResult> {
    // ARIMA 구현 (새 모델 추가)
  }
}

// 4. ISP: 필요한 인터페이스만 사용
class ForecastAccuracyEvaluator {
  constructor(private model: ForecastModel) {} // Repository 불필요
  
  async evaluate(testData: SalesData): Promise<number> {
    const prediction = await this.model.predict(testData);
    return this.calculateMAPE(prediction, testData.actual);
  }
}
```

### 예시 2: 다이내믹 프라이싱

```typescript
// ✅ SOLID 원칙 준수
// 1. SRP: 가격 계산 전략 분리
interface PricingStrategy {
  calculatePrice(context: PricingContext): number;
}

class CompetitorBasedPricing implements PricingStrategy {
  calculatePrice(context: PricingContext): number {
    const { competitorMinPrice, minAllowedPrice } = context;
    return Math.max(competitorMinPrice * 0.99, minAllowedPrice);
  }
}

class CostPlusPricing implements PricingStrategy {
  calculatePrice(context: PricingContext): number {
    const { costPrice, targetMarginRate } = context;
    return costPrice * (1 + targetMarginRate / 100);
  }
}

// 2. OCP: 새 전략 추가 가능
class DemandBasedPricing implements PricingStrategy {
  calculatePrice(context: PricingContext): number {
    const { basePrice, demandScore } = context;
    // 수요가 높으면 가격 상승
    return basePrice * (1 + demandScore / 100);
  }
}

// 3. Strategy Pattern 활용
class PricingService {
  constructor(private strategy: PricingStrategy) {}
  
  calculateOptimalPrice(context: PricingContext): number {
    return this.strategy.calculatePrice(context);
  }
  
  // OCP: 런타임에 전략 변경 가능
  setStrategy(strategy: PricingStrategy): void {
    this.strategy = strategy;
  }
}

// 사용
const competitorPricing = new PricingService(new CompetitorBasedPricing());
const demandPricing = new PricingService(new DemandBasedPricing());
```

---

## 7. 코드 리뷰 체크리스트

Pull Request 시 다음 항목을 검토합니다:

### Single Responsibility
- [ ] 각 클래스/함수가 하나의 책임만 가지는가?
- [ ] 클래스명이 그 책임을 명확히 표현하는가?
- [ ] 변경 이유가 하나인가?

### Open/Closed
- [ ] 새 기능 추가 시 기존 코드 수정이 불필요한가?
- [ ] 인터페이스/추상 클래스를 활용했는가?
- [ ] 전략 패턴이나 템플릿 메서드 패턴을 고려했는가?

### Liskov Substitution
- [ ] 자식 클래스가 부모 클래스의 계약을 위반하지 않는가?
- [ ] 상속보다 조합(Composition)이 더 적합하지 않은가?
- [ ] 부모 타입을 사용하는 곳에 자식 타입을 대체해도 문제없는가?

### Interface Segregation
- [ ] 인터페이스가 클라이언트가 필요한 메서드만 포함하는가?
- [ ] 거대한 인터페이스를 작은 역할로 분리했는가?
- [ ] 사용하지 않는 메서드에 의존하지 않는가?

### Dependency Inversion
- [ ] 구체적 구현 대신 추상화에 의존하는가?
- [ ] Dependency Injection을 사용하는가?
- [ ] 테스트를 위해 Mock으로 대체 가능한가?
- [ ] 인터페이스가 구현체와 같은 모듈에 있지 않은가?

---

## 8. 안티패턴 및 해결책

### 안티패턴 1: God Class (신 클래스)
```typescript
// ❌ 모든 것을 하는 거대한 클래스
class OrderManager {
  validateOrder() {}
  calculatePrice() {}
  applyDiscount() {}
  checkInventory() {}
  processPayment() {}
  sendEmail() {}
  updateDatabase() {}
  generateInvoice() {}
  // ... 수십 개의 메서드
}
```

**해결:** SRP에 따라 역할별로 분리

### 안티패턴 2: Tight Coupling (강한 결합)
```typescript
// ❌ 구체적 구현에 직접 의존
class OrderService {
  private db = new MySQLDatabase();
}
```

**해결:** DIP를 적용하여 인터페이스에 의존

### 안티패턴 3: Switch Statement Smell
```typescript
// ❌ 타입별로 분기 처리
function processPayment(method: string) {
  switch (method) {
    case 'creditcard': // ...
    case 'kakao': // ...
    case 'naver': // ...
  }
}
```

**해결:** OCP를 적용하여 전략 패턴 사용

---

## 9. 참고 자료

- [Clean Architecture (Robert C. Martin)](https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164)
- [Design Patterns (Gang of Four)](https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612)
- [SOLID Principles in TypeScript](https://khalilstemmler.com/articles/solid-principles/solid-typescript/)

---

**SOLID 원칙을 준수하면:**
✅ 유지보수가 쉬워집니다  
✅ 테스트가 간단해집니다  
✅ 코드 재사용성이 높아집니다  
✅ 확장이 용이해집니다  
✅ 버그가 줄어듭니다
