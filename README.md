# 🍽️ AI 음식 분석기 (Food Analyzer)

AI 기반 음식 이미지 분석 웹앱입니다. 사용자가 업로드하거나 촬영한 음식 사진을 AI가 분석해 음식 종류와 양을 인식하고, 칼로리 및 주요 영양소(단백질, 탄수화물, 지방)를 자동으로 계산하여 보여줍니다.

## 🎯 주요 기능

- 📸 **이미지 업로드 & 분석**: 음식 사진을 드래그 앤 드롭 또는 클릭으로 업로드
- 🤖 **GPT-4 Vision AI 분석**: 음식 종류, 양, 재료 자동 인식
- 📊 **영양정보 제공**: Nutritionix API를 통한 정확한 칼로리 및 영양소 정보
- 📈 **데이터 시각화**: 영양소 비율을 원형 차트로 표시
- 🎨 **모던한 UI/UX**: 반응형 디자인 및 다크모드 지원
- ⚠️ **에러 처리**: 명확한 오류 메시지 및 재시도 기능

## 🛠 기술 스택

### Frontend
- **React 18** - UI 라이브러리
- **Vite** - 빌드 도구 (빠른 개발 서버)
- **Recharts** - 데이터 시각화
- **Axios** - HTTP 클라이언트

### Backend
- **Node.js + Express** - 서버 프레임워크
- **OpenAI GPT-4o Vision** - 이미지 분석
- **Nutritionix API** - 영양정보 데이터베이스
- **Multer** - 파일 업로드 처리

### Deployment
- **Vercel** - 프론트엔드 및 서버리스 배포
- **GitHub** - 버전 관리

## 📁 프로젝트 구조

```
vibe-1128-acorn-diet-food-info-genai/
├── frontend/                 # React 프론트엔드
│   ├── src/
│   │   ├── components/      # React 컴포넌트
│   │   │   ├── ImageUploader.jsx       # 이미지 업로드 컴포넌트
│   │   │   ├── ResultDisplay.jsx       # 결과 표시 컴포넌트
│   │   │   ├── NutritionChart.jsx      # 영양소 차트
│   │   │   ├── LoadingSpinner.jsx      # 로딩 UI
│   │   │   └── ErrorMessage.jsx        # 에러 메시지
│   │   ├── App.jsx          # 메인 앱 컴포넌트
│   │   ├── main.jsx         # 앱 엔트리 포인트
│   │   └── index.css        # 글로벌 스타일
│   ├── package.json
│   └── vite.config.js
│
├── api/                      # Vercel 서버리스 함수 (배포용)
│   ├── health.js            # GET /api/health
│   └── analyze.js           # POST /api/analyze
│
├── backend/                  # Express 백엔드
│   ├── server.js            # 서버 메인 파일
│   ├── package.json
│   └── .env.example         # 환경변수 예시
│
├── package.json             # 루트 패키지 (스크립트 통합)
├── .env.example             # 환경변수 템플릿
├── .gitignore
├── vercel.json              # Vercel 배포 설정
└── README.md
```

## 🚀 설치 및 실행 방법

### 1. 저장소 클론

```bash
git clone https://github.com/junsang-dong/vibe-1128-acorn-diet-food-info-genai.git
cd vibe-1128-acorn-diet-food-info-genai
```

### 2. 환경변수 설정

`backend/` 디렉토리에 `.env` 파일을 생성하고 다음 내용을 입력하세요:

```env
# OpenAI GPT API Key
OPENAI_API_KEY=your_openai_api_key_here

# Nutritionix API Credentials
NUTRITIONIX_APP_ID=your_nutritionix_app_id_here
NUTRITIONIX_APP_KEY=your_nutritionix_app_key_here

# Server Configuration
PORT=3001
```

**API 키 발급 방법:**

- **OpenAI API**: https://platform.openai.com/api-keys
- **Nutritionix API**: https://www.nutritionix.com/business/api

### 3. 의존성 패키지 설치

```bash
# 루트, 프론트엔드, 백엔드 모두 설치
npm run install:all
```

또는 개별 설치:

```bash
# 루트
npm install

# 프론트엔드
cd frontend && npm install

# 백엔드
cd backend && npm install
```

### 4. 개발 서버 실행

```bash
# 루트에서 프론트엔드와 백엔드 동시 실행
npm run dev
```

또는 개별 실행:

```bash
# 프론트엔드만 (터미널 1)
npm run dev:frontend

# 백엔드만 (터미널 2)
npm run dev:backend
```

### 5. 브라우저에서 확인

- **프론트엔드**: http://localhost:5160 (기본 포트)
- **백엔드 API**: http://localhost:5028 (`.env`의 `PORT` 설정에 따름)

> 💡 포트는 `frontend/vite.config.js`와 `backend/.env`에서 변경할 수 있습니다.

## 📋 최근 업데이트 (2025.02)

### Vercel 단일 배포 지원

- **백엔드 서버리스 호환**: Express 앱을 Vercel 서버리스 함수로 배포 가능하도록 `export default app` 추가
- **업로드 경로**: Vercel 환경에서는 `/tmp` 사용 (쓰기 가능 디렉터리)
- **배포 가이드**: `DEPLOYMENT.md`에 vercel.json 기반 배포 절차 반영

### 로컬 개발

- **프론트엔드 기본 포트**: 5160 (`vite.config.js`)
- **백엔드 기본 포트**: 5028 (`backend/.env`)

### Vercel 404 오류 해결 (2025.02)

**원인**: `vercel.json`에 `builds` 배열이 있으면 Vercel이 `buildCommand`와 `outputDirectory`를 **무시**합니다. 기존 설정은 `builds`에 백엔드만 포함되어 있어 프론트엔드가 빌드되지 않았고, `index.html`이 생성되지 않아 404가 발생했습니다.

**해결 방법**:
1. **builds 배열 제거** → `buildCommand`와 `outputDirectory`가 정상 동작
2. **api/ 폴더 추가** → `api/health.js`, `api/analyze.js`로 `/api/*` 요청을 Express 앱에 전달
3. **rewrites 수정** → SPA 폴백 시 `api/`, `assets/` 경로 제외하여 API 요청이 정적 파일로 가지 않도록 함

## 📡 API 엔드포인트

### `POST /api/analyze`

음식 이미지를 분석합니다.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `image` (파일)

**Response:**
```json
{
  "success": true,
  "analysis": {
    "food_name": "bibimbap",
    "description": "Korean mixed rice with vegetables",
    "ingredients": ["rice", "vegetables", "egg", "gochujang"],
    "estimated_weight_grams": 450,
    "estimated_portions": 1
  },
  "nutrition": {
    "calories": 560,
    "protein": 17,
    "carbs": 85,
    "fat": 15
  }
}
```

### `GET /api/health`

서버 상태를 확인합니다.

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

## 🎨 주요 컴포넌트 설명

### `ImageUploader`
- 드래그 앤 드롭 또는 클릭으로 이미지 업로드
- 파일 형식 및 크기 검증 (JPG, PNG, WEBP / 10MB 제한)
- 미리보기 기능

### `ResultDisplay`
- 분석된 음식 정보 표시
- 칼로리 및 영양소 정보를 카드 형식으로 표시
- 재료 태그 표시

### `NutritionChart`
- Recharts를 이용한 영양소 비율 원형 차트
- 단백질, 탄수화물, 지방 시각화
- 각 영양소의 칼로리 계산 표시

### `LoadingSpinner`
- 분석 중 로딩 UI
- 진행 단계 표시 (이미지 인식 → 음식 식별 → 영양정보 계산)

### `ErrorMessage`
- 오류 발생 시 사용자 친화적인 메시지 표시
- 재시도 버튼 제공

## 🌐 배포 (Vercel)

`vercel.json`에 프론트엔드·백엔드 단일 배포 설정이 포함되어 있습니다. 자세한 절차는 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참고하세요.

### 1. GitHub에 푸시

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

### 2. Vercel 배포

1. [Vercel](https://vercel.com)에 로그인
2. "New Project" → [GitHub 저장소](https://github.com/junsang-dong/vibe-1128-acorn-diet-food-info-genai) 연결
3. **환경변수** 설정 (Vercel 대시보드):
   - `OPENAI_API_KEY`
   - `NUTRITIONIX_APP_ID`
   - `NUTRITIONIX_APP_KEY`
4. "Deploy" 클릭

### 3. 자동 배포

GitHub `main` 브랜치에 푸시할 때마다 Vercel이 자동으로 배포합니다.

## 🔧 트러블슈팅

### API 키 오류
- `.env` 파일이 올바른 위치에 있는지 확인
- API 키가 유효한지 확인
- 백엔드를 재시작

### CORS 오류
- 백엔드에서 CORS가 활성화되어 있는지 확인
- Vite 프록시 설정 확인 (`frontend/vite.config.js`)

### 이미지 업로드 실패
- 파일 크기가 10MB 이하인지 확인
- 지원되는 형식(JPG, PNG, WEBP)인지 확인
- 서버가 실행 중인지 확인

### Nutritionix API 오류
- API 크레딧이 충분한지 확인
- 음식명이 영어로 변환되는지 확인
- Nutritionix가 실패하면 GPT 추정값이 사용됩니다

### Vercel 405 (Method Not Allowed) 오류
- **원인**: SPA rewrite가 `/api/*` 요청까지 가로채 `index.html`로 보내 POST 요청이 정적 파일로 처리됨
- **해결**: `vercel.json`에서 rewrite 패턴에 `api/`, `assets/` 경로 제외

## 📝 참고 문서

- [Nutritionix API Guide](https://docx.syndigo.com/developers/docs/nutritionix-api-guide)
- [OpenAI Vision API](https://platform.openai.com/docs/guides/vision)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Recharts Documentation](https://recharts.org)

## 🤝 기여

이슈 및 풀 리퀘스트를 환영합니다!

## 📄 라이선스

ISC

## 👨‍💻 개발자

Powered by GPT-4 Vision & Nutritionix API


