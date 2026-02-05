# GitHub 라벨 생성 스크립트

Write-Host "GitHub 라벨을 생성합니다..." -ForegroundColor Green

# Phase 라벨
gh label create "Phase 1" --color "0E8A16" --description "Phase 1: MVP (No-code)" --force
gh label create "Phase 2" --color "1D76DB" --description "Phase 2: AI 통합" --force
gh label create "Phase 3" --color "5319E7" --description "Phase 3: 완전 자동화" --force
gh label create "Phase 4" --color "D93F0B" --description "Phase 4: 확장 및 고도화" --force

# 우선순위 라벨
gh label create "P0" --color "B60205" --description "Critical: 시스템 핵심 기능" --force
gh label create "P1" --color "D93F0B" --description "High: 주요 기능" --force
gh label create "P2" --color "FBCA04" --description "Medium: 개선 사항" --force
gh label create "P3" --color "0E8A16" --description "Low: Nice-to-have" --force

# 기술 스택 라벨
gh label create "TDD" --color "C5DEF5" --description "Test-Driven Development" --force
gh label create "SOLID" --color "BFD4F2" --description "SOLID 원칙 적용" --force
gh label create "AI" --color "F9D0C4" --description "AI/ML 관련" --force
gh label create "ML" --color "F9D0C4" --description "Machine Learning" --force

# 작업 유형 라벨
gh label create "infrastructure" --color "D4C5F9" --description "인프라 설정" --force
gh label create "database" --color "C2E0C6" --description "데이터베이스 작업" --force
gh label create "external-api" --color "FEF2C0" --description "외부 API 연동" --force
gh label create "automation" --color "BFDADC" --description "자동화 워크플로우" --force
gh label create "frontend" --color "E99695" --description "프론트엔드" --force
gh label create "backend" --color "C5DEF5" --description "백엔드" --force

# 상태 라벨
gh label create "blocked" --color "D93F0B" --description "차단됨 (의존성 대기)" --force
gh label create "on-hold" --color "FBCA04" --description "보류" --force

Write-Host "`n✅ 라벨 생성 완료!" -ForegroundColor Green
