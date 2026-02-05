# GitHub 이슈 생성 가이드

## 📋 현재 상태

- ✅ Git 저장소 초기화 완료
- ✅ GitHub 라벨 생성 완료
- ⏳ 이슈 생성 대기

## 🎯 이슈 생성 방법

### Option 1: GitHub 웹 UI 사용 (권장)

1. https://github.com/minjae-488/MARK-1/issues 접속
2. "New issue" 클릭
3. 아래 템플릿을 사용하여 이슈 생성

### Option 2: GitHub CLI 사용

현재 라벨 문제로 CLI 사용이 어렵습니다. 라벨 확인 후 재시도:

```bash
# 라벨 목록 확인
gh label list

# 이슈 생성 (라벨명 확인 후)
gh issue create --title "[TASK-001] Git 저장소 초기화" \
  --label "Phase 1" \
  --body-file ".github/issues/TASK-001.md"
```

## 📝 생성할 주요 이슈 목록

### Phase 1 - MVP (Week 1-4)

#### Week 1: 환경 설정
1. **[TASK-001] Git 저장소 초기화** 
   - 라벨: `Phase 1`, `P0`, `infrastructure`
   - 파일: `.github/issues/TASK-001.md`
   - 예상 시간: 0.5일

2. **[TASK-002] 디렉토리 구조 생성**
   - 라벨: `Phase 1`, `P0`, `infrastructure`
   - 예상 시간: 0.5일

3. **[TASK-003] Airtable 설정**
   - 라벨: `Phase 1`, `P0`, `external-api`
   - 예상 시간: 1일

4. **[TASK-004] Make.com 설정**
   - 라벨: `Phase 1`, `P0`, `automation`
   - 예상 시간: 1일

5. **[TASK-005] 스마트스토어 API 연동**
   - 라벨: `Phase 1`, `P0`, `external-api`, `TDD`
   - 예상 시간: 2일
   - ⚠️ TDD 적용 필요

6. **[TASK-006] 쿠팡 API 연동**
   - 라벨: `Phase 1`, `P0`, `external-api`, `TDD`
   - 예상 시간: 1.5일

7. **[TASK-007] 11번가 API 연동**
   - 라벨: `Phase 1`, `P0`, `external-api`, `TDD`
   - 예상 시간: 1.5일

8. **[TASK-008] Airtable Orders 테이블 생성**
   - 라벨: `Phase 1`, `P0`, `database`
   - 예상 시간: 1일

9. **[TASK-009] Airtable Products 테이블 생성**
   - 라벨: `Phase 1`, `P0`, `database`
   - 예상 시간: 0.5일

10. **[TASK-010] Airtable Suppliers 테이블 생성**
    - 라벨: `Phase 1`, `P0`, `database`
    - 예상 시간: 0.5일

### Phase 2 - AI 통합 (Week 5-10)

#### AI 카피라이팅 (TDD 필수)
11. **[TASK-037] ⚠️ [TDD] CopyGenerationService 단위 테스트 작성**
    - 라벨: `Phase 2`, `P1`, `TDD`, `AI`, `backend`
    - 예상 시간: 1일
    - ⚠️ **테스트 먼저 작성!**

12. **[TASK-038] CopyGenerationService 구현**
    - 라벨: `Phase 2`, `P1`, `AI`, `backend`
    - 의존성: TASK-037 완료 후
    - 예상 시간: 1.5일

13. **[TASK-039] ⚠️ [TDD] CopyController 통합 테스트**
    - 라벨: `Phase 2`, `P1`, `TDD`, `AI`, `backend`
    - 예상 시간: 1일

14. **[TASK-040] CopyController 구현**
    - 라벨: `Phase 2`, `P1`, `AI`, `backend`
    - 의존성: TASK-039 완료 후
    - 예상 시간: 1일

#### 트렌드 분석 (TDD 필수)
15. **[TASK-042] ⚠️ [TDD] TrendScraperService 단위 테스트**
    - 라벨: `Phase 2`, `P1`, `TDD`, `backend`
    - 예상 시간: 1.5일
    - ⚠️ **테스트 먼저 작성!**

16. **[TASK-043] TrendScraperService 구현**
    - 라벨: `Phase 2`, `P1`, `backend`
    - 의존성: TASK-042 완료 후
    - 예상 시간: 2일

### Phase 3 - ML 자동화 (Week 11-18)

#### 수요 예측 (TDD 필수)
17. **[TASK-073] ⚠️ [TDD] 수요 예측 모델 테스트 작성**
    - 라벨: `Phase 3`, `P1`, `TDD`, `ML`
    - 예상 시간: 2일
    - ⚠️ **테스트 먼저 작성!**

18. **[TASK-074] LSTM 모델 구현**
    - 라벨: `Phase 3`, `P1`, `ML`
    - 의존성: TASK-073 완료 후
    - 예상 시간: 5일

#### 다이내믹 프라이싱 (TDD 필수)
19. **[TASK-077] ⚠️ [TDD] PricingService 테스트 작성**
    - 라벨: `Phase 3`, `P1`, `TDD`, `backend`
    - 예상 시간: 1.5일
    - ⚠️ **테스트 먼저 작성!**

20. **[TASK-078] DynamicPricingService 구현**
    - 라벨: `Phase 3`, `P1`, `backend`
    - 의존성: TASK-077 완료 후
    - 예상 시간: 2일

## 📌 이슈 템플릿 구조

모든 이슈는 다음 구조를 따릅니다:

```markdown
## 📋 작업 배경
<!-- 왜 이 작업이 필요한가? -->

## 🎯 작업 내용
### 상세 작업 항목
- [ ] 항목 1
- [ ] 항목 2

## ✅ 인수 조건
- [ ] 코드 작성 완료
- [ ] 테스트 통과 (TDD - 코어 로직만)
- [ ] 코드 리뷰 통과
- [ ] 문서화 완료
- [ ] PR 승인 및 머지

## 🔗 관련 링크
- Tasks: [TASKS.md](링크)
- Tech Spec: [TECH_SPEC.md](링크)

## 📅 예상 소요 시간
X일

## 🏷️ 라벨
`Phase X` `P0/P1/P2` `TDD` 등
```

## ✅ 다음 단계

1. GitHub 웹에서 이슈 생성 시작
2. TASK-001부터 순차적으로 생성
3. 생성된 이슈는 Project Board에 추가
4. Milestone 설정 (Phase 1, Phase 2, Phase 3)

## 📊 자동화 가능 여부

현재 `gh` CLI 명령어가 라벨 인식에 문제가 있어 수동 생성을 권장합니다.
라벨 문제 해결 후 스크립트 재실행 가능합니다.
