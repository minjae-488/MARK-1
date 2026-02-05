# Airtable 설정 자동화 스크립트

Write-Host "🚀 TASK-003: Airtable 설정 시작" -ForegroundColor Green
Write-Host ""

# Step 1: 환경 변수 파일 생성
Write-Host "📝 Step 1: 환경 변수 파일 생성" -ForegroundColor Cyan

if (Test-Path "backend\.env") {
    Write-Host "  ✅ backend\.env 파일이 이미 존재합니다." -ForegroundColor Yellow
}
else {
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "  ✅ backend\.env 파일을 생성했습니다." -ForegroundColor Green
}

Write-Host ""

# Step 2: 사용자에게 Airtable 계정 생성 안내
Write-Host "📋 Step 2: Airtable 계정 생성 (수동)" -ForegroundColor Cyan
Write-Host ""
Write-Host "  다음 URL을 브라우저에서 열어주세요:" -ForegroundColor White
Write-Host "  https://airtable.com/signup" -ForegroundColor Yellow
Write-Host ""
Write-Host "  계정 생성 후 다음을 진행하세요:" -ForegroundColor White
Write-Host "  1. 이메일 인증" -ForegroundColor White
Write-Host "  2. 무료 플랜 선택" -ForegroundColor White
Write-Host ""

$accountCreated = Read-Host "계정을 생성하셨습니까? (y/n)"

if ($accountCreated -ne "y") {
    Write-Host ""
    Write-Host "❌ 계정 생성 후 다시 실행해주세요." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 3: Base 생성 안내
Write-Host "📋 Step 3: Base 생성 (수동)" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Airtable 대시보드에서:" -ForegroundColor White
Write-Host "  1. 'Create a base' 클릭" -ForegroundColor White
Write-Host "  2. 'Start from scratch' 선택" -ForegroundColor White
Write-Host "  3. Base 이름: 'MARK-1-Production' 입력" -ForegroundColor White
Write-Host "  4. Base URL을 확인하세요 (예: https://airtable.com/appXXXXXXXXXXXXXX)" -ForegroundColor White
Write-Host ""

$baseCreated = Read-Host "Base를 생성하셨습니까? (y/n)"

if ($baseCreated -ne "y") {
    Write-Host ""
    Write-Host "❌ Base 생성 후 다시 실행해주세요." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Base ID를 입력하세요 (app로 시작하는 17자리):" -ForegroundColor White
Write-Host "예시: appXXXXXXXXXXXXXX" -ForegroundColor Yellow
$baseId = Read-Host "Base ID"

if ($baseId -notmatch "^app[a-zA-Z0-9]{14}$") {
    Write-Host ""
    Write-Host "❌ 올바른 Base ID 형식이 아닙니다. (app로 시작하는 17자리)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 4: API 키 발급 안내
Write-Host "📋 Step 4: API 키 발급 (수동)" -ForegroundColor Cyan
Write-Host ""
Write-Host "  다음 URL을 브라우저에서 열어주세요:" -ForegroundColor White
Write-Host "  https://airtable.com/account" -ForegroundColor Yellow
Write-Host ""
Write-Host "  페이지에서:" -ForegroundColor White
Write-Host "  1. 'API' 섹션으로 스크롤" -ForegroundColor White
Write-Host "  2. 'Generate API key' 클릭" -ForegroundColor White
Write-Host "  3. API 키 복사 (key로 시작)" -ForegroundColor White
Write-Host ""

Write-Host "API 키를 입력하세요 (key로 시작):" -ForegroundColor White
Write-Host "⚠️  주의: 입력한 내용이 화면에 표시되지 않습니다 (보안)" -ForegroundColor Yellow
$apiKeySecure = Read-Host "API Key" -AsSecureString
$apiKey = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($apiKeySecure)
)

if ($apiKey -notmatch "^key[a-zA-Z0-9]{14}$") {
    Write-Host ""
    Write-Host "❌ 올바른 API 키 형식이 아닙니다. (key로 시작하는 17자리)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 5: .env 파일 업데이트
Write-Host "📝 Step 5: 환경 변수 파일 업데이트" -ForegroundColor Cyan

$envContent = Get-Content "backend\.env" -Raw
$envContent = $envContent -replace "AIRTABLE_API_KEY=.*", "AIRTABLE_API_KEY=$apiKey"
$envContent = $envContent -replace "AIRTABLE_BASE_ID=.*", "AIRTABLE_BASE_ID=$baseId"
$envContent | Set-Content "backend\.env" -NoNewline

Write-Host "  ✅ backend\.env 파일이 업데이트되었습니다." -ForegroundColor Green
Write-Host ""

# Step 6: 의존성 설치
Write-Host "📦 Step 6: NPM 의존성 설치" -ForegroundColor Cyan

Push-Location "backend"

if (Test-Path "node_modules") {
    Write-Host "  ✅ node_modules가 이미 존재합니다. npm install 생략" -ForegroundColor Yellow
}
else {
    Write-Host "  ⏳ npm install 실행 중..." -ForegroundColor White
    npm install --silent
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ 의존성 설치 완료" -ForegroundColor Green
    }
    else {
        Write-Host "  ❌ npm install 실패" -ForegroundColor Red
        Pop-Location
        exit 1
    }
}

Write-Host ""

# Step 7: 연결 테스트
Write-Host "🧪 Step 7: Airtable 연결 테스트" -ForegroundColor Cyan
Write-Host ""

npm run test:airtable

Pop-Location

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "✅ TASK-003 완료!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""
Write-Host "다음 작업:" -ForegroundColor Cyan
Write-Host "  - TASK-008: Airtable Orders 테이블 생성" -ForegroundColor White
Write-Host "  - TASK-004: Make.com 설정" -ForegroundColor White
Write-Host ""
