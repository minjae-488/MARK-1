# MARK 1 프로젝트 작업 목록 (TASKS)

**최종 업데이트:** 2026-02-05  
**관련 문서:** [PRD.md](./PRD.md), [TECH_SPEC.md](./TECH_SPEC.md)

---

## 📊 전체 진행 상황

| Phase | 상태 | 완료율 | 예상 기간 |
|-------|------|--------|----------|
| **Phase 0: 기획 및 설계** | ✅ 완료 | 100% | - |
| **Phase 1: MVP (No-code)** | 🔄 진행 중 | 0% | 4주 |
| **Phase 2: AI 통합** | ⬜ 대기 | 0% | 6주 |
| **Phase 3: 완전 자동화** | ⬜ 대기 | 0% | 8주 |

---

## Phase 0: 기획 및 설계 ✅

### ✅ 완료된 작업
- [x] PRD 작성
- [x] Tech Spec 작성
- [x] TDD 규칙 정의
- [x] SOLID 원칙 가이드 작성

---

## Phase 1: MVP 구축 (No-code) 🔄

**목표:** Airtable + Make.com 기반 주문 자동화 시스템 구축  
**예상 기간:** 4주  
**성공 지표:** 주문 자동 처리율 80%, 송장 등록 시간 70% 단축

### Week 1: 환경 설정 및 API 연동

#### 1.1 프로젝트 초기 설정
- [ ] **[TASK-001]** Git 저장소 초기화
  - [ ] GitHub 저장소 생성
  - [ ] `.gitignore` 설정
  - [ ] README.md 작성
  - [ ] 브랜치 전략 수립 (main, develop, feature/*)
  - **완료 조건:** 첫 커밋 완료, 브랜치 보호 설정

- [ ] **[TASK-002]** 디렉토리 구조 생성
  ```
  MARK-1/
  ├── .agent/
  │   ├── rules/
  │   └── workflows/
  ├── docs/
  │   ├── PRD.md ✅
  │   ├── TECH_SPEC.md ✅
  │   └── TASKS.md ✅
  ├── makecom-scenarios/
  │   ├── 01-order-collection.json
  │   ├── 02-fulfillment-grouping.json
  │   └── 03-auto-fulfillment.json
  ├── airtable-schemas/
  │   ├── orders.json
  │   ├── products.json
  │   ├── suppliers.json
  │   └── fulfillment_groups.json
  └── tests/
      └── e2e/
  ```
  - **완료 조건:** 모든 디렉토리 생성 확인

#### 1.2 외부 서비스 계정 설정
- [x] **[TASK-003]** Airtable 설정
  - [x] Airtable 계정 생성 (Pro 플랜)
  - [x] Base 생성: "MARK-1-Production"
  - [x] API 키 발급 및 환경 변수 저장
  - **완료 조건:** Airtable API 호출 성공 (임시 Placeholder 설정됨)

- [ ] **[TASK-004]** Make.com 설정
  - [ ] Make.com 계정 생성 (Pro 플랜)
  - [ ] Organization 생성
  - [ ] API 토큰 발급
  - **완료 조건:** Make.com API 호출 성공

- [ ] **[TASK-005]** 스마트스토어 API 연동
  - [ ] 네이버 개발자 센터 등록
  - [ ] 애플리케이션 생성
  - [ ] OAuth 인증 플로우 구현 (Make.com HTTP 모듈)
  - [ ] 주문 목록 조회 API 테스트
  - **완료 조건:** 실제 주문 데이터 수집 성공

- [ ] **[TASK-006]** 쿠팡 API 연동
  - [ ] 쿠팡 파트너스 가입
  - [ ] API 키 발급
  - [ ] 주문 조회 API 테스트
  - **완료 조건:** 주문 데이터 수집 성공

- [ ] **[TASK-007]** 11번가 API 연동
  - [ ] 11번가 오픈 API 신청
  - [ ] 인증 설정
  - [ ] 주문 조회 API 테스트
  - **완료 조건:** 주문 데이터 수집 성공

#### 1.3 Airtable 데이터베이스 구축
- [ ] **[TASK-008]** Orders 테이블 생성
  - [ ] 필드 정의 (TECH_SPEC.md 참조)
  - [ ] View 생성:
    - "신규 주문" (status = new)
    - "발주 대기" (status = pending_fulfillment)
    - "배송 중" (status = shipped)
  - [ ] Formula 필드 추가 (total_price 계산 등)
  - **완료 조건:** 테스트 레코드 10건 입력 및 조회

- [ ] **[TASK-009]** Products 테이블 생성
  - [ ] 필드 정의
  - [ ] margin_rate 자동 계산 필드 설정
  - [ ] Lookup 필드로 Supplier 정보 연결
  - **완료 조건:** 샘플 상품 20개 등록

- [ ] **[TASK-010]** Suppliers 테이블 생성
  - [ ] 도매처 정보 필드 정의
  - [ ] API 연동 정보 필드 추가
  - **완료 조건:** 주요 도매처 3곳 등록 (도매매, 이노션 등)

- [ ] **[TASK-011]** Fulfillment_Groups 테이블 생성
  - [ ] 합배송 그룹 필드 정의
  - [ ] Rollup 필드로 총 수량 자동 계산
  - [ ] Orders 테이블과 연결
  - **완료 조건:** 테스트 그룹 생성 및 주문 연결 확인

- [ ] **[TASK-012]** Airtable 스키마 문서화
  - [ ] 각 테이블별 JSON 스키마 export
  - [ ] `airtable-schemas/` 폴더에 저장
  - [ ] ERD 다이어그램 생성 (draw.io 또는 Mermaid)
  - **완료 조건:** 스키마 파일 4개 생성, ERD 이미지 저장

### Week 2: Make.com 워크플로우 구현

#### 2.1 Scenario 1: 주문 수집 자동화
- [ ] **[TASK-013]** 스마트스토어 주문 수집 워크플로우
  - [ ] 5분 간격 스케줄러 설정
  - [ ] HTTP Request 모듈: 스마트스토어 API 호출
  - [ ] Iterator로 주문 목록 순회
  - [ ] Airtable 중복 체크 로직
  - [ ] 신규 주문만 Airtable에 삽입
  - [ ] 에러 핸들링 (API 실패 시 Slack 알림)
  - **완료 조건:** 실제 주문 10건 자동 수집 성공

- [ ] **[TASK-014]** 쿠팡 주문 수집 워크플로우
  - [ ] 동일 로직 구현 (TASK-013 참조)
  - **완료 조건:** 쿠팡 주문 자동 수집 성공

- [ ] **[TASK-015]** 11번가 주문 수집 워크플로우
  - [ ] 동일 로직 구현
  - **완료 조건:** 11번가 주문 자동 수집 성공

- [ ] **[TASK-016]** 통합 모니터링 대시보드
  - [ ] Airtable Interface 생성
  - [ ] 일일 수집 건수 표시
  - [ ] 채널별 주문 현황 차트
  - **완료 조건:** 대시보드 접속 및 데이터 확인

#### 2.2 Scenario 2: 합배송 그룹핑
- [ ] **[TASK-017]** 합배송 로직 구현
  - [ ] Trigger: Orders 테이블 레코드 생성 시
  - [ ] 우편번호 앞 3자리 추출
  - [ ] Supplier + Postal_Prefix + Date로 그룹 검색
  - [ ] 그룹 존재 시 주문 추가, 없으면 새 그룹 생성
  - [ ] 배송비 절감 금액 계산 및 저장
  - **완료 조건:** 10건의 주문이 올바르게 그룹핑됨

- [ ] **[TASK-018]** 합배송 효과 분석
  - [ ] Airtable View: 합배송 그룹별 절감액
  - [ ] 주간 리포트 자동 생성 (이메일)
  - **완료 조건:** 첫 주간 리포트 수신

#### 2.3 Scenario 3: 자동 발주
- [ ] **[TASK-019]** 도매매 발주 워크플로우 (이메일 방식)
  - [ ] Trigger: Fulfillment_Groups.total_quantity >= 5
  - [ ] 주문 목록 취합
  - [ ] 발주용 엑셀 파일 생성
  - [ ] Gmail API로 도매처에 발주 이메일 발송
  - [ ] 그룹 상태를 'ordered'로 업데이트
  - **완료 조건:** 실제 도매처에 발주 이메일 발송 성공

- [ ] **[TASK-020]** 발주 실패 처리
  - [ ] API 에러 감지
  - [ ] Slack / 카카오톡 긴급 알림
  - [ ] 수동 처리 대기 상태로 변경
  - **완료 조건:** 에러 시나리오 테스트 통과

#### 2.4 Scenario 4: 송장 자동 등록
- [ ] **[TASK-021]** 도매처 송장 수신 워크플로우
  - [ ] Gmail API로 도매처 이메일 모니터링
  - [ ] 정규식으로 송장 번호 추출
  - [ ] Airtable Orders 테이블 업데이트
  - **완료 조건:** 송장 번호 자동 추출 및 저장

- [ ] **[TASK-022]** 채널별 송장 등록 워크플로우
  - [ ] 스마트스토어 API: 송장 번호 등록
  - [ ] 쿠팡 API: 송장 번호 등록
  - [ ] 11번가 API: 송장 번호 등록
  - [ ] 고객에게 카카오톡 알림톡 발송
  - **완료 조건:** 3개 채널 모두 송장 등록 성공

### Week 3: 테스트 및 최적화

#### 3.1 E2E 테스트
- [ ] **[TASK-023]** 전체 플로우 테스트
  - [ ] 시나리오: 주문 생성 → 그룹핑 → 발주 → 송장 등록
  - [ ] 테스트 데이터 100건 준비
  - [ ] 수동 개입 없이 자동 처리 확인
  - [ ] 처리 시간 측정
  - **완료 조건:** 100건 중 80건 이상 자동 처리 성공

- [ ] **[TASK-024]** 에러 복구 테스트
  - [ ] API 장애 시뮬레이션
  - [ ] 재시도 로직 검증
  - [ ] 알림 발송 확인
  - **완료 조건:** 3회 재시도 후 알림 발송 확인

#### 3.2 성능 최적화
- [ ] **[TASK-025]** Make.com 시나리오 최적화
  - [ ] 불필요한 API 호출 제거
  - [ ] 병렬 처리 가능한 부분 식별
  - [ ] Rate Limiting 대응
  - **완료 조건:** 평균 처리 시간 30% 단축

- [ ] **[TASK-026]** Airtable 성능 개선
  - [ ] 인덱스 최적화 (View 필터)
  - [ ] Lookup 필드 최소화
  - [ ] Formula 단순화
  - **완료 조건:** 쿼리 응답 시간 1초 이내

#### 3.3 문서화
- [ ] **[TASK-027]** 사용자 가이드 작성
  - [ ] 온보딩 체크리스트
  - [ ] API 연동 방법 (스크린샷 포함)
  - [ ] 트러블슈팅 가이드
  - **완료 조건:** `docs/USER_GUIDE.md` 생성

- [ ] **[TASK-028]** Make.com 시나리오 백업
  - [ ] 각 시나리오 JSON export
  - [ ] `makecom-scenarios/` 폴더에 저장
  - [ ] 버전 관리 (v1.0.0)
  - **완료 조건:** 4개 시나리오 파일 커밋

### Week 4: 베타 테스트 및 피드백

#### 4.1 베타 사용자 온보딩
- [ ] **[TASK-029]** 베타 사용자 모집
  - [ ] 셀러 커뮤니티에 공지
  - [ ] 신청 폼 생성 (Google Forms)
  - [ ] 10명 선발
  - **완료 조건:** 베타 사용자 10명 확정

- [ ] **[TASK-030]** 1:1 온보딩 세션
  - [ ] 각 사용자별 계정 설정 지원
  - [ ] API 연동 도움
  - [ ] 초기 데이터 임포트
  - **완료 조건:** 10명 모두 첫 자동 발주 완료

#### 4.2 피드백 수집
- [ ] **[TASK-031]** 주간 사용 데이터 수집
  - [ ] 주문 처리 건수
  - [ ] 자동화율
  - [ ] 에러 발생 빈도
  - **완료 조건:** 4주간 데이터 수집 완료

- [ ] **[TASK-032]** 사용자 인터뷰
  - [ ] 1:1 인터뷰 진행 (각 30분)
  - [ ] Pain Point 도출
  - [ ] 개선 요청 사항 정리
  - **완료 조건:** 인터뷰 요약 문서 작성

- [ ] **[TASK-033]** Phase 1 회고
  - [ ] KPI 달성 여부 평가
  - [ ] 성공 요인 / 실패 요인 분석
  - [ ] Phase 2 우선순위 조정
  - **완료 조건:** `docs/PHASE1_RETROSPECTIVE.md` 작성

---

## Phase 2: AI 기능 통합

**목표:** OpenAI API 기반 AI 카피라이팅 및 트렌드 분석 추가  
**예상 기간:** 6주  
**성공 지표:** AI 생성 카피 사용률 60%, 트렌드 추천 등록률 40%

### Week 5-6: 백엔드 API 개발 (TDD)

#### 5.1 프로젝트 초기 설정
- [ ] **[TASK-034]** Node.js 프로젝트 초기화
  - [ ] `npm init -y`
  - [ ] TypeScript 설정 (`tsconfig.json`)
  - [ ] ESLint, Prettier 설정
  - [ ] Jest 설정
  - **완료 조건:** `npm test` 실행 가능

- [ ] **[TASK-035]** 디렉토리 구조 생성
  ```
  backend/
  ├── src/
  │   ├── controllers/
  │   ├── services/
  │   ├── repositories/
  │   ├── models/
  │   ├── utils/
  │   └── app.ts
  ├── tests/
  │   ├── unit/
  │   ├── integration/
  │   └── fixtures/
  ├── package.json
  └── tsconfig.json
  ```
  - **완료 조건:** 모든 폴더 생성

- [ ] **[TASK-036]** Supabase 설정 (PostgreSQL)
  - [ ] Supabase 프로젝트 생성
  - [ ] 데이터베이스 URL 환경 변수 설정
  - [ ] Prisma 초기화 (`npx prisma init`)
  - **완료 조건:** DB 연결 테스트 성공

#### 5.2 AI 카피라이팅 API (TDD)
- [ ] **[TASK-037]** ⚠️ **[테스트 먼저]** CopyGenerationService 단위 테스트 작성
  - [ ] `tests/unit/services/copy-generation.service.spec.ts`
  - [ ] 테스트 케이스:
    - ✅ 상품명 생성 성공
    - ✅ 상세 설명 생성 성공
    - ✅ SEO 키워드 포함 확인
    - ✅ 길이 제한 준수 (제목 35자)
    - ❌ OpenAI API 에러 처리
  - **완료 조건:** 5개 테스트 작성 (모두 실패 상태)

- [ ] **[TASK-038]** CopyGenerationService 구현
  - [ ] OpenAI API 연동
  - [ ] Prompt Engineering
  - [ ] 응답 파싱 및 검증
  - [ ] 에러 핸들링
  - **완료 조건:** TASK-037의 모든 테스트 통과

- [ ] **[TASK-039]** ⚠️ **[테스트 먼저]** CopyController 통합 테스트
  - [ ] `POST /api/ai/generate-copy` 엔드포인트 테스트
  - [ ] 요청/응답 검증
  - [ ] 인증 테스트
  - **완료 조건:** 통합 테스트 통과

- [ ] **[TASK-040]** CopyController 구현
  - [ ] Express 라우터 설정
  - [ ] 요청 검증 (Zod)
  - [ ] 서비스 호출
  - [ ] 응답 포맷팅
  - **완료 조건:** API 호출 성공, Postman 테스트

- [ ] **[TASK-041]** CopyRepository 구현
  - [ ] Prisma 모델 정의 (ai_generated_copy)
  - [ ] CRUD 메서드 구현
  - [ ] 사용자 평가 저장 기능
  - **완료 조건:** DB에 카피 저장 성공

#### 5.3 트렌드 분석 API (TDD)
- [ ] **[TASK-042]** ⚠️ **[테스트 먼저]** TrendScraperService 단위 테스트
  - [ ] 네이버 데이터랩 크롤링 테스트
  - [ ] 기회 지수 계산 테스트
  - [ ] 경쟁 강도 분석 테스트
  - **완료 조건:** 테스트 작성 (실패 상태)

- [ ] **[TASK-043]** TrendScraperService 구현
  - [ ] Puppeteer로 네이버 데이터랩 크롤링
  - [ ] 검색량, 경쟁 상품 수 수집
  - [ ] 기회 지수 계산 로직 구현
  - **완료 조건:** 실제 트렌드 데이터 수집 성공

- [ ] **[TASK-044]** ⚠️ **[테스트 먼저]** ProductRecommendationService 테스트
  - [ ] 도매매 상품 검색 테스트
  - [ ] 추천 점수 계산 테스트
  - **완료 조건:** 테스트 작성

- [ ] **[TASK-045]** ProductRecommendationService 구현
  - [ ] 키워드 기반 도매매 상품 검색
  - [ ] 마진율, 가격대 필터링
  - [ ] 추천 점수 계산
  - **완료 조건:** 키워드별 상품 3개 이상 추천

- [ ] **[TASK-046]** 주간 트렌드 리포트 자동 생성
  - [ ] Cron Job 설정 (매주 월요일 오전 9시)
  - [ ] 상위 50개 키워드 선정
  - [ ] 이메일 템플릿 생성
  - [ ] SendGrid API 연동
  - **완료 조건:** 첫 주간 리포트 수신

#### 5.4 Airtable 연동
- [ ] **[TASK-047]** Airtable API 클라이언트 구현
  - [ ] Airtable SDK 설정
  - [ ] Orders, Products, Suppliers 테이블 연동
  - [ ] CRUD 메서드 구현
  - **완료 조건:** Airtable 데이터 읽기/쓰기 성공

- [ ] **[TASK-048]** 데이터 동기화 로직
  - [ ] PostgreSQL ↔ Airtable 양방향 동기화
  - [ ] 충돌 해결 전략 (Airtable이 Source of Truth)
  - **완료 조건:** 100건 데이터 동기화 성공

### Week 7-8: 프론트엔드 개발

#### 6.1 Next.js 프로젝트 설정
- [ ] **[TASK-049]** Next.js 14 프로젝트 초기화
  - [ ] `npx create-next-app@latest frontend --typescript`
  - [ ] Tailwind CSS 설정
  - [ ] shadcn/ui 설치
  - **완료 조건:** 개발 서버 실행 성공

- [ ] **[TASK-050]** 프로젝트 구조 생성
  ```
  frontend/
  ├── app/
  │   ├── (auth)/
  │   │   └── login/
  │   ├── dashboard/
  │   ├── orders/
  │   ├── products/
  │   └── trends/
  ├── components/
  │   ├── ui/
  │   └── features/
  ├── lib/
  │   ├── api.ts
  │   └── utils.ts
  └── package.json
  ```

#### 6.2 핵심 페이지 개발
- [ ] **[TASK-051]** 대시보드 페이지
  - [ ] KPI 카드 (일일 주문, 발주율, 매출)
  - [ ] 최근 주문 목록
  - [ ] 실시간 알림
  - **완료 조건:** 대시보드 렌더링 성공

- [ ] **[TASK-052]** AI 카피 생성 페이지
  - [ ] 상품 정보 입력 폼
  - [ ] "카피 생성" 버튼 클릭 시 API 호출
  - [ ] 생성된 카피 표시 및 복사 기능
  - [ ] 평가 기능 (1~5점)
  - **완료 조건:** 실제 카피 생성 및 저장

- [ ] **[TASK-053]** 트렌드 분석 페이지
  - [ ] 주간 트렌드 키워드 목록
  - [ ] 기회 지수, 검색량, 경쟁 강도 표시
  - [ ] 추천 상품 카드
  - [ ] 북마크 기능
  - **완료 조건:** 트렌드 데이터 표시

#### 6.3 UI 컴포넌트 개발
- [ ] **[TASK-054]** 공통 컴포넌트
  - [ ] Button, Input, Card (shadcn/ui 활용)
  - [ ] Modal, Toast
  - [ ] LoadingSpinner
  - **완료 조건:** Storybook 문서화

- [ ] **[TASK-055]** 비즈니스 컴포넌트
  - [ ] OrderCard
  - [ ] ProductCard
  - [ ] TrendKeywordCard
  - [ ] StatCard (KPI 표시)
  - **완료 조건:** 각 컴포넌트 3개 변형 구현

### Week 9-10: 통합 테스트 및 배포

#### 7.1 통합 및 E2E 테스트
- [ ] **[TASK-056]** Playwright E2E 테스트
  - [ ] 로그인 플로우
  - [ ] AI 카피 생성 플로우
  - [ ] 트렌드 조회 플로우
  - **완료 조건:** 3개 주요 플로우 테스트 통과

- [ ] **[TASK-057]** API 통합 테스트
  - [ ] OpenAI API 모킹
  - [ ] Airtable API 모킹
  - [ ] 전체 플로우 테스트
  - **완료 조건:** 통합 테스트 스위트 통과

#### 7.2 배포
- [ ] **[TASK-058]** Vercel 배포 (Frontend)
  - [ ] Vercel 프로젝트 생성
  - [ ] 환경 변수 설정
  - [ ] 자동 배포 설정 (main 브랜치)
  - **완료 조건:** 프로덕션 URL 접속 가능

- [ ] **[TASK-059]** Vercel Serverless 배포 (Backend)
  - [ ] API 라우트 설정
  - [ ] Cold Start 최적화
  - **완료 조건:** API 엔드포인트 응답 성공

- [ ] **[TASK-060]** Supabase 프로덕션 DB 설정
  - [ ] Backups 설정
  - [ ] Connection Pooling 설정
  - **완료 조건:** 프로덕션 DB 연결 성공

#### 7.3 모니터링
- [ ] **[TASK-061]** Sentry 설정
  - [ ] Sentry 프로젝트 생성
  - [ ] Frontend / Backend 통합
  - [ ] 에러 알림 설정 (Slack)
  - **완료 조건:** 테스트 에러 Sentry에서 확인

- [ ] **[TASK-062]** 성능 모니터링
  - [ ] Vercel Analytics 활성화
  - [ ] API 응답 시간 측정
  - **완료 조건:** 대시보드 확인

---

## Phase 3: 완전 자동화 시스템

**목표:** ML 기반 수요 예측 및 다이내믹 프라이싱 구현  
**예상 기간:** 8주  
**성공 지표:** 수요 예측 MAPE 20% 이하, 품절율 5% 이하

### Week 11-12: 인프라 구축

#### 8.1 AWS 계정 및 기본 설정
- [ ] **[TASK-063]** AWS 계정 설정
  - [ ] 루트 계정 MFA 설정
  - [ ] IAM 사용자 생성 (Admin, Developer)
  - [ ] Billing 알림 설정
  - **완료 조건:** IAM 사용자로 로그인 성공

- [ ] **[TASK-064]** VPC 네트워크 구성
  - [ ] VPC 생성 (10.0.0.0/16)
  - [ ] Public / Private Subnet 생성
  - [ ] NAT Gateway, Internet Gateway 설정
  - **완료 조건:** Terraform 코드 작성 및 적용

#### 8.2 데이터베이스 마이그레이션
- [ ] **[TASK-065]** RDS PostgreSQL 설정
  - [ ] Multi-AZ 인스턴스 생성 (db.t3.medium)
  - [ ] Read Replica 설정
  - [ ] 자동 백업 설정 (매일 새벽 4시)
  - **완료 조건:** RDS 엔드포인트 연결 성공

- [ ] **[TASK-066]** TimescaleDB 확장 설치
  - [ ] PostgreSQL에 TimescaleDB 설치
  - [ ] sales_history, price_history 테이블 Hypertable 변환
  - **완료 조건:** 시계열 데이터 삽입 및 조회 성공

- [ ] **[TASK-067]** ElastiCache Redis 설정
  - [ ] Redis 클러스터 생성 (cache.t3.micro)
  - [ ] 가격 데이터 캐싱 로직 구현
  - **완료 조건:** Redis GET/SET 테스트 성공

- [ ] **[TASK-068]** Supabase → AWS RDS 데이터 마이그레이션
  - [ ] 마이그레이션 스크립트 작성
  - [ ] 데이터 검증
  - [ ] 롤백 계획 수립
  - **완료 조건:** 모든 데이터 마이그레이션 확인

#### 8.3 백엔드 리팩토링 (NestJS)
- [ ] **[TASK-069]** NestJS 프로젝트 초기화
  - [ ] Express → NestJS 마이그레이션
  - [ ] 모듈 구조 설계
  - [ ] DI Container 설정
  - **완료 조건:** 기존 API 모두 정상 동작

- [ ] **[TASK-070]** Prisma 스키마 최종화
  - [ ] TECH_SPEC의 모든 테이블 정의
  - [ ] Migration 파일 생성
  - [ ] Seed 데이터 작성
  - **완료 조건:** `npx prisma migrate deploy` 성공

### Week 13-14: ML 파이프라인 구축 (TDD)

#### 9.1 데이터 수집 파이프라인
- [ ] **[TASK-071]** 판매 이력 데이터 수집
  - [ ] 채널별 과거 주문 데이터 import
  - [ ] sales_history 테이블에 적재
  - [ ] 최소 3개월 데이터 확보
  - **완료 조건:** 10,000건 이상 데이터 저장

- [ ] **[TASK-072]** Feature Engineering
  - [ ] 시계열 특성 생성 (lag_7d, lag_14d, lag_30d)
  - [ ] 요일/월/분기 더미 변수
  - [ ] 트렌드 검색량 rolling average
  - **완료 조건:** Feature 테이블 생성

#### 9.2 수요 예측 모델 (Python)
- [ ] **[TASK-073]** ⚠️ **[테스트 먼저]** 수요 예측 모델 테스트 작성
  - [ ] `tests/ml/test_demand_forecast.py`
  - [ ] MAPE < 20% 테스트
  - [ ] 예측값 유효성 테스트
  - **완료 조건:** 테스트 작성 (실패 상태)

- [ ] **[TASK-074]** LSTM 모델 구현
  - [ ] TensorFlow/Keras로 LSTM 모델 정의
  - [ ] 학습 파이프라인 구현
  - [ ] 모델 저장 (S3)
  - **완료 조건:** TASK-073 테스트 통과

- [ ] **[TASK-075]** 모델 학습 스케줄러
  - [ ] Airflow DAG 작성 (주 1회 재학습)
  - [ ] 성능 모니터링
  - [ ] A/B 테스트 구조
  - **완료 조건:** 첫 자동 재학습 성공

- [ ] **[TASK-076]** FastAPI 예측 API
  - [ ] `POST /api/ml/forecast` 엔드포인트
  - [ ] S3에서 모델 로드
  - [ ] 예측 결과 반환
  - **완료 조건:** API 호출 성공, 응답 시간 < 3초

#### 9.3 다이내믹 프라이싱 (TDD)
- [ ] **[TASK-077]** ⚠️ **[테스트 먼저]** PricingService 테스트
  - [ ] 최저가 대응 로직 테스트
  - [ ] 최소 마진 보장 테스트
  - [ ] 가격 변동 제한 테스트
  - **완료 조건:** 15개 이상 테스트 작성

- [ ] **[TASK-078]** DynamicPricingService 구현
  - [ ] TECH_SPEC의 가격 결정 로직 구현
  - [ ] Redis 캐시 활용
  - [ ] 가격 이력 저장
  - **완료 조건:** TASK-077 테스트 통과

- [ ] **[TASK-079]** 경쟁사 가격 크롤링
  - [ ] Bright Data Proxy 설정
  - [ ] 스마트스토어 최저가 크롤링
  - [ ] 가격 데이터 저장
  - **완료 조건:** 일일 1,000개 상품 가격 수집

- [ ] **[TASK-080]** 일일 가격 조정 Cron Job
  - [ ] 매일 오전 9시, 낮 12시, 저녁 6시 실행
  - [ ] 모든 활성 상품 가격 재계산
  - [ ] 채널 API로 가격 업데이트
  - **완료 조건:** 첫 자동 가격 조정 성공

### Week 15-16: 개인화 추천 엔진

#### 10.1 고객 행동 분석
- [ ] **[TASK-081]** 고객 구매 이력 데이터 모델링
  - [ ] customers, customer_purchases 테이블 생성
  - [ ] 구매 패턴 분석 쿼리 작성
  - **완료 조건:** 고객별 구매 이력 조회 성공

- [ ] **[TASK-082]** Collaborative Filtering 모델
  - [ ] Surprise 라이브러리로 추천 모델 학습
  - [ ] 연관 상품 추천 API
  - **완료 조건:** 고객 ID 입력 시 상품 5개 추천

#### 10.2 자동 프로모션
- [ ] **[TASK-083]** 고객 세그먼트 정의
  - [ ] VIP (월 20만원 이상)
  - [ ] 휴면 (90일 미구매)
  - [ ] 신규 (첫 구매)
  - **완료 조건:** 세그먼트별 고객 수 집계

- [ ] **[TASK-084]** 쿠폰 발행 자동화
  - [ ] 세그먼트별 쿠폰 정책 정의
  - [ ] 카카오톡 알림톡 템플릿
  - [ ] 자동 발송 스케줄러
  - **완료 조건:** 첫 자동 쿠폰 발송

### Week 17-18: ECS 배포 및 최적화

#### 11.1 컨테이너화
- [ ] **[TASK-085]** Docker 이미지 빌드
  - [ ] Backend Dockerfile 작성
  - [ ] ML Service Dockerfile 작성
  - [ ] Docker Compose로 로컬 테스트
  - **완료 조건:** 로컬에서 컨테이너 실행 성공

- [ ] **[TASK-086]** ECR 설정
  - [ ] ECR 저장소 생성 (mark1-api, mark1-ml)
  - [ ] 이미지 푸시 자동화 (GitHub Actions)
  - **완료 조건:** ECR에 이미지 푸시 성공

#### 11.2 ECS 클러스터 구축
- [ ] **[TASK-087]** ECS Cluster 생성
  - [ ] Fargate 클러스터 설정
  - [ ] Task Definition 작성
  - [ ] Service 생성 (Auto Scaling)
  - **완료 조건:** ECS 서비스 실행 중

- [ ] **[TASK-088]** ALB 설정
  - [ ] Application Load Balancer 생성
  - [ ] Health Check 설정
  - [ ] HTTPS 설정 (ACM 인증서)
  - **완료 조건:** HTTPS로 API 접속 성공

- [ ] **[TASK-089]** CloudFront 설정
  - [ ] S3 + CloudFront (Frontend)
  - [ ] 캐싱 정책 설정
  - [ ] WAF 룰 적용
  - **완료 조건:** CDN을 통한 페이지 로드

#### 11.3 CI/CD 파이프라인
- [ ] **[TASK-090]** GitHub Actions 워크플로우
  - [ ] Test → Build → Deploy 파이프라인
  - [ ] 커버리지 체크 (80% 이상)
  - [ ] 자동 배포 (main 브랜치)
  - **완료 조건:** PR 머지 시 자동 배포 성공

- [ ] **[TASK-091]** 롤백 전략
  - [ ] Blue-Green 배포 설정
  - [ ] 배포 실패 시 자동 롤백
  - **완료 조건:** 롤백 테스트 성공

#### 11.4 모니터링 및 알림
- [ ] **[TASK-092]** Prometheus + Grafana 설정
  - [ ] Prometheus 서버 구축 (EC2)
  - [ ] Grafana 대시보드 구성
  - [ ] 비즈니스/기술 메트릭 수집
  - **완료 조건:** 대시보드에서 실시간 메트릭 확인

- [ ] **[TASK-093]** Alertmanager 설정
  - [ ] 에러율 5% 초과 시 알림
  - [ ] DB 다운 시 즉시 알림
  - [ ] Slack 통합
  - **완료 조건:** 테스트 알림 수신

- [ ] **[TASK-094]** CloudWatch 로그 수집
  - [ ] ECS 로그 CloudWatch로 전송
  - [ ] 로그 기반 알람 설정
  - **완료 조건:** 로그 검색 및 필터링 성공

---

## Phase 4: 확장 및 고도화 (6개월+)

### 12.1 추가 기능
- [ ] **[TASK-095]** 모바일 앱 개발 (React Native)
- [ ] **[TASK-096]** AliExpress, 아마존 글로벌 채널 추가
- [ ] **[TASK-097]** 물류사 연동 (CJ대한통운, 로젠)
- [ ] **[TASK-098]** Multi-tenant SaaS 전환
- [ ] **[TASK-099]** 결제 시스템 구축 (구독 관리)

### 12.2 비즈니스
- [ ] **[TASK-100]** 정식 출시 (Product Hunt, 벤처 캐피탈)
- [ ] **[TASK-101]** 마케팅 캠페인 (유튜브, 블로그)
- [ ] **[TASK-102]** 파트너십 체결 (물류사, PG사)

---

## 📋 작업 관리 규칙

### 우선순위
- **P0 (Critical):** 시스템 핵심 기능, 없으면 동작 불가
- **P1 (High):** 주요 기능, MVP 포함
- **P2 (Medium):** 개선 사항
- **P3 (Low):** Nice-to-have

### 상태
- **⬜ Todo:** 시작 전
- **🔄 In Progress:** 진행 중
- **✅ Done:** 완료
- **🚫 Blocked:** 차단됨 (의존성 대기)
- **⏸️ On Hold:** 보류

### 완료 조건 (Definition of Done)
모든 작업은 다음 조건을 만족해야 완료로 간주:
1. ✅ 코드 작성 완료
2. ✅ **TDD:** 테스트 작성 및 통과 (UI 제외)
3. ✅ **SOLID:** 코드 리뷰 통과
4. ✅ 문서화 (필요 시)
5. ✅ PR 승인 및 main 브랜치 머지

---

## 🔗 관련 문서
- [PRD.md](./PRD.md) - 제품 요구사항 정의
- [TECH_SPEC.md](./TECH_SPEC.md) - 기술 사양서
- [.agent/rules/tdd.md](../.agent/rules/tdd.md) - TDD 규칙
- [.agent/rules/solid.md](../.agent/rules/solid.md) - SOLID 원칙

---

**마지막 업데이트:** 2026-02-05
