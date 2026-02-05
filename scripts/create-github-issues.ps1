# MARK-1 프로젝트 GitHub 이슈 생성 스크립트

Write-Host "Phase 1 작업들을 GitHub 이슈로 등록합니다..." -ForegroundColor Green

# TASK-001: Git 저장소 초기화
gh issue create `
  --title "[TASK-001] Git 저장소 초기화" `
  --label "Phase 1,P0,infrastructure" `
  --body @"
## 📋 작업 배경
프로젝트의 버전 관리를 위해 Git 저장소를 초기화하고 GitHub와 연동합니다.

## 🎯 작업 내용

### 상세 작업 항목
- [ ] GitHub 저장소 생성 (이미 완료)
- [ ] .gitignore 설정 (Node.js, Python, 환경 변수 등)
- [ ] README.md 작성 (프로젝트 소개, 설치 방법)
- [ ] 브랜치 전략 수립 (main, develop, feature/*)
- [ ] 브랜치 보호 규칙 설정

## ✅ 인수 조건

- [ ] .gitignore 파일 생성 및 커밋
- [ ] README.md 작성 완료
- [ ] 첫 커밋 완료
- [ ] main 브랜치 보호 설정 (리뷰 1명 이상 필요)
- [ ] GitHub Actions CI 기본 설정

## 🔗 관련 링크
- PRD: [PRD.md](https://github.com/minjae-488/MARK-1/blob/main/PRD.md)
- Tech Spec: [TECH_SPEC.md](https://github.com/minjae-488/MARK-1/blob/main/TECH_SPEC.md)
- Tasks: [TASKS.md](https://github.com/minjae-488/MARK-1/blob/main/TASKS.md#task-001)

## 📅 예상 소요 시간
0.5일
"@

Write-Host "[TASK-001] 이슈 생성 완료" -ForegroundColor Cyan

# TASK-002: 디렉토리 구조 생성
gh issue create `
  --title "[TASK-002] 디렉토리 구조 생성" `
  --label "Phase 1,P0,infrastructure" `
  --body @"
## 📋 작업 배경
프로젝트 전체의 디렉토리 구조를 미리 정의하여 일관된 파일 구조를 유지합니다.

## 🎯 작업 내용

### 상세 작업 항목
- [ ] docs/ 폴더 및 하위 구조 생성
- [ ] makecom-scenarios/ 폴더 생성
- [ ] airtable-schemas/ 폴더 생성
- [ ] tests/e2e/ 폴더 생성
- [ ] .agent/ 폴더 확인 (이미 존재)

## ✅ 인수 조건

- [ ] TECH_SPEC.md에 정의된 모든 디렉토리 생성 확인
- [ ] 각 폴더에 README.md 추가 (용도 설명)
- [ ] 디렉토리 구조 문서화

## 🔗 관련 링크
- Tech Spec: [TECH_SPEC.md - 디렉토리 구조](https://github.com/minjae-488/MARK-1/blob/main/TECH_SPEC.md#task-002)
- Tasks: [TASKS.md#task-002](https://github.com/minjae-488/MARK-1/blob/main/TASKS.md#task-002)

## 📅 예상 소요 시간
0.5일
"@

Write-Host "[TASK-002] 이슈 생성 완료" -ForegroundColor Cyan

# TASK-003: Airtable 설정
gh issue create `
  --title "[TASK-003] Airtable 설정" `
  --label "Phase 1,P0,external-api" `
  --body @"
## 📋 작업 배경
No-code MVP를 위해 Airtable을 데이터베이스로 사용합니다.

## 🎯 작업 내용

### 상세 작업 항목
- [ ] Airtable 계정 생성 (Pro 플랜)
- [ ] Base 생성: "MARK-1-Production"
- [ ] API 키 발급
- [ ] 환경 변수 파일 생성 (.env.example)
- [ ] API 연결 테스트 스크립트 작성

## ✅ 인수 조건

- [ ] Airtable Base 생성 완료
- [ ] API 키 안전하게 저장 (.env 파일, GitHub Secrets)
- [ ] Airtable API 호출 성공 (GET /bases 테스트)
- [ ] .env.example 파일 커밋

## 🔗 관련 링크
- Tech Spec: [Airtable 설정](https://github.com/minjae-488/MARK-1/blob/main/TECH_SPEC.md#21-데이터베이스-설계-airtable)
- Airtable API Docs: https://airtable.com/developers/web/api/introduction

## 📅 예상 소요 시간
1일
"@

Write-Host "[TASK-003] 이슈 생성 완료" -ForegroundColor Cyan

# TASK-004: Make.com 설정
gh issue create `
  --title "[TASK-004] Make.com 설정" `
  --label "Phase 1,P0,automation" `
  --body @"
## 📋 작업 배경
주문 수집 및 발주 자동화를 위해 Make.com을 사용합니다.

## 🎯 작업 내용

### 상세 작업 항목
- [ ] Make.com 계정 생성 (Pro 플랜)
- [ ] Organization 생성
- [ ] API 토큰 발급
- [ ] 테스트 시나리오 생성 (Hello World)

## ✅ 인수 조건

- [ ] Make.com 계정 설정 완료
- [ ] API 토큰 GitHub Secrets에 저장
- [ ] 테스트 시나리오 실행 성공
- [ ] Make.com API 호출 테스트 성공

## 🔗 관련 링크
- Tech Spec: [Make.com 워크플로우](https://github.com/minjae-488/MARK-1/blob/main/TECH_SPEC.md#23-makecom-워크플로우-설계)
- Make.com Docs: https://www.make.com/en/help/tutorials

## 📅 예상 소요 시간
1일
"@

Write-Host "[TASK-004] 이슈 생성 완료" -ForegroundColor Cyan

# TASK-005: 스마트스토어 API 연동
gh issue create `
  --title "[TASK-005] 스마트스토어 API 연동" `
  --label "Phase 1,P0,external-api,TDD" `
  --body @"
## 📋 작업 배경
스마트스토어에서 주문 데이터를 자동으로 수집하기 위해 API를 연동합니다.

## 🎯 작업 내용

### 상세 작업 항목
- [ ] 네이버 개발자 센터 등록
- [ ] 애플리케이션 생성 (스마트스토어 전용 앱)
- [ ] OAuth 2.0 인증 플로우 구현
- [ ] 주문 목록 조회 API 테스트
- [ ] Rate Limiting 처리 로직 구현
- [ ] **TDD**: API 연동 유틸리티 함수 테스트 작성

## ✅ 인수 조건

- [ ] OAuth 인증 성공
- [ ] 실제 주문 데이터 최소 10건 수집 성공
- [ ] Rate Limiting 에러 처리 테스트 통과
- [ ] API 응답 파싱 로직 테스트 통과 (TDD)
- [ ] 에러 핸들링 테스트 통과

## 🔗 관련 링크
- Tech Spec: [스마트스토어 API](https://github.com/minjae-488/MARK-1/blob/main/TECH_SPEC.md#스마트스토어-api)
- 스마트스토어 API Docs: https://partner.talk.naver.com/

## 📅 예상 소요 시간
2일
"@

Write-Host "[TASK-005] 이슈 생성 완료" -ForegroundColor Cyan

# TASK-008: Orders 테이블 생성
gh issue create `
  --title "[TASK-008] Airtable Orders 테이블 생성" `
  --label "Phase 1,P0,database" `
  --body @"
## 📋 작업 배경
주문 데이터를 저장하기 위한 Airtable Orders 테이블을 생성합니다.

## 🎯 작업 내용

### 상세 작업 항목
- [ ] TECH_SPEC.md의 필드 정의에 따라 테이블 생성
- [ ] View 생성: "신규 주문" (status = new)
- [ ] View 생성: "발주 대기" (status = pending_fulfillment)
- [ ] View 생성: "배송 중" (status = shipped)
- [ ] Formula 필드 추가 (total_price 자동 계산)
- [ ] 테스트 데이터 10건 입력

## ✅ 인수 조건

- [ ] 모든 필드 타입 올바르게 설정
- [ ] 3개 View 모두 정상 동작
- [ ] Formula 필드 계산 검증
- [ ] 테스트 레코드 10건 조회 성공
- [ ] 스키마 JSON 파일 export

## 🔗 관련 링크
- Tech Spec: [Orders 테이블 스키마](https://github.com/minjae-488/MARK-1/blob/main/TECH_SPEC.md#table-1-orders-주문)
- Airtable Field Types: https://airtable.com/developers/web/api/field-model

## 📅 예상 소요 시간
1일
"@

Write-Host "[TASK-008] 이슈 생성 완료" -ForegroundColor Cyan

# TASK-037: AI 카피라이팅 서비스 (TDD)
gh issue create `
  --title "[TASK-037] ⚠️ [TDD] CopyGenerationService 단위 테스트 작성" `
  --label "Phase 2,P1,TDD,AI" `
  --body @"
## 📋 작업 배경
AI 기반 상품 카피라이팅 기능을 TDD로 개발합니다. **테스트를 먼저 작성**합니다.

## 🎯 작업 내용

### 상세 작업 항목 (⚠️ 테스트 먼저!)
- [ ] 테스트 파일 생성: tests/unit/services/copy-generation.service.spec.ts
- [ ] ✅ 테스트 1: 상품명 생성 성공 (35자 이내)
- [ ] ✅ 테스트 2: 상세 설명 생성 성공 (300-500자)
- [ ] ✅ 테스트 3: SEO 키워드 포함 확인
- [ ] ✅ 테스트 4: 길이 제한 준수 검증
- [ ] ❌ 테스트 5: OpenAI API 에러 처리
- [ ] 모든 테스트 실패 상태 확인 (Red)

## ✅ 인수 조건

- [ ] **5개 이상의 테스트 케이스 작성**
- [ ] **모든 테스트가 실패 상태** (아직 구현 전)
- [ ] 테스트 커버리지 계획 수립
- [ ] TASK-038 (구현) 시작 가능 상태
- [ ] 코드 리뷰 완료 (테스트 품질 검토)

## 🔗 관련 링크
- Tech Spec: [AI 카피라이팅 API](https://github.com/minjae-488/MARK-1/blob/main/TECH_SPEC.md#api-1-ai-카피라이팅-생성)
- TDD 규칙: [.agent/rules/tdd.md](https://github.com/minjae-488/MARK-1/blob/main/.agent/rules/tdd.md)
- TASK-038: CopyGenerationService 구현 (다음 단계)

## 📅 예상 소요 시간
1일
"@

Write-Host "[TASK-037] 이슈 생성 완료" -ForegroundColor Cyan

# TASK-073: 수요 예측 모델 테스트 (TDD)
gh issue create `
  --title "[TASK-073] ⚠️ [TDD] 수요 예측 모델 테스트 작성" `
  --label "Phase 3,P1,TDD,ML" `
  --body @"
## 📋 작업 배경
ML 기반 수요 예측 모델을 TDD로 개발합니다. **테스트를 먼저 작성**합니다.

## 🎯 작업 내용

### 상세 작업 항목 (⚠️ 테스트 먼저!)
- [ ] 테스트 파일 생성: tests/ml/test_demand_forecast.py
- [ ] ✅ 테스트 1: MAPE < 20% 검증
- [ ] ✅ 테스트 2: 예측값 유효성 검증 (음수 불가, 범위 확인)
- [ ] ✅ 테스트 3: 입력 데이터 형식 검증
- [ ] ❌ 테스트 4: 데이터 부족 시 에러 처리
- [ ] ✅ 테스트 5: 모델 재현성 검증 (같은 입력 = 같은 출력)
- [ ] 모든 테스트 실패 상태 확인 (Red)

## ✅ 인수 조건

- [ ] **5개 이상의 테스트 케이스 작성**
- [ ] **모든 테스트가 실패 상태** (아직 구현 전)
- [ ] Pytest 설정 완료
- [ ] 테스트 데이터셋 준비 (fixtures/)
- [ ] TASK-074 (LSTM 모델 구현) 시작 가능 상태

## 🔗 관련 링크
- Tech Spec: [수요 예측 ML 파이프라인](https://github.com/minjae-488/MARK-1/blob/main/TECH_SPEC.md#44-수요-예측-ml-파이프라인)
- TDD 규칙: [.agent/rules/tdd.md](https://github.com/minjae-488/MARK-1/blob/main/.agent/rules/tdd.md#6-ml-모델-테스트)
- TASK-074: LSTM 모델 구현 (다음 단계)

## 📅 예상 소요 시간
2일
"@

Write-Host "[TASK-073] 이슈 생성 완료" -ForegroundColor Cyan

Write-Host "`n✅ Phase 1, 2, 3의 주요 작업 이슈 생성 완료!" -ForegroundColor Green
Write-Host "GitHub에서 이슈를 확인하세요: https://github.com/minjae-488/MARK-1/issues" -ForegroundColor Yellow
