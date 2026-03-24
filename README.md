# TodoList

ASP.NET 백엔드(`TodoList/`) + Angular 프론트엔드(`frontend/`) 모노레포 구성입니다.

## 구조

- `TodoList/`: ASP.NET API
- `frontend/`: Angular 19 + Angular Material + TailwindCSS v4

프론트엔드는 Vertical Slice 아키텍처를 사용합니다.

```text
frontend/src/app/
├─ core/
├─ shared/
├─ layout/
└─ features/
   └─ todo/
      ├─ components/
      ├─ pages/
      ├─ services/
      ├─ models/
      └─ todo.routes.ts
```

## 로컬 개발

1. 백엔드 실행

```bash
dotnet run --project TodoList/TodoList.csproj
```

2. 프론트 실행

```bash
cd frontend
npm install
npm start
```

기본 프록시 설정은 `frontend/proxy.conf.json`이며 `/api` 요청을 `https://localhost:7001`로 전달합니다.

## 빌드

```bash
cd frontend
npm run build
```

산출물은 `frontend/dist/frontend/`에 생성됩니다.
