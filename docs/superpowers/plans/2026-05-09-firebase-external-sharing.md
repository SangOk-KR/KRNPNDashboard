# Firebase 연동 + GitHub Pages 배포 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** localStorage 기반 데이터 공유를 Firebase Realtime Database로 교체하여 admin.html(로컬)에서 입력한 내용이 GitHub Pages에 배포된 index.html에 실시간으로 반영되도록 한다.

**Architecture:** admin.html은 로컬(또는 어드민 전용 URL)에서 실행되고 Firebase Realtime Database에 JSON 상태를 저장한다. index.html은 GitHub Pages에 배포되어 Firebase에서 데이터를 실시간으로 읽어 렌더링한다. 두 페이지 모두 Firebase JS SDK(CDN)를 사용하며 별도 빌드 단계가 없다.

**Tech Stack:** Firebase Realtime Database (Spark 무료 플랜), Firebase JS SDK v9 compat (CDN), GitHub Pages, Vanilla JS

---

## 파일 구조

```
mock-site/
├── firebase-config.js      ← NEW: Firebase 프로젝트 설정값 (키 분리)
├── admin.html              ← MODIFY: localStorage → Firebase write
└── index.html              ← MODIFY: localStorage → Firebase read (realtime)

.github/
└── workflows/
    └── deploy.yml          ← NEW: GitHub Actions — index.html 자동 배포
```

---

## 사전 조건 (플랜 실행 전 사람이 직접 수행)

> 아래 2가지는 Firebase 콘솔 UI 작업이므로 사람이 직접 수행해야 한다.
> 완료 후 획득한 값을 Task 1에서 `firebase-config.js`에 입력한다.

**A. Firebase 프로젝트 생성**
1. [https://console.firebase.google.com](https://console.firebase.google.com) 접속
2. "프로젝트 추가" → 이름: `nvidia-npn-partner` → Google Analytics 비활성화 → 생성
3. 좌측 메뉴 "빌드 > Realtime Database" → "데이터베이스 만들기"
4. 위치: `asia-southeast1` (싱가포르, 한국 최근접) → **테스트 모드로 시작** 선택
5. 프로젝트 설정 > 일반 > "내 앱" > 웹 앱 추가(`</>`) → 앱 이름: `npn-admin` → SDK 설정값 복사

**B. Realtime Database 보안 규칙 설정**
```json
{
  "rules": {
    ".read": true,
    ".write": "auth != null"
  }
}
```
> 읽기는 공개(GitHub Pages 열람자), 쓰기는 인증 필요.
> 단순 운영이라면 테스트 기간에는 `.write: true` 로 두고 나중에 강화해도 된다.

---

## Task 1: Firebase 설정 파일 분리

**Files:**
- Create: `mock-site/firebase-config.js`

- [ ] **Step 1: `firebase-config.js` 생성**

아래 내용을 `mock-site/firebase-config.js`에 저장한다.
`firebaseConfig` 객체 안의 값은 사전 조건 A에서 복사한 실제 값으로 교체한다.

```javascript
// mock-site/firebase-config.js
// Firebase 프로젝트 설정값 — Firebase 콘솔 > 프로젝트 설정 > 내 앱에서 복사
const firebaseConfig = {
  apiKey:            "AIzaSy...",           // 실제 값으로 교체
  authDomain:        "nvidia-npn-partner.firebaseapp.com",
  databaseURL:       "https://nvidia-npn-partner-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId:         "nvidia-npn-partner",
  storageBucket:     "nvidia-npn-partner.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abcdef"
};

// Firebase 앱 초기화 (SDK v9 compat)
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const STATE_REF = db.ref('npn_state');  // 모든 데이터를 하나의 노드에 저장
```

- [ ] **Step 2: 로컬 서버 기동 후 콘솔 오류 없는지 확인**

```bash
python3 mock-site/serve.py
# http://127.0.0.1:8787/admin.html 열고 브라우저 콘솔(F12) 확인
# 기대: 오류 없이 로드됨 (아직 admin.html에서 import 안 했으므로 로드 안 됨)
```

- [ ] **Step 3: 커밋**

```bash
cd /Users/sangokh/Desktop/기획서
git add mock-site/firebase-config.js
git commit -m "feat: add Firebase config file"
```

---

## Task 2: admin.html — Firebase SDK 추가 및 저장 로직 교체

**Files:**
- Modify: `mock-site/admin.html`

**변경 위치**: `admin.html`의 `<head>` SDK 삽입 + `persistState()` 함수 교체

- [ ] **Step 1: `<head>` 에 Firebase SDK 스크립트 추가**

`admin.html`의 `</head>` 바로 앞에 아래 3줄을 삽입한다.

```html
<!-- Firebase SDK (v9 compat — CDN, 빌드 단계 없음) -->
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js"></script>
<script src="firebase-config.js"></script>
```

- [ ] **Step 2: `persistState()` 함수를 Firebase 저장으로 교체**

`admin.html` `<script>` 내부에서 기존 `persistState()` 함수를 찾아 아래로 교체한다.

```javascript
// 기존 코드 (삭제):
// function persistState(){
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
//   document.getElementById('save-dot').classList.add('saved');
//   document.getElementById('save-text').textContent='저장됨 ✓';
// }

// 교체 코드:
function persistState(){
  STATE_REF.set(state)
    .then(()=>{
      document.getElementById('save-dot').classList.add('saved');
      document.getElementById('save-text').textContent='저장됨 ✓';
    })
    .catch(err=>{
      document.getElementById('save-text').textContent='저장 실패 ⚠️';
      console.error('Firebase save error:', err);
    });
}
```

- [ ] **Step 3: `loadState()` 함수를 Firebase 초기 로드로 교체**

기존 `loadState()` 함수와 `init()` 호출부를 아래로 교체한다.

```javascript
// 기존 코드 (삭제):
// function loadState(){
//   try{ return JSON.parse(localStorage.getItem(STORAGE_KEY))||{}; }catch(e){ return {}; }
// }
// let state = Object.assign({...defaultState}, loadState());

// 교체 코드: Firebase에서 초기값 로드 후 init() 실행
const DEFAULT_STATE = {
  dist:{Elite:{SP:0,SA:0,Dist:0},Preferred:{SP:0,SA:0,Dist:0},Registered:{SP:0,SA:0,Dist:0}},
  matrix:{},revenue:{},pcs:{},profiles:{},swot:{},changes:[],totalRev:'',yoy:'',actionPlans:{}
};
let state = {...DEFAULT_STATE};

// Firebase에서 1회 로드 후 init()
STATE_REF.once('value').then(snapshot=>{
  const saved = snapshot.val();
  if(saved) state = Object.assign({...DEFAULT_STATE}, saved);
  init();
}).catch(err=>{
  console.warn('Firebase load failed, using defaults:', err);
  init();
});
```

- [ ] **Step 4: 브라우저에서 저장 동작 확인**

```
1. http://127.0.0.1:8787/admin.html 열기
2. 1.1 섹션에서 SP Elite 입력란에 숫자 입력
3. 상단 "저장됨 ✓" 표시 확인
4. Firebase 콘솔 > Realtime Database > 데이터 탭에서
   npn_state/dist/Elite/SP 값이 업데이트됐는지 확인
기대: Firebase 콘솔에 실시간으로 값이 반영됨
```

- [ ] **Step 5: 커밋**

```bash
git add mock-site/admin.html
git commit -m "feat: replace localStorage with Firebase in admin page"
```

---

## Task 3: index.html — Firebase SDK 추가 및 실시간 읽기 교체

**Files:**
- Modify: `mock-site/index.html`

- [ ] **Step 1: `<head>` 에 Firebase SDK 스크립트 추가**

`index.html`의 `</head>` 바로 앞에 삽입:

```html
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js"></script>
<script src="firebase-config.js"></script>
```

- [ ] **Step 2: `loadState()` + `renderAll()` 호출부를 Firebase 실시간 구독으로 교체**

`index.html` `<script>` 하단에서 기존 초기화 코드를 찾아 아래로 교체한다.

```javascript
// 기존 코드 (삭제):
// function loadState(){
//   try{ return JSON.parse(localStorage.getItem(STORAGE_KEY))||{}; }catch(e){ return {}; }
// }
// window.addEventListener('storage', e=>{ if(e.key===STORAGE_KEY){renderAll();...} });
// renderAll();
// setTimeout(renderPositionMap,300);

// 교체 코드: Firebase 실시간 구독
const DEFAULT_STATE = {
  dist:{Elite:{SP:0,SA:0,Dist:0},Preferred:{SP:0,SA:0,Dist:0},Registered:{SP:0,SA:0,Dist:0}},
  matrix:{},revenue:{},pcs:{},profiles:{},swot:{},changes:[],totalRev:'',yoy:'',actionPlans:{}
};

STATE_REF.on('value', snapshot=>{
  // 어드민이 Firebase에 저장할 때마다 자동으로 이 콜백 실행
  const saved = snapshot.val();
  state = saved ? Object.assign({...DEFAULT_STATE}, saved) : {...DEFAULT_STATE};
  renderAll();
  setTimeout(renderPositionMap, 300);
  document.getElementById('last-updated').textContent =
    '최종 업데이트: ' + new Date().toLocaleTimeString('ko-KR');
}, err=>{
  console.error('Firebase read error:', err);
  document.getElementById('last-updated').textContent = '데이터 로드 실패 ⚠️';
});
```

- [ ] **Step 3: `loadState()` 독립 함수 제거 확인**

`index.html`에서 `loadState()` 함수 정의가 남아 있으면 삭제한다.
`state` 변수 선언(`let state={}`)도 교체 코드의 DEFAULT_STATE 방식으로 통일됐는지 확인한다.

- [ ] **Step 4: 실시간 반영 동작 확인**

```
1. 탭 A: http://127.0.0.1:8787/admin.html
2. 탭 B: http://127.0.0.1:8787/index.html
3. 탭 A에서 FY26 총매출 입력 → 저장됨 ✓ 확인
4. 탭 B에서 자동으로 숫자가 반영되는지 확인 (새로고침 불필요)
기대: 탭 B에 1~2초 내 실시간 반영됨
```

- [ ] **Step 5: 커밋**

```bash
git add mock-site/index.html
git commit -m "feat: replace localStorage with Firebase realtime listener in public page"
```

---

## Task 4: GitHub Pages 배포 설정

**Files:**
- Create: `.github/workflows/deploy.yml`

> GitHub Pages는 `index.html`만 배포한다. `admin.html`은 로컬 전용으로 유지한다.

- [ ] **Step 1: Git 저장소 초기화 (아직 없는 경우)**

```bash
cd /Users/sangokh/Desktop/기획서
git init
git add .
git commit -m "chore: initial commit — NPN partner management project"
```

- [ ] **Step 2: GitHub에 원격 저장소 생성 및 연결**

```bash
# GitHub에서 새 저장소 생성 후 (예: nvidia-npn-partner)
git remote add origin https://github.com/<YOUR_USERNAME>/nvidia-npn-partner.git
git branch -M main
git push -u origin main
```

- [ ] **Step 3: GitHub Actions 배포 워크플로 생성**

```bash
mkdir -p .github/workflows
```

`.github/workflows/deploy.yml`에 아래 내용 저장:

```yaml
name: Deploy NPN Public Page to GitHub Pages

on:
  push:
    branches: [main]
    paths:
      - 'mock-site/index.html'
      - 'mock-site/firebase-config.js'

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Prepare deploy directory
        run: |
          mkdir -p deploy
          cp mock-site/index.html deploy/index.html
          cp mock-site/firebase-config.js deploy/firebase-config.js

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: deploy

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 4: GitHub Pages 활성화**

```
GitHub 저장소 > Settings > Pages
Source: GitHub Actions 선택 후 저장
```

- [ ] **Step 5: 배포 트리거 및 URL 확인**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Pages deploy workflow"
git push
```

```
GitHub Actions 탭에서 워크플로 실행 확인
배포 완료 후 URL: https://<YOUR_USERNAME>.github.io/nvidia-npn-partner/
기대: index.html이 Firebase에서 데이터를 읽어 정상 렌더링됨
```

---

## Task 5: Firebase 보안 규칙 강화 (선택적)

**Files:**
- 없음 (Firebase 콘솔 UI 작업)

> 운영 전 보안을 강화하고 싶다면 수행한다. 내부 운영만이라면 생략 가능.

- [ ] **Step 1: Firebase Authentication — 이메일/패스워드 활성화**

```
Firebase 콘솔 > 빌드 > Authentication > 시작하기
Sign-in method > 이메일/패스워드 > 사용 설정
```

- [ ] **Step 2: admin.html에 로그인 게이트 추가**

`admin.html` `<body>` 최상단에 로그인 모달 추가:

```html
<!-- 로그인 오버레이 -->
<div id="login-overlay" style="position:fixed;inset:0;background:var(--navy);display:flex;align-items:center;justify-content:center;z-index:9999;">
  <div style="background:#fff;padding:32px 40px;border-radius:12px;width:320px;text-align:center;">
    <div style="color:var(--green);font-size:20px;font-weight:700;margin-bottom:24px;">🔒 어드민 로그인</div>
    <input id="login-email" type="email" placeholder="이메일" style="width:100%;padding:10px;border:1.5px solid #ddd;border-radius:6px;font-family:inherit;margin-bottom:10px;font-size:14px;"/>
    <input id="login-pw" type="password" placeholder="패스워드" style="width:100%;padding:10px;border:1.5px solid #ddd;border-radius:6px;font-family:inherit;margin-bottom:16px;font-size:14px;"/>
    <button onclick="doLogin()" style="width:100%;padding:10px;background:var(--green);color:#fff;border:none;border-radius:6px;font-size:14px;font-weight:700;cursor:pointer;">로그인</button>
    <div id="login-error" style="color:#e74c3c;font-size:12px;margin-top:10px;"></div>
  </div>
</div>
```

`admin.html` `<script>` 내부에 추가:

```javascript
// 로그인 상태 감시 — 로그인 전까지 UI 숨김
firebase.auth().onAuthStateChanged(user=>{
  const overlay = document.getElementById('login-overlay');
  if(user){
    overlay.style.display='none';  // 로그인 성공 → 어드민 UI 표시
    STATE_REF.once('value').then(snapshot=>{
      const saved=snapshot.val();
      if(saved) state=Object.assign({...DEFAULT_STATE},saved);
      init();
    });
  } else {
    overlay.style.display='flex';  // 미로그인 → 오버레이 표시
  }
});

function doLogin(){
  const email=document.getElementById('login-email').value;
  const pw=document.getElementById('login-pw').value;
  firebase.auth().signInWithEmailAndPassword(email, pw)
    .catch(err=>{
      document.getElementById('login-error').textContent='로그인 실패: '+err.message;
    });
}
```

- [ ] **Step 3: Realtime Database 규칙 강화**

```json
{
  "rules": {
    ".read":  true,
    ".write": "auth != null"
  }
}
```

Firebase 콘솔 > Realtime Database > 규칙 탭에 붙여넣고 게시.

- [ ] **Step 4: Firebase Authentication에서 어드민 계정 생성**

```
Firebase 콘솔 > Authentication > 사용자 > 사용자 추가
이메일: admin@example.com / 패스워드: (강력한 패스워드 설정)
```

- [ ] **Step 5: admin.html에서 로그인 테스트**

```
1. http://127.0.0.1:8787/admin.html 열기
2. 로그인 오버레이 표시 확인
3. 올바른 이메일/패스워드 입력 → 어드민 UI 진입 확인
4. 틀린 패스워드 입력 → "로그인 실패" 메시지 확인
기대: 인증된 사용자만 데이터 입력 가능
```

- [ ] **Step 6: 커밋**

```bash
git add mock-site/admin.html
git commit -m "feat: add Firebase Authentication gate to admin page"
git push
```

---

## 셀프 리뷰 체크리스트

**스펙 커버리지**
- [x] localStorage → Firebase 교체 (admin.html Task 2, index.html Task 3)
- [x] 외부 공유 (GitHub Pages 배포 Task 4)
- [x] 실시간 반영 (`STATE_REF.on('value')` Task 3)
- [x] 어드민 인증 (Task 5 — 선택적)
- [x] firebase-config.js 분리 (Task 1)

**플레이스홀더 검사**
- 모든 코드 블록에 실제 코드 포함 ✓
- 모든 커맨드에 기대 출력 명시 ✓
- TBD/TODO 없음 ✓

**타입 일관성**
- `STATE_REF` — Task 1 `firebase-config.js`에서 정의, Task 2/3/5에서 동일 이름 사용 ✓
- `DEFAULT_STATE` — Task 2/3에서 동일 구조 사용 ✓
- `persistState()` — Task 2에서 정의, admin.html 기존 `onAnyChange()` 내부에서 호출 ✓

---

## 완료 기준

- `admin.html`에서 숫자 입력 → Firebase 콘솔에 실시간 반영
- `https://<username>.github.io/nvidia-npn-partner/` 접속 시 최신 데이터 표시
- 새로고침 없이 어드민 저장 → 공개 페이지 자동 갱신 (1~2초)
- (선택) 어드민 페이지 이메일/패스워드 인증 보호
