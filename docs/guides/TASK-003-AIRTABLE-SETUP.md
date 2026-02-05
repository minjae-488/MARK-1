# [TASK-003] Airtable 설정 가이드

## 📋 작업 개요

**목표:** Airtable을 Phase 1 MVP의 데이터베이스로 설정  
**예상 시간:** 1일  
**우선순위:** P0 (Critical)

## ✅ 인수 조건

- [ ] Airtable Base 생성 완료
- [ ] API 키 안전하게 저장
- [ ] Airtable API 호출 성공
- [ ] .env.example 파일 커밋

---

## 🚀 Step-by-Step 가이드

### Step 1: Airtable 계정 생성

1. **Airtable 웹사이트 접속**
   ```
   https://airtable.com/signup
   ```

2. **계정 생성**
   - 이메일 입력
   - 비밀번호 설정
   - 이메일 인증

3. **플랜 선택**
   - 초기: **Free 플랜** (무료) 사용
   - 나중에 필요시 Pro 플랜으로 업그레이드 ($20/월)

### Step 2: Base 생성

1. **"Create a base" 클릭**

2. **Base 이름 설정**
   ```
   MARK-1-Production
   ```

3. **템플릿 선택**
   - "Start from scratch" 선택

4. **Base URL 기록**
   ```
   https://airtable.com/appXXXXXXXXXXXXXX
   ```
   - `appXXXXXXXXXXXXXX` 부분이 Base ID입니다

### Step 3: API 키 발급

1. **Account 설정 접속**
   ```
   https://airtable.com/account
   ```

2. **"Generate API key" 클릭**

3. **API 키 복사 및 안전하게 저장**
   ```
   keyXXXXXXXXXXXXXX
   ```
   ⚠️ **주의:** API 키는 재발급 불가능하므로 안전하게 보관!

### Step 4: 환경 변수 설정

1. **backend/.env 파일 생성**
   ```bash
   cp backend/.env.example backend/.env
   ```

2. **API 키 입력**
   ```env
   # Airtable
   AIRTABLE_API_KEY=keyXXXXXXXXXXXXXX
   AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
   ```

3. **Git에 커밋하지 않도록 확인**
   ```bash
   # .gitignore에 이미 포함되어 있는지 확인
   cat .gitignore | grep ".env"
   ```

### Step 5: API 연결 테스트

#### 5.1 Node.js 테스트 스크립트 작성

`backend/scripts/test-airtable.js` 파일 생성:

```javascript
require('dotenv').config();
const axios = require('axios');

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

async function testAirtableConnection() {
  try {
    const response = await axios.get(
      `https://api.airtable.com/v0/meta/bases/${AIRTABLE_BASE_ID}/tables`,
      {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`
        }
      }
    );
    
    console.log('✅ Airtable 연결 성공!');
    console.log(`📊 Base ID: ${AIRTABLE_BASE_ID}`);
    console.log(`📋 테이블 수: ${response.data.tables.length}`);
    console.log('테이블 목록:', response.data.tables.map(t => t.name));
    
  } catch (error) {
    console.error('❌ Airtable 연결 실패!');
    console.error('에러:', error.response?.data || error.message);
  }
}

testAirtableConnection();
```

#### 5.2 의존성 설치 및 실행

```bash
# backend 디렉토리로 이동
cd backend

# 의존성 설치
npm install dotenv axios

# 테스트 스크립트 실행
node scripts/test-airtable.js
```

#### 5.3 예상 출력

```
✅ Airtable 연결 성공!
📊 Base ID: appXXXXXXXXXXXXXX
📋 테이블 수: 0
테이블 목록: []
```

---

## 📚 다음 단계

TASK-003 완료 후:
- ✅ **[TASK-008]** Orders 테이블 생성
- ⏭️ **[TASK-009]** Products 테이블 생성
- ⏭️ **[TASK-010]** Suppliers 테이블 생성
- ⏭️ **[TASK-011]** Fulfillment_Groups 테이블 생성

---

## 🔧 트러블슈팅

### Q1: API 키가 유효하지 않다고 나와요
**A:** 
- API 키를 다시 복사했는지 확인
- 앞뒤 공백이 없는지 확인
- Account 페이지에서 키 재발급

### Q2: Base ID를 어디서 찾나요?
**A:**
- Base를 열었을 때 URL 확인: `https://airtable.com/appXXX/...`
- 또는 Base 설정 → API documentation에서 확인

### Q3: 무료 플랜의 제한사항은?
**A:**
- 1,200 레코드/base
- 2GB 첨부파일
- 워크스페이스당 5개 creat
or 또는 editor
- **Phase 1 MVP에는 충분합니다!**

---

## ✅ 완료 체크리스트

작업 완료 후 다음을 확인하세요:

- [ ] Airtable 계정 생성 완료
- [ ] Base "MARK-1-Production" 생성
- [ ] API 키 발급 및 .env에 저장
- [ ] `test-airtable.js` 실행 성공
- [ ] .gitignore에 .env 포함 확인
- [ ] backend/.env.example 업데이트 (키 값 제외)

**완료 시 TASKS.md 업데이트:**
```markdown
- [x] **[TASK-003]** Airtable 설정
```

---

**작성일:** 2026-02-05  
**담당자:** Phase 1 MVP 팀  
**관련 문서:** [TECH_SPEC.md - Airtable](../TECH_SPEC.md#21-데이터베이스-설계-airtable)
