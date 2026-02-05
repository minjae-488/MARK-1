# Technical Specification
## MARK 1 - AI 기반 자율형 이커머스 통합 솔루션

**문서 버전:** 1.0  
**작성일:** 2026-02-05  
**관련 문서:** [PRD.md](./PRD.md)

---

## 1. 개요

### 1.1 문서 목적
본 문서는 MARK 1 프로젝트의 기술적 구현 방법을 정의합니다. 각 Phase별 아키텍처, 기술 스택, API 설계, 데이터베이스 스키마, 배포 전략을 포함합니다.

### 1.2 Phase별 기술 전략

| Phase | 접근 방식 | 핵심 기술 | 목표 |
|-------|----------|----------|------|
| **Phase 1** | No-code/Low-code | Airtable + Make.com | 빠른 MVP 검증 |
| **Phase 2** | Hybrid (No-code + Custom) | Node.js + OpenAI | AI 기능 추가 |
| **Phase 3** | Full-stack Custom | Next.js + Python + ML | 완전 자동화 |

---

## 2. Phase 1: MVP 기술 스택

### 2.1 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────────┐
│              사용자 인터페이스                        │
│         Airtable Interface + Glide App              │
└────────────────────┬────────────────────────────────┘
                     │ HTTPS
┌────────────────────┴────────────────────────────────┐
│               Make.com Scenarios                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ 주문 수집 │→│ 합배송 로직│→│ 자동 발주 │          │
│  └──────────┘  └──────────┘  └──────────┘          │
└────┬────────────────┬────────────────┬──────────────┘
     │                │                │
┌────┴────┐    ┌─────┴─────┐   ┌─────┴─────┐
│스마트스토어│    │   쿠팡    │   │  도매매   │
│   API   │    │   API     │   │  Webhook  │
└─────────┘    └───────────┘   └───────────┘
     │                │                │
     └────────────────┴────────────────┘
                      │
              ┌───────┴────────┐
              │   Airtable DB  │
              │  (Main Storage)│
              └────────────────┘
```

### 2.2 데이터베이스 설계 (Airtable)

#### Table 1: Orders (주문)
| 필드명 | 타입 | 설명 | 예시 |
|--------|------|------|------|
| order_id | Single Line Text (PK) | 주문 고유 ID | ORD-20260205-001 |
| channel | Single Select | 판매 채널 | 스마트스토어/쿠팡/11번가 |
| channel_order_id | Single Line Text | 채널별 주문번호 | 2024010112345 |
| product_name | Single Line Text | 상품명 | 무선 이어폰 Pro |
| quantity | Number | 주문 수량 | 2 |
| customer_name | Single Line Text | 구매자명 | 홍길동 |
| customer_phone | Phone Number | 연락처 | 010-1234-5678 |
| shipping_address | Long Text | 배송지 | 서울시 강남구... |
| postal_code | Single Line Text | 우편번호 | 06234 |
| order_status | Single Select | 주문 상태 | 신규/발주완료/배송중/완료 |
| supplier | Link to Records | 도매처 | → Suppliers 테이블 |
| fulfillment_group | Single Line Text | 합배송 그룹 ID | FG-20260205-01 |
| created_at | Date | 주문 수집 시간 | 2026-02-05 09:30 |
| shipped_at | Date | 배송 시작 시간 | - |
| tracking_number | Single Line Text | 송장 번호 | 123456789012 |

#### Table 2: Products (상품)
| 필드명 | 타입 | 설명 |
|--------|------|------|
| product_id | Auto Number (PK) | 상품 ID |
| sku | Single Line Text | SKU 코드 |
| product_name | Single Line Text | 상품명 |
| category | Single Select | 카테고리 |
| supplier | Link to Records | 도매처 |
| cost_price | Currency | 도매가 |
| selling_price | Currency | 판매가 |
| margin_rate | Percent | 마진율 (자동 계산) |
| stock_quantity | Number | 현재 재고 |
| safety_stock | Number | 안전 재고 수준 |
| is_active | Checkbox | 판매 활성화 여부 |
| channels | Multiple Select | 등록된 채널 |

#### Table 3: Suppliers (도매처)
| 필드명 | 타입 | 설명 |
|--------|------|------|
| supplier_id | Auto Number (PK) | 도매처 ID |
| supplier_name | Single Line Text | 도매처명 |
| contact_email | Email | 담당자 이메일 |
| contact_phone | Phone Number | 연락처 |
| api_endpoint | URL | API 엔드포인트 |
| api_key | Single Line Text | API 키 (암호화) |
| shipping_cost | Currency | 기본 배송비 |
| min_order_amount | Currency | 최소 주문 금액 |

#### Table 4: Fulfillment_Groups (합배송 그룹)
| 필드명 | 타입 | 설명 |
|--------|------|------|
| group_id | Single Line Text (PK) | 그룹 ID |
| supplier | Link to Records | 도매처 |
| postal_code_prefix | Single Line Text | 우편번호 앞 3자리 |
| orders | Link to Records | 포함된 주문들 |
| total_quantity | Rollup | 총 수량 (자동 합산) |
| status | Single Select | 발주 상태 |
| created_at | Date | 생성 시간 |

### 2.3 Make.com 워크플로우 설계

#### Scenario 1: 주문 수집 자동화
**트리거:** Webhook (5분 간격 스케줄러)

**플로우:**
```
[1] HTTP Request (스마트스토어 API)
    → GET /orders?status=new&from=lastRunTime
    
[2] Iterator (주문 목록 순회)
    
[3] Airtable: Search Records
    → Orders 테이블에서 channel_order_id 중복 체크
    
[4] Router
    ├─ [존재하지 않음] → [5] Airtable: Create Record
    └─ [이미 존재] → Skip
    
[6] 쿠팡 API 호출 (동일 로직 반복)

[7] 11번가 API 호출 (동일 로직 반복)

[8] Slack/카카오톡 알림
    → "신규 주문 {count}건 수집 완료"
```

#### Scenario 2: 합배송 그룹핑
**트리거:** Airtable Record Created (Orders 테이블)

**플로우:**
```
[1] Airtable: Get Record
    → 새로 생성된 주문 정보 조회
    
[2] Tools: Set Variables
    → postal_prefix = substring(postal_code, 0, 3)
    → supplier_id = order.supplier.id
    
[3] Airtable: Search Records (Fulfillment_Groups)
    → 조건: supplier = supplier_id 
           AND postal_code_prefix = postal_prefix
           AND status = 'pending'
           AND created_at = today
    
[4] Router
    ├─ [그룹 존재] → [5] Airtable: Update Record
    │                   → orders 필드에 현재 주문 추가
    └─ [그룹 없음] → [6] Airtable: Create Record
                        → 새 그룹 생성
```

#### Scenario 3: 자동 발주
**트리거:** Airtable Record Updated (Fulfillment_Groups.total_quantity >= 5)

**플로우:**
```
[1] Airtable: Get Record (그룹 정보)

[2] Airtable: List Linked Records (주문 목록)

[3] Iterator (주문별 상품 정보 변환)

[4] Aggregator
    → 동일 상품 수량 합산
    → 발주용 JSON 생성
    
[5] HTTP Request (도매처 API)
    → POST /orders
    → Body: { items: [...], shipping_address: "..." }
    
[6] Router
    ├─ [성공 200] → [7] Airtable: Update Records
    │                   → status = 'ordered'
    │                   → supplier_order_id 저장
    └─ [실패 4xx/5xx] → [8] Slack 긴급 알림
                          → 수동 처리 요청
```

### 2.4 외부 API 연동 상세

#### 스마트스토어 API

**인증:** OAuth 2.0 (Client Credentials)

**주요 엔드포인트:**
```javascript
// 1. 주문 목록 조회
GET https://api.commerce.naver.com/v1/orders
Headers: {
  "Authorization": "Bearer {access_token}",
  "Content-Type": "application/json"
}
Query: {
  "lastChangedFrom": "2026-02-05T00:00:00+09:00",
  "lastChangedType": "PAYED"
}

Response: {
  "data": {
    "lastChangeStatuses": [
      {
        "productOrderId": "2024010112345",
        "productName": "무선 이어폰",
        "quantity": 2,
        "ordererName": "홍길동",
        "ordererTel": "010-1234-5678",
        "shippingAddress": "서울시 강남구...",
        // ...
      }
    ]
  }
}

// 2. 송장 등록
POST https://api.commerce.naver.com/v1/orders/{productOrderId}/dispatch
Body: {
  "dispatchDate": "2026-02-06",
  "shippingCompany": "CJ대한통운",
  "trackingNumber": "123456789012"
}
```

**Rate Limit:** 초당 10 요청

**에러 처리:**
- 401 Unauthorized → 토큰 갱신 후 재시도
- 429 Too Many Requests → Exponential Backoff (1s, 2s, 4s)
- 500 Server Error → 3회 재시도 후 알림

#### 도매매 (비공식 API / 웹훅)

**Option A: 이메일 파싱 (초기)**
```javascript
// Gmail API로 발주 확인 이메일 수신
// 제목: "[도매매] 주문이 접수되었습니다 (주문번호: DM-12345)"
// 내용에서 정규식으로 송장 번호 추출

pattern = /송장번호:\s*(\d{12})/
```

**Option B: Chrome Extension (Phase 2)**
- 도매매 웹사이트 자동 로그인
- Puppeteer로 주문 내역 크롤링
- 송장 번호 추출 및 Webhook 전송

### 2.5 비용 예측 (Phase 1)

| 항목 | 서비스 | 월 예상 비용 |
|------|--------|-------------|
| Database | Airtable Pro (50,000 records) | $40 (약 5만원) |
| Automation | Make.com Pro (10,000 ops/month) | $16 (약 2만원) |
| Notification | 카카오톡 알림톡 (월 1,000건) | 8,000원 |
| API (OpenAI) | - | - |
| Hosting | - | - |
| **합계** | | **약 7.5만원** |

---

## 3. Phase 2: AI 기능 추가

### 3.1 아키텍처 변경사항

```
┌──────────────────────────────────────────────┐
│         Frontend (Phase 2 추가)               │
│          Next.js (관리자 대시보드)             │
│          Deployed on Vercel                  │
└───────────────┬──────────────────────────────┘
                │
┌───────────────┴──────────────────────────────┐
│           Backend API (신규)                  │
│       Node.js (Express) + TypeScript         │
│       Deployed on Vercel Serverless          │
└───┬───────────────────┬──────────────────────┘
    │                   │
    │                   ├─→ [OpenAI API]
    │                   │   GPT-4o (카피라이팅)
    │                   │
    │                   ├─→ [Puppeteer]
    │                   │   네이버 데이터랩 크롤링
    │                   │
    ├─→ [Airtable API] (기존 데이터 연동)
    │
    └─→ [PostgreSQL] (Supabase)
        새로운 분석 데이터 저장
```

### 3.2 기술 스택 추가

| 레이어 | 기술 | 용도 |
|--------|------|------|
| **Frontend** | Next.js 14 (App Router) | 관리자 대시보드 |
| | TypeScript | 타입 안전성 |
| | Tailwind CSS | 스타일링 |
| | shadcn/ui | UI 컴포넌트 |
| | React Query | 서버 상태 관리 |
| **Backend** | Node.js 20 + Express | REST API |
| | TypeScript | 타입 안전성 |
| | Prisma | ORM |
| | Zod | 데이터 검증 |
| **AI** | OpenAI API (GPT-4o) | 카피라이팅 |
| | Langchain | LLM 오케스트레이션 |
| **데이터 수집** | Puppeteer | 웹 크롤링 |
| | Cheerio | HTML 파싱 |
| **Database** | PostgreSQL (Supabase) | 분석 데이터 |
| | Airtable | 운영 데이터 (기존) |
| **Deployment** | Vercel | Frontend + Serverless API |

### 3.3 데이터베이스 스키마 (PostgreSQL)

```sql
-- 트렌드 분석 데이터
CREATE TABLE trend_keywords (
  id SERIAL PRIMARY KEY,
  keyword VARCHAR(100) NOT NULL,
  search_volume INTEGER,
  competition_score DECIMAL(3,2), -- 0.00 ~ 1.00
  opportunity_score DECIMAL(5,2), -- 기회 지수
  data_source VARCHAR(50), -- 'naver_datalab', 'instagram', 'tiktok'
  collected_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_trend_keywords_score 
ON trend_keywords(opportunity_score DESC, collected_at DESC);

-- AI 생성 카피
CREATE TABLE ai_generated_copy (
  id SERIAL PRIMARY KEY,
  product_id VARCHAR(50), -- Airtable product_id 참조
  copy_type VARCHAR(20), -- 'title', 'description', 'promotion'
  prompt TEXT,
  generated_text TEXT,
  model_version VARCHAR(50), -- 'gpt-4o-2024-11-20'
  tokens_used INTEGER,
  user_rating INTEGER, -- 1~5
  is_used BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 경쟁사 가격 추적
CREATE TABLE competitor_prices (
  id SERIAL PRIMARY KEY,
  product_keyword VARCHAR(100),
  competitor_name VARCHAR(100),
  price INTEGER,
  review_count INTEGER,
  rating DECIMAL(2,1),
  url TEXT,
  scraped_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_competitor_prices_keyword 
ON competitor_prices(product_keyword, scraped_at DESC);
```

### 3.4 핵심 API 엔드포인트

#### API 1: AI 카피라이팅 생성

**Endpoint:** `POST /api/ai/generate-copy`

**Request:**
```json
{
  "copyType": "product_description",
  "context": {
    "productName": "무선 이어폰 Pro",
    "category": "전자기기",
    "features": [
      "블루투스 5.3",
      "노이즈 캔슬링",
      "30시간 재생"
    ],
    "targetAudience": "20-30대 직장인",
    "tone": "professional" // casual, persuasive, professional
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "copy_abc123",
    "generatedText": "블루투스 5.3 기술로 끊김 없는 음질을 경험하세요. 강력한 노이즈 캔슬링 기능으로 출퇴근길도 나만의 시간으로. 30시간 장시간 재생으로 충전 걱정 없이 일주일 사용 가능합니다.",
    "tokensUsed": 145,
    "modelVersion": "gpt-4o-2024-11-20",
    "estimatedCost": 0.0029
  }
}
```

**구현 (Node.js + OpenAI):**
```typescript
import OpenAI from 'openai';
import { z } from 'zod';

const GenerateCopySchema = z.object({
  copyType: z.enum(['product_title', 'product_description', 'promotion']),
  context: z.object({
    productName: z.string(),
    category: z.string(),
    features: z.array(z.string()),
    targetAudience: z.string().optional(),
    tone: z.enum(['casual', 'professional', 'persuasive']).default('professional')
  })
});

export async function generateCopy(req: Request, res: Response) {
  try {
    const validated = GenerateCopySchema.parse(req.body);
    
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    const systemPrompt = `당신은 이커머스 카피라이팅 전문가입니다. 
주어진 상품 정보를 바탕으로 구매 전환율이 높은 설득력 있는 문구를 작성하세요.
SEO 최적화를 고려하고, ${validated.context.tone} 톤으로 작성하세요.`;

    const userPrompt = `
상품명: ${validated.context.productName}
카테고리: ${validated.context.category}
주요 특징: ${validated.context.features.join(', ')}
타겟 고객: ${validated.context.targetAudience || '일반'}

${validated.copyType === 'product_title' 
  ? '35자 이내의 검색 최적화된 제목을 생성하세요.'
  : '300-500자 분량의 상세 설명을 작성하세요. 구매 욕구를 자극하는 문구를 포함하세요.'}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const generatedText = completion.choices[0].message.content;
    
    // DB에 저장
    const record = await prisma.aiGeneratedCopy.create({
      data: {
        productId: req.body.productId,
        copyType: validated.copyType,
        prompt: userPrompt,
        generatedText,
        modelVersion: completion.model,
        tokensUsed: completion.usage?.total_tokens || 0
      }
    });

    res.json({
      success: true,
      data: {
        id: record.id,
        generatedText,
        tokensUsed: completion.usage?.total_tokens,
        modelVersion: completion.model,
        estimatedCost: (completion.usage?.total_tokens || 0) * 0.00002 // $0.02 / 1K tokens
      }
    });
  } catch (error) {
    console.error('AI 생성 오류:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
```

#### API 2: 트렌드 키워드 분석

**Endpoint:** `POST /api/trends/analyze`

**Request:**
```json
{
  "categories": ["패션", "전자기기", "뷰티"],
  "period": 7 // 최근 7일
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "updatedAt": "2026-02-05T11:30:00+09:00",
    "keywords": [
      {
        "keyword": "미니 가습기",
        "searchVolume": 45000,
        "competitionScore": 0.32,
        "opportunityScore": 140.63,
        "trend": "rising", // rising, stable, falling
        "recommendedProducts": [
          {
            "supplierName": "도매매",
            "productName": "USB 미니 가습기",
            "costPrice": 3500,
            "suggestedPrice": 12900
          }
        ]
      }
    ]
  }
}
```

**구현 (크롤링 + 분석):**
```typescript
import puppeteer from 'puppeteer';

export async function scrapeNaverDataLab() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://datalab.naver.com/keyword/realtimeList.naver');
  
  // 실시간 급상승 키워드 추출
  const keywords = await page.evaluate(() => {
    const items = document.querySelectorAll('.list_title');
    return Array.from(items).map(item => ({
      keyword: item.textContent?.trim(),
      rank: parseInt(item.getAttribute('data-rank') || '0')
    }));
  });
  
  await browser.close();
  
  // 기회 지수 계산
  for (const kw of keywords) {
    const competitionData = await scrapeCompetition(kw.keyword);
    
    kw.opportunityScore = calculateOpportunity(
      kw.searchVolume,
      competitionData.productCount,
      competitionData.avgReviews
    );
  }
  
  return keywords;
}

function calculateOpportunity(
  searchVolume: number,
  productCount: number,
  avgReviews: number
): number {
  // 기회 지수 = 검색량 / (경쟁 상품 수 × √평균 리뷰 수)
  return searchVolume / (productCount * Math.sqrt(avgReviews));
}
```

### 3.5 비용 예측 (Phase 2)

| 항목 | 서비스 | 월 예상 비용 |
|------|--------|-------------|
| Database (기존) | Airtable Pro | 5만원 |
| Automation | Make.com Pro | 2만원 |
| Database (신규) | Supabase Pro | $25 (3만원) |
| Hosting | Vercel Pro | $20 (2.5만원) |
| AI | OpenAI API (월 100건 생성) | $5 (0.6만원) |
| Proxy | Bright Data (10GB) | 5만원 |
| **합계** | | **약 18만원** |

---

## 4. Phase 3: 완전 자동화 시스템

### 4.1 최종 아키텍처

```
                        ┌─────────────────┐
                        │   Load Balancer │
                        │   (AWS ALB)     │
                        └────────┬────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
            ┌───────┴────────┐      ┌────────┴────────┐
            │  Frontend       │      │  Backend API    │
            │  Next.js        │      │  Node.js        │
            │  (Static S3)    │      │  (ECS Fargate)  │
            └────────────────┘      └────┬────────────┘
                                          │
                        ┌─────────────────┼─────────────────┐
                        │                 │                 │
                ┌───────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐
                │ PostgreSQL   │  │   Redis     │  │  ML Service │
                │ (RDS)        │  │ (ElastiCache│  │  Python     │
                │              │  │             │  │ (EC2/Sagemaker)
                └──────────────┘  └─────────────┘  └─────────────┘
                        │
                ┌───────┴────────┐
                │ TimescaleDB    │
                │ (시계열 데이터)  │
                └────────────────┘
```

### 4.2 핵심 기술 스택

| 레이어 | 기술 | 이유 |
|--------|------|------|
| **Frontend** | Next.js 14 + TypeScript | SSR/SSG for SEO, 타입 안전성 |
| **Backend API** | Node.js (NestJS) | 모듈화, DI, 확장성 |
| **ML Service** | Python (FastAPI) | ML 라이브러리 생태계, 고성능 |
| **Main DB** | PostgreSQL 15 | ACID, 복잡한 쿼리 지원 |
| **Time-series DB** | TimescaleDB | 판매/트렌드 시계열 최적화 |
| **Cache** | Redis 7 | 실시간 가격, 세션 저장 |
| **Message Queue** | BullMQ (Redis 기반) | 비동기 작업 처리 |
| **Object Storage** | AWS S3 | 이미지, 로그 저장 |
| **Monitoring** | Grafana + Prometheus | 성능 모니터링 |
| **Error Tracking** | Sentry | 에러 추적 및 알림 |
| **CI/CD** | GitHub Actions | 자동 배포 |

### 4.3 데이터베이스 스키마 (최종)

```sql
-- 사용자 및 인증
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  business_name VARCHAR(100),
  subscription_plan VARCHAR(20), -- free, starter, pro, enterprise
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 채널 연동 정보
CREATE TABLE channel_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  channel_type VARCHAR(20) NOT NULL, -- smartstore, coupang, 11st
  api_key TEXT, -- 암호화
  api_secret TEXT, -- 암호화
  refresh_token TEXT,
  token_expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  last_synced_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 주문 (최종 버전)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  channel_type VARCHAR(20) NOT NULL,
  channel_order_id VARCHAR(100) NOT NULL,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255),
  quantity INTEGER,
  unit_price INTEGER,
  total_price INTEGER,
  customer_name VARCHAR(100),
  customer_phone VARCHAR(20),
  shipping_address TEXT,
  postal_code VARCHAR(10),
  order_status VARCHAR(20), -- new, processing, shipped, delivered, cancelled
  supplier_id UUID REFERENCES suppliers(id),
  fulfillment_group_id UUID REFERENCES fulfillment_groups(id),
  tracking_number VARCHAR(50),
  ordered_at TIMESTAMP NOT NULL,
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(channel_type, channel_order_id)
);

CREATE INDEX idx_orders_user_status ON orders(user_id, order_status);
CREATE INDEX idx_orders_ordered_at ON orders(ordered_at DESC);

-- 상품
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  sku VARCHAR(50) UNIQUE,
  product_name VARCHAR(255) NOT NULL,
  category VARCHAR(50),
  supplier_id UUID REFERENCES suppliers(id),
  cost_price INTEGER NOT NULL,
  selling_price INTEGER NOT NULL,
  margin_rate DECIMAL(5,2) GENERATED ALWAYS AS 
    ((selling_price - cost_price)::DECIMAL / selling_price * 100) STORED,
  stock_quantity INTEGER DEFAULT 0,
  safety_stock INTEGER DEFAULT 10,
  channels TEXT[], -- {smartstore, coupang, 11st}
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 판매 이력 (시계열 - TimescaleDB)
CREATE TABLE sales_history (
  id UUID DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id UUID NOT NULL,
  channel_type VARCHAR(20),
  quantity INTEGER,
  revenue INTEGER,
  cost INTEGER,
  profit INTEGER,
  sold_at TIMESTAMP NOT NULL,
  PRIMARY KEY (sold_at, id)
);

SELECT create_hypertable('sales_history', 'sold_at');

-- 수요 예측 결과
CREATE TABLE demand_forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  forecast_date DATE NOT NULL,
  predicted_quantity INTEGER,
  confidence_interval_lower INTEGER,
  confidence_interval_upper INTEGER,
  model_version VARCHAR(50),
  mape DECIMAL(5,2), -- 예측 오차율
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id, forecast_date)
);

-- 가격 변동 이력 (시계열)
CREATE TABLE price_history (
  id UUID DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  old_price INTEGER,
  new_price INTEGER,
  change_reason VARCHAR(50), -- manual, dynamic_pricing, competitor_match
  competitor_min_price INTEGER,
  adjusted_at TIMESTAMP NOT NULL,
  PRIMARY KEY (adjusted_at, id)
);

SELECT create_hypertable('price_history', 'adjusted_at');
```

### 4.4 수요 예측 ML 파이프라인

#### 4.4.1 모델 학습 Flow

```
[1] 데이터 수집
    ↓
    sales_history, trend_keywords, external_events
    
[2] Feature Engineering
    ↓
    - 시계열 특성: lag_7d, lag_14d, lag_30d
    - 요일/월/분기 더미 변수
    - 트렌드 검색량 (rolling average)
    - 이벤트 플래그 (명절, 세일 기간)
    
[3] 모델 학습 (LSTM)
    ↓
    - Input: 과거 60일 데이터
    - Output: 미래 7일/14일/30일 판매량
    - Loss: MAE (Mean Absolute Error)
    
[4] 검증
    ↓
    - Test set: 최근 30일 데이터
    - Metric: MAPE < 15%
    
[5] 모델 배포
    ↓
    - S3에 모델 저장 (model_v1.0.0.h5)
    - API 엔드포인트 업데이트
```

#### 4.4.2 구현 (Python + TensorFlow)

```python
# forecast_model.py
import numpy as np
import pandas as pd
from tensorflow import keras
from tensorflow.keras import layers
import psycopg2

class DemandForecastModel:
    def __init__(self, lookback=60, forecast_horizon=7):
        self.lookback = lookback
        self.forecast_horizon = forecast_horizon
        self.model = None
        
    def build_model(self, input_shape):
        """LSTM 모델 구조 정의"""
        model = keras.Sequential([
            layers.LSTM(64, return_sequences=True, input_shape=input_shape),
            layers.Dropout(0.2),
            layers.LSTM(32, return_sequences=False),
            layers.Dropout(0.2),
            layers.Dense(16, activation='relu'),
            layers.Dense(self.forecast_horizon)
        ])
        
        model.compile(
            optimizer='adam',
            loss='mae',
            metrics=['mse', 'mape']
        )
        
        self.model = model
        return model
    
    def prepare_data(self, df):
        """시계열 데이터를 학습용으로 변환"""
        features = ['daily_sales', 'trend_score', 'day_of_week', 
                   'is_weekend', 'is_holiday']
        
        X, y = [], []
        
        for i in range(len(df) - self.lookback - self.forecast_horizon):
            X.append(df[features].iloc[i:i+self.lookback].values)
            y.append(df['daily_sales'].iloc[
                i+self.lookback:i+self.lookback+self.forecast_horizon
            ].values)
        
        return np.array(X), np.array(y)
    
    def train(self, product_id, epochs=50):
        """특정 상품의 판매 데이터로 모델 학습"""
        # PostgreSQL에서 데이터 로드
        conn = psycopg2.connect(DATABASE_URL)
        query = f"""
            SELECT 
                DATE(sold_at) as date,
                SUM(quantity) as daily_sales
            FROM sales_history
            WHERE product_id = '{product_id}'
            AND sold_at >= NOW() - INTERVAL '120 days'
            GROUP BY DATE(sold_at)
            ORDER BY date
        """
        df = pd.read_sql(query, conn)
        
        # Feature engineering
        df['day_of_week'] = pd.to_datetime(df['date']).dt.dayofweek
        df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
        # ... 추가 특성 생성
        
        X, y = self.prepare_data(df)
        
        # Train/Val split
        split = int(len(X) * 0.8)
        X_train, X_val = X[:split], X[split:]
        y_train, y_val = y[:split], y[split:]
        
        # 학습
        history = self.model.fit(
            X_train, y_train,
            validation_data=(X_val, y_val),
            epochs=epochs,
            batch_size=32,
            callbacks=[
                keras.callbacks.EarlyStopping(patience=10),
                keras.callbacks.ModelCheckpoint('best_model.h5')
            ]
        )
        
        return history
    
    def predict(self, recent_data):
        """향후 판매량 예측"""
        X = np.array([recent_data])
        predictions = self.model.predict(X)
        return predictions[0]

# API 엔드포인트 (FastAPI)
from fastapi import FastAPI
app = FastAPI()

@app.post("/api/ml/forecast")
async def forecast_demand(product_id: str, horizon: int = 7):
    model = load_model(product_id)  # S3에서 모델 로드
    
    # 최근 60일 데이터 조회
    recent_data = fetch_recent_sales(product_id, days=60)
    
    # 예측
    predictions = model.predict(recent_data)
    
    # 신뢰 구간 계산 (부트스트랩)
    confidence_intervals = calculate_confidence_intervals(predictions)
    
    return {
        "product_id": product_id,
        "forecast_horizon": horizon,
        "predictions": predictions.tolist(),
        "confidence_intervals": confidence_intervals
    }
```

### 4.5 다이내믹 프라이싱 알고리즘

```typescript
// dynamic-pricing.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from './redis.service';

@Injectable()
export class DynamicPricingService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(CompetitorPrice) private competitorRepo: Repository<CompetitorPrice>,
    private redis: RedisService
  ) {}

  async adjustPrice(productId: string): Promise<number> {
    // 1. 현재 상품 정보 조회
    const product = await this.productRepo.findOne({ where: { id: productId } });
    
    // 2. 최근 경쟁사 가격 조회 (Redis 캐시 활용)
    const cacheKey = `competitor_price:${product.sku}`;
    let competitorPrices = await this.redis.get(cacheKey);
    
    if (!competitorPrices) {
      competitorPrices = await this.competitorRepo.find({
        where: { productKeyword: product.productName },
        order: { scrapedAt: 'DESC' },
        take: 10
      });
      await this.redis.set(cacheKey, competitorPrices, 3600); // 1시간 캐시
    }
    
    const minCompetitorPrice = Math.min(...competitorPrices.map(p => p.price));
    
    // 3. 가격 결정 로직
    const minAllowedPrice = product.costPrice * (1 + product.minMarginRate / 100);
    const targetPrice = Math.max(
      minCompetitorPrice * 0.99, // 최저가의 99%
      minAllowedPrice // 최소 마진 보장
    );
    
    // 4. 가격 변동 제한 (1일 최대 10%)
    const maxDailyChange = product.sellingPrice * 0.1;
    const priceDiff = Math.abs(targetPrice - product.sellingPrice);
    
    let newPrice = targetPrice;
    if (priceDiff > maxDailyChange) {
      newPrice = product.sellingPrice + 
        (targetPrice > product.sellingPrice ? maxDailyChange : -maxDailyChange);
    }
    
    // 5. 가격 업데이트
    await this.productRepo.update(productId, { sellingPrice: newPrice });
    
    // 6. 이력 저장
    await this.savePriceHistory({
      productId,
      oldPrice: product.sellingPrice,
      newPrice,
      changeReason: 'dynamic_pricing',
      competitorMinPrice: minCompetitorPrice
    });
    
    return newPrice;
  }
  
  async runDailyPriceAdjustment() {
    const activeProducts = await this.productRepo.find({ 
      where: { isActive: true } 
    });
    
    const results = [];
    for (const product of activeProducts) {
      const newPrice = await this.adjustPrice(product.id);
      results.push({ productId: product.id, newPrice });
    }
    
    return results;
  }
}
```

### 4.6 인프라 및 배포

#### AWS 아키텍처

```
┌─────────────────────────────────────────────────┐
│              Route 53 (DNS)                      │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────┐
│         CloudFront (CDN + WAF)                   │
└─────┬──────────────────────────────┬────────────┘
      │                              │
      │ (Static Assets)              │ (API)
      │                              │
┌─────┴──────┐              ┌────────┴─────────┐
│   S3       │              │  ALB             │
│  (Next.js) │              │  (Load Balancer) │
└────────────┘              └────────┬─────────┘
                                     │
                            ┌────────┴─────────┐
                            │  ECS Fargate     │
                            │  (Backend API)   │
                            │  Auto Scaling    │
                            └────────┬─────────┘
                                     │
          ┌──────────────────────────┼──────────────────┐
          │                          │                  │
┌─────────┴────────┐     ┌───────────┴──────┐  ┌───────┴──────┐
│  RDS (PostgreSQL)│     │ ElastiCache      │  │  EC2 (ML)    │
│  Multi-AZ        │     │  (Redis)         │  │  Spot Instance│
└──────────────────┘     └──────────────────┘  └──────────────┘
```

#### CI/CD 파이프라인 (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npm run test
      - run: npm run lint

  build-and-deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm run build
      - uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-northeast-2
      - run: aws s3 sync ./out s3://mark1-frontend
      - run: aws cloudfront create-invalidation --distribution-id ${{ secrets.CF_DIST_ID }} --paths "/*"

  build-and-deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: docker/build-push-action@v4
        with:
          context: ./backend
          push: true
          tags: ${{ secrets.ECR_REGISTRY }}/mark1-api:${{ github.sha }}
      - run: |
          aws ecs update-service \
            --cluster mark1-cluster \
            --service mark1-api \
            --force-new-deployment
```

### 4.7 모니터링 및 알림

#### Grafana 대시보드 주요 메트릭

```yaml
# 비즈니스 메트릭
- 실시간 주문 수 (시간당)
- 자동 처리율 (%)
- 평균 주문 처리 시간 (분)
- 일일 매출/수익

# 기술 메트릭
- API 응답 시간 (P50, P95, P99)
- 에러율 (%)
- CPU/메모리 사용률
- DB 커넥션 풀 사용률
- Redis Hit Rate

# AI/ML 메트릭
- 수요 예측 MAPE
- AI 카피 생성 시간
- 모델 추론 시간
```

#### 알림 규칙 (Prometheus Alertmanager)

```yaml
groups:
  - name: critical
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        annotations:
          summary: "에러율 5% 초과"
        labels:
          severity: critical
      
      - alert: OrderProcessingFailed
        expr: failed_orders_total > 10
        for: 1m
        annotations:
          summary: "주문 처리 실패 10건 초과"
        labels:
          severity: critical
      
      - alert: DatabaseDown
        expr: up{job="postgresql"} == 0
        for: 1m
        annotations:
          summary: "데이터베이스 연결 끊김"
        labels:
          severity: critical
```

### 4.8 비용 예측 (Phase 3 - 사용자 100명 기준)

| 항목 | 서비스 | 월 예상 비용 |
|------|--------|-------------|
| Compute | ECS Fargate (2 vCPU, 4GB × 2) | $60 |
| Database | RDS PostgreSQL (db.t3.medium Multi-AZ) | $120 |
| Cache | ElastiCache Redis (cache.t3.micro) | $15 |
| Storage | S3 (100GB) | $3 |
| CDN | CloudFront (1TB transfer) | $85 |
| ML Compute | EC2 Spot (g4dn.xlarge, 8h/day) | $50 |
| AI | OpenAI API (월 1,000건) | $50 |
| Monitoring | Grafana Cloud | $49 |
| Error Tracking | Sentry Business | $26 |
| Proxy | Bright Data | $200 |
| **합계** | | **약 $658 (85만원)** |

---

## 5. 보안 및 컴플라이언스

### 5.1 보안 체크리스트

- [x] SSL/TLS 암호화 (모든 통신)
- [x] API 키 환경 변수 관리 (AWS Secrets Manager)
- [x] JWT 기반 인증 (Access Token + Refresh Token)
- [x] Rate Limiting (사용자당 분당 100 요청)
- [x] SQL Injection 방지 (Parameterized Query)
- [x] XSS 방지 (입력 sanitization)
- [x] CORS 설정 (허용된 Origin만)
- [x] 고객 개인정보 AES-256 암호화
- [x] 접근 로그 기록 (CloudTrail)
- [x] 정기 보안 감사 (분기 1회)

### 5.2 GDPR/개인정보보호법 준수

```typescript
// 개인정보 최소 수집
interface CustomerData {
  name: string;          // 필수: 배송을 위해 필요
  phone: string;         // 필수: 배송 연락
  address: string;       // 필수: 배송지
  email?: string;        // 선택: 마케팅 동의 시
  birthdate?: string;    // 선택: 추천 알고리즘용
}

// 개인정보 암호화
import crypto from 'crypto';

function encryptPII(data: string): string {
  const cipher = crypto.createCipheriv(
    'aes-256-gcm',
    Buffer.from(process.env.ENCRYPTION_KEY),
    Buffer.from(process.env.IV)
  );
  return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
}

// 자동 삭제 (주문 완료 후 5년)
@Cron('0 0 * * *') // 매일 자동 실행
async function deleteExpiredData() {
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
  
  await db.orders.deleteMany({
    where: {
      deliveredAt: { lt: fiveYearsAgo },
      status: 'delivered'
    }
  });
}
```

---

## 6. 테스트 전략

### 6.1 테스트 피라미드

```
         ┌──────────────┐
         │  E2E Tests   │  (5%)
         │  Playwright  │
         └──────────────┘
      ┌─────────────────────┐
      │ Integration Tests   │  (15%)
      │  Supertest + Jest   │
      └─────────────────────┘
  ┌──────────────────────────────┐
  │     Unit Tests               │  (80%)
  │     Jest + Vitest            │
  └──────────────────────────────┘
```

### 6.2 주요 테스트 케이스

```typescript
// backend/tests/order.service.spec.ts
describe('OrderService', () => {
  describe('createOrder', () => {
    it('새 주문을 생성하고 DB에 저장한다', async () => {
      const orderData = {
        channelType: 'smartstore',
        channelOrderId: '2024010112345',
        productId: 'prod-123',
        quantity: 2
      };
      
      const result = await orderService.createOrder(orderData);
      
      expect(result.id).toBeDefined();
      expect(result.orderStatus).toBe('new');
    });
    
    it('중복 주문을 감지하고 에러를 발생시킨다', async () => {
      // 중복 주문 테스트
    });
  });
  
  describe('groupForFulfillment', () => {
    it('같은 도매처와 우편번호 접두사로 주문을 그룹핑한다', async () => {
      // 합배송 로직 테스트
    });
  });
});

// ML 모델 테스트
describe('DemandForecastModel', () => {
  it('MAPE가 20% 이하인 예측을 생성한다', async () => {
    const model = new DemandForecastModel();
    const testData = loadTestData('sales_history_test.csv');
    
    const predictions = model.predict(testData);
    const actualSales = loadActualSales();
    
    const mape = calculateMAPE(predictions, actualSales);
    expect(mape).toBeLessThan(20);
  });
});
```

---

## 7. 다음 단계

### 7.1 즉시 실행

1. **개발 환경 셋업**
   ```bash
   # 저장소 생성
   git init
   
   # Phase 1 디렉토리 구조
   mkdir -p {docs,makecom-scenarios,airtable-schemas}
   
   # Airtable 계정 생성
   # Make.com 계정 생성
   ```

2. **스마트스토어 API 테스트**
   - 개발자 센터 등록
   - OAuth 인증 플로우 테스트
   - 주문 목록 API 호출 성공

### 7.2 2주 내

3. **Airtable 스키마 구축**
4. **Make.com 주문 수집 워크플로우 구현**
5. **베타 사용자 1명 온보딩**

### 7.3 1개월 내

6. **Phase 1 MVP 완성**
7. **사용자 피드백 수집**
8. **Phase 2 기술 검증 (OpenAI API 테스트)**

---

**문서 종료**
