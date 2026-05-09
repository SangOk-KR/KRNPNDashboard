# NVIDIA NPN 파트너 관리 기획서 — 프로젝트 컨텍스트

> 이 파일은 Claude가 이 프로젝트를 이어서 작업할 때 참고하는 컨텍스트 문서입니다.
> 최초 작성: 2026-05-09

---

## 프로젝트 개요

**목적**: 한국 NVIDIA NPN(NVIDIA Partner Network) 파트너(SP·SA·Distributor)를 대상으로 Competency 매핑, FY별 매출 분석, 경쟁력 분석을 통합 관리하는 기획서와 도구 세트를 구축한다.

**주요 활용처**
- 내부 전략·운영팀 (PAM, 채널 총괄)
- 파트너 QBR(분기 리뷰) 자료 공유
- 경영진 보고

---

## 파일 구조

```
기획서/
├── CLAUDE.md                              ← 이 파일 (프로젝트 컨텍스트)
├── NVIDIA_NPN_파트너_관리_기획서.md        ← 초안 v1.0 (참고용)
├── NVIDIA_NPN_파트너_관리_기획서_v2.md    ← 최종 기획서 (메인 문서)
├── NVIDIA_NPN_파트너_관리_기획서_v2.docx  ← Word 변환본
├── NVIDIA_NPN_파트너_관리_기획서_v2.xlsx  ← Excel 분석 도구
│   ├── 시트1: 1.3_매출추이분석
│   └── 시트2: 히트맵_Revenue
├── convert_to_docx.py                     ← MD → DOCX 변환 스크립트
├── create_excel.py                        ← Excel 생성 스크립트
└── mock-site/
    ├── index.html                         ← 일반 페이지 (read-only, 공개용)
    ├── admin.html                         ← 어드민 페이지 (입력 전용)
    └── serve.py                           ← 로컬 개발 서버 (port 8787)
```

---

## 핵심 도메인 지식

### 파트너 유형 (Partner Type)
| Type | 정의 | Transacting |
|------|------|-------------|
| SP (Solution Provider) | 직접 판매·구축 | O |
| SA (Solution Advisor) | 컨설팅·자문, Non-transacting | X |
| Distributor | 총판, 채널 관리 | O |

### Competency 8개
```
AI-COMP  : DGX, HGX, BasePOD — 생성형 AI/LLM 학습·추론 인프라
AI-ENT   : NVIDIA AI Enterprise, NIM, NeMo, Morpheus
DC-COMP  : 일반 GPU 컴퓨팅, HPC 클러스터
NETWORK  : Spectrum-X, Quantum InfiniBand, BlueField DPU
VIZ      : RTX Pro, Omniverse, 디지털트윈
VIRT     : vGPU, VDI, NVAIE 가상화
EDGE     : Jetson, IGX Orin, Industrial Edge AI
AUTO     : DRIVE Orin, DRIVE Thor
```

### Level 3단계
```
Elite      ★★★  : 최상위. MDF 최우선, Co-sell 우선권, Exec Access
Preferred  ★★   : 핵심 역량 보유. MDF 지원, 트레이닝 우선
Registered ★    : 입문. 기본 트레이닝, 카탈로그 접근
```

### PCS (Partner Competitiveness Score) 모델
```
PCS = 0.20 × C1 + 0.30 × C2 + 0.20 × C3 + 0.15 × C4 + 0.15 × C5

C1. Competency Coverage  (20%) : 보유 Comp 수, Elite 비중
C2. Revenue Performance  (30%) : FY 매출, YoY, CAGR
C3. Technical Capability (20%) : NCP/NCA 보유자, Lab 유무
C4. Market Reach         (15%) : 산업·지역 커버리지
C5. Strategic Alignment  (15%) : 신제품 채택속도, GTM 협업도

등급: S(≥4.0) / A(≥3.0) / B(≥2.0) / C(<2.0)
```

### 매출 KPI
```
FY Revenue     : Fiscal Year Net Revenue (USD)
Deal Count     : FY 내 클로즈된 딜 수
YoY Growth     : (FY(N) - FY(N-1)) / FY(N-1) × 100
CAGR           : (FY마지막/FY첫해)^(1/기간) - 1
Avg Deal Size  : Revenue / Deal Count
Competency Mix : 특정 Comp 매출 / 파트너 전체 매출
HHI            : Σ(각 Comp 비중²) — 1=완전집중, 0.125=완전분산
```

---

## 기획서 v2 문서 구조

```
Part 1. 포트폴리오 전체 요약      ← 경영진 보고용
  1.1 파트너 현황 스냅샷          (Type×Level 분포, 변동사항)
  1.2 Competency × Level 매트릭스 (전체 파트너 비교)
  1.3 FY별 Competency 매출 요약   (히트맵, 인사이트)
  1.4 경쟁력 포지셔닝 맵          (2×2: Coverage × Revenue)

Part 2. 분석 프레임워크           ← 방법론 정의
  2.1 파트너 분류 기준
  2.2 매출 분석 KPI 정의
  2.3 PCS 평가 모델 (5축 + 가중치 + 점수 기준표)

Part 3. 파트너별 상세 프로파일    ← QBR / 파트너 공유용
  블록 A: 기본 정보 & Competency 매핑
  블록 B: FY별 Competency별 매출 분석
  블록 C: PCS 평가 + 그룹 벤치마킹 + SWOT
  블록 D: 액션 플랜 (육성과제, 투자 우선순위, FY27 목표)
```

---

## Excel 파일 (`_v2.xlsx`) 상세

### 시트 1: `1.3_매출추이분석`
- **입력**: C~E열 (FY24/FY25/FY26 Revenue, USD 단위 — 천 달러)
- **자동 계산**: CAGR = `(FY26/FY24)^(1/2) - 1`, Mix% = 각 FY 합계 대비 비율
- **조건부 서식**: CAGR (빨강→노랑→초록), FY26 Mix% (흰색→NVIDIA 그린)

### 시트 2: `히트맵_Revenue`
- **입력**: 각 파트너 × Competency 셀에 FY26 Net Revenue 입력
- **자동 계산**: 파트너 합계(행), Competency 합계(열)
- **조건부 서식**: 0=흰색, 최대값=NVIDIA 그린 (#76B900)

---

## Mock 웹사이트 (`mock-site/`)

### 실행 방법
```bash
python3 mock-site/serve.py
# → http://127.0.0.1:8787
```

### 페이지 구분
| 페이지 | URL | 권한 |
|--------|-----|------|
| 일반 (공개) | `/index.html` | 읽기 전용 |
| 어드민 | `/admin.html` | 입력·수정 가능 |

### 데이터 흐름
```
어드민(admin.html)
  → 입력 즉시 localStorage('nvidia_npn_v2')에 JSON 저장
  → storage 이벤트 발생
일반(index.html)
  → storage 이벤트 수신 시 자동 re-render
  → 동일 브라우저 내 실시간 반영
```

### localStorage 키 구조
```json
{
  "dist":        { "Elite": {"SP":0,"SA":0,"Dist":0}, ... },
  "matrix":      { "p1_AI-COMP": "Elite", ... },
  "revenue":     { "AI-COMP_FY24": 5000, ... },
  "pcs":         { "p1": {"c1":4,"c2":3.5,"c3":4,"c4":3,"c5":3.5} },
  "profiles":    { "p1": {"pam":"홍길동","rev26":12000,...} },
  "swot":        { "p1": {"s":"강점...","w":"약점...","o":"기회...","t":"위협..."} },
  "changes":     [ {"type":"Tier-up","name":"Partner A","desc":"...","date":"FY26 Q1"} ],
  "actionPlans": { "p1": [{"task":"...","goal":"...","due":"...","owner":"...","status":"진행 중"}] },
  "totalRev":    "120",
  "yoy":         "15"
}
```

### 파트너 목록 (현재 8개 예시)
```
p1: Partner A (SP)      p2: Partner B (SP)
p3: Partner C (SP)      p4: Partner D (SP)
p5: Partner E (SA)      p6: Partner F (SA)
p7: Partner G (Dist)    p8: Partner H (Dist)
```
> 실제 파트너로 교체 시 `admin.html`과 `index.html`의 `PARTNERS` 배열을 동시에 수정

---

## 외부 공유 이슈 및 미완성 작업

### 현재 한계
- localStorage는 **같은 브라우저·같은 도메인 내에서만** 공유됨
- GitHub Pages에 `index.html`을 올려도 어드민 데이터가 반영되지 않음

### 외부 공유를 위한 권장 방향: Firebase 연동
```
[어드민 - 내 PC]  →  Firebase Realtime Database  →  [GitHub Pages]
                                                   외부 사용자 실시간 열람 가능
```

**필요한 작업**:
1. Firebase 프로젝트 생성 (무료 Spark 플랜)
2. `admin.html` — `localStorage.setItem()` → `firebase.database().ref().set()` 으로 교체
3. `index.html` — `localStorage.getItem()` → `firebase.database().ref().on('value')` 로 교체
4. `index.html`을 GitHub Pages에 배포

---

## 스타일 가이드 (웹사이트)

```css
/* 주요 색상 */
--green:      #76B900;  /* NVIDIA 그린 — 주요 포인트 */
--navy:       #1A1A2E;  /* 짙은 네이비 — 헤더, 테이블 헤더 */
--admin:      #e74c3c;  /* 빨강 — 어드민 전용 입력 필드 테두리 */
--gray-100:   #f7f8fa;  /* 배경 */

/* 폰트 */
font-family: 'Noto Sans KR', sans-serif;
```

---

## 변환 스크립트 사용법

### MD → DOCX
```bash
python3 convert_to_docx.py
# 입력: NVIDIA_NPN_파트너_관리_기획서_v2.md
# 출력: NVIDIA_NPN_파트너_관리_기획서_v2.docx
```

### Excel 재생성
```bash
python3 create_excel.py
# 출력: NVIDIA_NPN_파트너_관리_기획서_v2.xlsx (시트 2개)
# 의존성: pip install openpyxl
```

---

## 다음 작업 후보

- [ ] Firebase 연동으로 외부 공유 지원
- [ ] 실제 파트너명·데이터로 PARTNERS 배열 교체
- [ ] PCS 가중치 조정 (비즈니스 요구에 따라)
- [ ] 파트너 추가/삭제 기능 (어드민 UI)
- [ ] Excel에 분기(Q1~Q4)별 매출 시트 추가
- [ ] 포지셔닝 맵 사분면 레이블 상세화
- [ ] 기획서 v2.md에 실데이터 입력 후 PDF 배포본 생성
