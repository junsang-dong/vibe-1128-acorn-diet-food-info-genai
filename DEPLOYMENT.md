# 🚀 배포 가이드

이 문서는 AI 음식 분석기를 Vercel에 배포하는 방법을 설명합니다.

## 📋 사전 준비

1. **GitHub 계정**
2. **Vercel 계정** ([https://vercel.com](https://vercel.com))
3. **API 키**:
   - OpenAI API Key ([https://platform.openai.com/api-keys](https://platform.openai.com/api-keys))
   - Nutritionix API Credentials ([https://www.nutritionix.com/business/api](https://www.nutritionix.com/business/api))

## 🔧 1단계: GitHub에 푸시

### 1.1 Git 저장소 초기화

```bash
cd /Users/junsangdong/Desktop/VBC30M-C5/vibe-1128-acorn-diet-food-info-genai
git init
```

### 1.2 파일 추가 및 커밋

```bash
git add .
git commit -m "Initial commit: AI Food Analyzer"
```

### 1.3 GitHub 저장소 생성 및 푸시

1. GitHub에서 새 저장소 생성 (예: `ai-food-analyzer`)
2. 원격 저장소 추가 및 푸시:

```bash
git remote add origin https://github.com/YOUR_USERNAME/ai-food-analyzer.git
git branch -M main
git push -u origin main
```

## 🌐 2단계: Vercel 배포

프로젝트에 `vercel.json`이 포함되어 있어 **프론트엔드 + 백엔드**가 단일 프로젝트로 자동 배포됩니다.

### 2.1 Vercel 프로젝트 생성

1. [Vercel 대시보드](https://vercel.com/dashboard)에 로그인
2. **"New Project"** 클릭
3. GitHub 저장소 연결 (Import Git Repository)
4. 저장소 선택 후 **Import** 클릭

### 2.2 프로젝트 설정

`vercel.json`에 빌드 설정이 포함되어 있으므로 **추가 설정 없이** 그대로 진행해도 됩니다.

- **Root Directory**: `./` (루트, 기본값)
- **Build**: `vercel.json`의 builds 설정 사용 (프론트엔드 정적 빌드 + 백엔드 서버리스)

#### 환경변수 설정 (필수)

**Environment Variables** 섹션에서 다음 변수들을 추가하세요:

| Key | Value | 설명 |
|-----|-------|------|
| `OPENAI_API_KEY` | `sk-xxxxx...` | OpenAI API 키 |
| `NUTRITIONIX_APP_ID` | `xxxxx...` | Nutritionix App ID |
| `NUTRITIONIX_APP_KEY` | `xxxxx...` | Nutritionix App Key |

> ⚠️ 환경변수는 Vercel 대시보드에서만 설정합니다. `.env` 파일은 Git에 포함되지 않습니다.

### 2.3 배포 시작

1. 환경변수 설정 후 **"Deploy"** 클릭
2. 배포 진행 상황 확인 (약 2~3분 소요)
3. 배포 완료 후 URL 확인 (예: `https://your-app.vercel.app`)

### 2.4 Vercel CLI로 배포 (선택사항)

```bash
# Vercel 로그인 (최초 1회)
vercel login

# 프로젝트 루트에서 배포
vercel

# 프로덕션 배포
vercel --prod
```

## 🔄 3단계: 자동 배포 설정

### GitHub Actions (선택사항)

`.github/workflows/deploy.yml` 파일이 이미 포함되어 있습니다. 

GitHub Secrets에 다음 변수들을 추가:

1. GitHub 저장소 → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** 클릭
3. 다음 시크릿 추가:
   - `VERCEL_TOKEN`: Vercel 계정 설정에서 생성
   - `VERCEL_ORG_ID`: Vercel 프로젝트 설정에서 확인
   - `VERCEL_PROJECT_ID`: Vercel 프로젝트 설정에서 확인

### Vercel Git Integration

Vercel은 기본적으로 GitHub와 통합되어 있습니다:

- `main` 브랜치에 푸시하면 자동으로 프로덕션 배포
- PR(Pull Request) 생성 시 자동으로 프리뷰 배포

## ✅ 4단계: 배포 확인

### 4.1 웹사이트 접속

배포된 URL로 접속하여 다음을 확인:

1. 페이지가 정상적으로 로드되는지
2. 이미지 업로드 기능이 작동하는지
3. API 연동이 정상인지

### 4.2 API 엔드포인트 테스트

```bash
# Health check
curl https://your-app.vercel.app/api/health

# 응답 예시:
# {"status":"ok","message":"Server is running"}
```

### 4.3 로그 확인

Vercel 대시보드에서:
1. 프로젝트 선택
2. **Deployments** 탭
3. 최신 배포 선택
4. **Runtime Logs** 확인

## 🔍 트러블슈팅

### 문제 1: API 키 오류

**증상**: "OPENAI_API_KEY not configured" 경고

**해결책**:
1. Vercel 대시보드 → 프로젝트 → Settings → Environment Variables
2. 환경변수가 올바르게 설정되었는지 확인
3. 재배포: Deployments → 최신 배포 → **Redeploy**

### 문제 2: Build 실패

**증상**: Build 단계에서 실패

**해결책**:
```bash
# 로컬에서 빌드 테스트
cd frontend
npm run build

# 오류 메시지 확인 후 수정
```

### 문제 3: API 라우팅 오류

**증상**: `/api/analyze` 엔드포인트 404 오류

**해결책**:
1. `vercel.json` 파일 확인
2. 라우팅 설정이 올바른지 확인
3. 재배포

### 문제 4: CORS 오류

**증상**: 프론트엔드에서 백엔드 API 호출 실패

**해결책**:
- `backend/server.js`에서 CORS 설정 확인
- Vercel 프록시 설정 확인

## 📊 배포 후 모니터링

### Vercel Analytics

1. Vercel 대시보드 → 프로젝트 선택
2. **Analytics** 탭
3. 트래픽, 성능 지표 확인

### 로그 모니터링

```bash
# Vercel CLI 설치 (선택사항)
npm i -g vercel

# 로그인
vercel login

# 실시간 로그 확인
vercel logs
```

## 🔄 업데이트 배포

### 코드 변경 후 배포

```bash
# 변경사항 커밋
git add .
git commit -m "Update: 기능 개선"

# GitHub에 푸시 (자동 배포)
git push origin main
```

### 수동 재배포

Vercel 대시보드:
1. Deployments 탭
2. 최신 배포 선택
3. **Redeploy** 버튼 클릭

## 🌍 커스텀 도메인 설정 (선택사항)

1. Vercel 대시보드 → 프로젝트 → Settings → Domains
2. **Add** 버튼 클릭
3. 도메인 입력 (예: `food-analyzer.com`)
4. DNS 설정 안내에 따라 도메인 제공업체에서 설정
5. 인증 완료 후 HTTPS 자동 적용

## 📝 참고 사항

### 무료 플랜 제한

- 대역폭: 100GB/월
- 빌드 시간: 6000분/월
- 서버리스 함수 실행 시간: 100시간/월

### 비용 최적화

- 이미지 최적화 활성화
- Edge Function 사용 고려
- 캐싱 전략 구현

## 🆘 추가 도움말

- [Vercel 공식 문서](https://vercel.com/docs)
- [Vercel CLI 문서](https://vercel.com/docs/cli)
- [Node.js on Vercel](https://vercel.com/docs/runtimes#official-runtimes/node-js)

---

**배포 완료!** 🎉

이제 전 세계 어디서나 AI 음식 분석기를 사용할 수 있습니다!

