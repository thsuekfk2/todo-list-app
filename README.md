# Todo List App

현대적인 웹 기반 할 일 관리 애플리케이션입니다. Go 백엔드와 React 프론트엔드로 구성되어 있으며, 사용자 인증, CRUD 기능, 우선순위 설정 등을 지원합니다.

## 🚀 주요 기능

- **사용자 인증**: 회원가입, 로그인, 로그아웃
- **할 일 관리**: 생성, 조회, 수정, 삭제 (CRUD)
- **우선순위 설정**: 낮음, 보통, 높음 3단계
- **할 일 완료 처리**: 체크박스로 간편한 완료/미완료 토글
- **필터링 및 정렬**: 상태별 필터링, 다양한 정렬 옵션
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원

## 🛠 기술 스택

### 백엔드
- **언어**: Go 1.24.4
- **웹 프레임워크**: Gorilla Mux
- **데이터베이스**: SQLite
- **인증**: bcrypt + 세션 기반
- **패키지 관리**: Go Modules

### 프론트엔드
- **프레임워크**: React 19.1.0
- **빌드 도구**: Vite 6.3.5
- **라우팅**: React Router 7.6.3
- **스타일링**: Tailwind CSS 3.4.17
- **상태 관리**: React Context API

## 📋 사전 요구사항

- **Go**: 1.24.4 이상
- **Node.js**: 18.0.0 이상
- **npm**: 8.0.0 이상

## 🚀 설치 및 실행

### 1. 저장소 클론
```bash
git clone <repository-url>
cd claude_test
```

### 2. 백엔드 설정 및 실행
```bash
cd backend
go mod download
go run cmd/main.go
```

백엔드 서버가 `http://localhost:8080`에서 실행됩니다.

### 3. 프론트엔드 설정 및 실행
```bash
cd frontend
npm install
npm run dev
```

프론트엔드 개발 서버가 `http://localhost:5173` (또는 다른 사용 가능한 포트)에서 실행됩니다.

## 🔑 테스트 계정

애플리케이션에는 미리 생성된 테스트 계정이 있습니다:

- **이메일**: `test@example.com`
- **비밀번호**: `password123`

## 📁 프로젝트 구조

```
claude_test/
├── backend/                 # Go 백엔드
│   ├── cmd/
│   │   └── main.go         # 애플리케이션 진입점
│   ├── internal/
│   │   ├── database/       # 데이터베이스 설정 및 마이그레이션
│   │   ├── handlers/       # HTTP 핸들러
│   │   └── middleware/     # 미들웨어 (인증, CORS)
│   ├── data/              # SQLite 데이터베이스 파일
│   └── go.mod
├── frontend/               # React 프론트엔드
│   ├── src/
│   │   ├── components/     # 재사용 가능한 컴포넌트
│   │   ├── contexts/       # React Context (상태 관리)
│   │   ├── hooks/          # 커스텀 훅
│   │   ├── pages/          # 페이지 컴포넌트
│   │   └── main.jsx        # 애플리케이션 진입점
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
├── docs/                   # 문서
└── README.md
```

## 🌐 API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃

### 할 일 관리
- `GET /api/todos` - 할 일 목록 조회
- `POST /api/todos` - 새 할 일 생성
- `PUT /api/todos/{id}` - 할 일 수정
- `DELETE /api/todos/{id}` - 할 일 삭제
- `PATCH /api/todos/{id}/toggle` - 할 일 완료 상태 토글

### 기타
- `GET /health` - 서버 상태 확인

## 🎨 UI/UX 특징

- **현대적인 디자인**: 그라디언트와 그림자를 활용한 모던한 인터페이스
- **직관적인 사용자 경험**: 명확한 시각적 피드백과 애니메이션
- **반응형 레이아웃**: 모든 디바이스에서 최적화된 사용 경험
- **접근성**: 키보드 네비게이션 및 스크린 리더 지원

## 🔒 보안 기능

- **비밀번호 암호화**: bcrypt를 사용한 안전한 비밀번호 해싱
- **세션 기반 인증**: 안전한 세션 관리
- **CORS 보호**: 승인된 도메인에서만 API 접근 허용
- **입력 검증**: 프론트엔드 및 백엔드에서 이중 검증

## 🧪 개발 스크립트

### 백엔드
```bash
# 개발 서버 실행
go run cmd/main.go

# 테스트 데이터로 실행
SEED_DATA=true go run cmd/main.go

# 빌드
go build -o bin/server cmd/main.go
```

### 프론트엔드
```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 린트 검사
npm run lint

# 프리뷰 (빌드된 앱 미리보기)
npm run preview
```

## 🚀 배포

### Docker를 사용한 배포 (예정)
```bash
# 향후 Docker 컨테이너 지원 예정
docker-compose up -d
```

### 수동 배포
1. 프론트엔드 빌드: `npm run build`
2. 백엔드 빌드: `go build -o bin/server cmd/main.go`
3. 빌드된 파일들을 서버에 배포

## 🐛 문제 해결

### 일반적인 문제들

**1. CORS 오류**
- 백엔드와 프론트엔드가 다른 포트에서 실행되는지 확인
- 브라우저 개발자 도구에서 네트워크 탭 확인

**2. 데이터베이스 오류**
- `backend/data/` 디렉토리가 존재하는지 확인
- SQLite 파일 권한 확인

**3. 의존성 오류**
```bash
# Go 의존성 재설치
cd backend && go mod tidy

# Node.js 의존성 재설치
cd frontend && rm -rf node_modules package-lock.json && npm install
```

## 📝 라이센스

이 프로젝트는 학습 목적으로 제작되었습니다.

## 🤝 기여

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 연락처

프로젝트와 관련된 질문이나 제안사항이 있으시면 이슈를 생성해 주세요.

---

**🤖 Generated with [Claude Code](https://claude.ai/code)**