# GitHub Pages 배포 가이드

## 📋 GitHub Pages 설정

### 1. GitHub 저장소 설정

1. **GitHub 웹사이트** 접속
   - https://github.com/minjae-488/MARK-1/settings/pages

2. **Source 설정**
   - Source: `GitHub Actions` 선택

3. **Branch 설정 (자동)**
   - GitHub Actions 워크플로우가 자동으로 배포합니다

### 2. Secrets 설정

GitHub 저장소 Settings → Secrets and variables → Actions에서 다음 환경 변수를 추가하세요:

#### Required Secrets
```
NEXT_PUBLIC_API_URL
  - 설명: 백엔드 API URL
  - 예시: https://api.mark1.example.com

DATABASE_URL
  - 설명: PostgreSQL 연결 문자열 (테스트용)
  - 예시: postgresql://user:pass@localhost:5432/mark1_test
```

### 3. 배포 프로세스

```mermaid
graph LR
    A[코드 Push] --> B[GitHub Actions 트리거]
    B --> C[테스트 실행]
    C --> D{테스트 통과?}
    D -->|Yes| E[Next.js 빌드]
    D -->|No| F[배포 중단]
    E --> G[GitHub Pages 배포]
    G --> H[배포 완료]
```

#### 배포 단계
1. **main 브랜치에 Push**
2. **자동 테스트 실행** (TDD)
   - Backend 린트 검사
   - Backend 단위 테스트
   - 커버리지 80% 검증
3. **테스트 통과 시 빌드**
   - Next.js 정적 빌드
   - `/frontend/out` 폴더 생성
4. **GitHub Pages 자동 배포**

### 4. 배포 URL

배포 완료 후 다음 URL에서 접속 가능합니다:

```
https://minjae-488.github.io/MARK-1/
```

### 5. 로컬에서 테스트

배포 전 로컬에서 정적 빌드를 테스트하세요:

```bash
# Frontend 디렉토리로 이동
cd frontend

# 의존성 설치
npm install

# 정적 빌드
npm run build

# 빌드 결과 확인
ls -la out/

# 로컬 서버로 테스트 (선택)
npx serve out
```

### 6. 배포 상태 확인

#### GitHub Actions 탭
- https://github.com/minjae-488/MARK-1/actions
- 워크플로우 실행 상태 확인
- 로그 확인

#### 배포 상태 배지
README에 추가하세요:

```markdown
![Deploy](https://github.com/minjae-488/MARK-1/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)
```

### 7. 트러블슈팅

#### 문제: 테스트 실패로 배포 중단
```bash
# 로컬에서 테스트 실행
cd backend
npm run test:cov

# 커버리지 확인
cat coverage/coverage-summary.json
```

**해결:** 테스트 커버리지 80% 이상 확보

#### 문제: 빌드 실패
```bash
# 로컬에서 빌드 테스트
cd frontend
npm run build
```

**해결:** 빌드 에러 메시지 확인 및 수정

#### 문제: 배포 후 404 에러
**원인:** basePath 설정 오류

**해결:**
```javascript
// frontend/next.config.js
basePath: process.env.NODE_ENV === 'production' ? '/MARK-1' : '',
```

#### 문제: 환경 변수 누락
**해결:** GitHub Secrets 설정 확인

```bash
# .env.example 파일 참고
cp .env.example .env
```

### 8. 수동 재배포

배포를 다시 트리거하려면:

1. **GitHub Actions 탭** 접속
2. **Deploy to GitHub Pages** 워크플로우 선택
3. **Re-run all jobs** 클릭

또는 더미 커밋:
```bash
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

---

## 🔒 보안 체크리스트

배포 전 확인사항:

- [ ] `.env` 파일이 `.gitignore`에 포함되어 있는가?
- [ ] API 키가 코드에 하드코딩되지 않았는가?
- [ ] Secrets가 GitHub에 올바르게 설정되었는가?
- [ ] 프로덕션 빌드가 로컬에서 정상 동작하는가?
- [ ] 테스트 커버리지가 80% 이상인가?

---

## 📊 배포 모니터링

### Lighthouse 점수 목표
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

### 체크 방법
```bash
# Lighthouse CI 설치
npm install -g @lhci/cli

# 배포된 사이트 분석
lhci autorun --collect.url=https://minjae-488.github.io/MARK-1/
```

---

## 🚀 다음 단계

1. **첫 배포 완료** ✅
2. **성능 모니터링** 시작
3. **사용자 피드백** 수집
4. **지속적 개선**
