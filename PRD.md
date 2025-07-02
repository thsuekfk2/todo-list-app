# Todo List 관리 앱 PRD (Product Requirements Document)

## 1. 제품 개요

### 1.1 제품명
**Todo Master** - 개인 할일 관리 앱

### 1.2 목적
- 개인 사용자의 할일 관리 및 생산성 향상
- 바이브 코딩 학습을 위한 데모 프로젝트
- MVP 방식으로 점진적 개발

### 1.3 대상 사용자
- 개인 사용자 (학습용 데모)
- 간단한 할일 관리가 필요한 사용자

## 2. 기술 스택

### 2.1 백엔드
- **언어**: Go
- **데이터베이스**: SQLite
- **인증**: 세션 기반 인증 (JWT 또는 쿠키)

### 2.2 프론트엔드
- **프레임워크**: React
- **라우팅**: Tanstack Router
- **스타일링**: Tailwind CSS
- **빌드 도구**: Vite

### 2.3 인프라
- **배포**: Docker 컨테이너 (로컬 환경)
- **데이터베이스**: SQLite (파일 기반)

## 3. 핵심 기능

### 3.1 사용자 인증
- **회원가입**: 이메일, 비밀번호 (이메일 인증 제외)
- **로그인**: 이메일, 비밀번호
- **로그아웃**: 세션 종료

### 3.2 Todo 관리
- **Todo 생성**: 제목, 설명, 우선순위
- **Todo 조회**: 개인별 Todo 목록 표시
- **Todo 수정**: 기존 Todo 내용 편집
- **Todo 삭제**: Todo 항목 제거
- **상태 관리**: 완료/미완료 토글

### 3.3 데이터 관리
- **사용자별 데이터 분리**: 로그인한 사용자의 Todo만 표시
- **영구 저장**: SQLite 데이터베이스 사용

## 4. 사용자 스토리

### 4.1 회원가입/로그인
```
사용자로서 이메일과 비밀번호로 회원가입을 할 수 있다.
사용자로서 등록된 계정으로 로그인할 수 있다.
사용자로서 로그아웃할 수 있다.
```

### 4.2 Todo 관리
```
로그인한 사용자로서 새로운 Todo를 생성할 수 있다.
로그인한 사용자로서 내 Todo 목록을 볼 수 있다.
로그인한 사용자로서 Todo를 완료/미완료로 표시할 수 있다.
로그인한 사용자로서 Todo를 수정할 수 있다.
로그인한 사용자로서 Todo를 삭제할 수 있다.
```

## 5. API 설계

### 5.1 인증 API
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃

### 5.2 Todo API
- `GET /api/todos` - Todo 목록 조회
- `POST /api/todos` - Todo 생성
- `PUT /api/todos/:id` - Todo 수정
- `DELETE /api/todos/:id` - Todo 삭제
- `PATCH /api/todos/:id/toggle` - Todo 상태 토글

## 6. 데이터베이스 스키마

### 6.1 Users 테이블
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 6.2 Todos 테이블
```sql
CREATE TABLE todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    priority INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 7. MVP 범위

### 7.1 1차 릴리즈 (MVP)
- ✅ 기본 회원가입/로그인
- ✅ Todo CRUD 기능
- ✅ 완료/미완료 상태 관리
- ✅ 사용자별 데이터 분리

### 7.2 향후 개발 예정
- 📋 Todo 카테고리/태그
- 📅 마감일 설정
- 🔍 Todo 검색/필터
- 📊 통계 및 대시보드

## 8. 비기능적 요구사항

### 8.1 성능
- 응답 시간: 1초 이내
- 동시 사용자: 10명 (로컬 테스트 환경)

### 8.2 보안
- 비밀번호 해싱 (bcrypt)
- 세션 기반 인증
- SQL 인젝션 방지

### 8.3 사용성
- 반응형 디자인
- 직관적인 UI/UX

## 9. 개발 일정

### Phase 1: 백엔드 개발 (1주)
- Go 프로젝트 설정
- 데이터베이스 스키마 설정
- 인증 API 구현
- Todo API 구현

### Phase 2: 프론트엔드 개발 (1주)
- React 프로젝트 설정
- 인증 페이지 구현
- Todo 관리 페이지 구현
- API 연동

### Phase 3: 통합 및 배포 (0.5주)
- Docker 컨테이너 설정
- 통합 테스트
- 로컬 배포 설정