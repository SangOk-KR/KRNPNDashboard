# NVIDIA NPN 파트너 관리 기획서

> **작성일**: 2026-05-09
> **문서 버전**: v1.0
> **대상**: NVIDIA NPN(NVIDIA Partner Network) Solution Provider, Solution Advisor, Distributor

---

## 1. 기획 배경 및 목적

### 1.1 배경
NVIDIA Partner Network(NPN)는 SP(Solution Provider), SA(Solution Advisor), Distributor 등 다양한 파트너 유형으로 구성되어 있으며, 각 파트너는 보유 Competency와 Level에 따라 비즈니스 역량과 시장 영향력이 상이하다. 현재 파트너별 역량과 매출 기여도를 통합적으로 가시화할 체계가 부족하여, 전략적 파트너 관리와 리소스 배분에 한계가 존재한다.

### 1.2 목적
- 파트너별 **Competency × Level** 매핑을 통한 역량 기반 분류 체계 구축
- 파트너별 **Fiscal Year(FY) 단위 Competency별 매출 분석**으로 비즈니스 기여도 정량화
- 파트너별 **경쟁력 분석**을 통한 차별화 포인트 및 육성 우선순위 도출
- 데이터 기반 파트너 전략 수립 및 의사결정 지원

### 1.3 기대효과
1. 파트너 포트폴리오의 강·약점 가시화
2. Competency Gap 식별 및 육성 프로그램 연계
3. 매출 기여도 기반 파트너 리워드/투자 최적화
4. 신규 파트너 발굴 및 기존 파트너 Tier-up 전략 수립

---

## 2. 파트너 분류 체계

### 2.1 파트너 유형(Partner Type)

| 유형 | 정의 | 주요 역할 |
|------|------|----------|
| **SP (Solution Provider)** | NVIDIA 솔루션을 직접 판매·구축하는 파트너 | 영업, 기술 컨설팅, 구축, 사후지원 |
| **SA (Solution Advisor)** | 컨설팅·자문 중심의 파트너 (Non-transacting) | 솔루션 추천, 아키텍처 설계, Resell은 SP 경유 |
| **Distributor** | 총판, SP/SA에 제품 공급 및 채널 관리 | 물류, 라이선스 공급, 채널 인에이블먼트 |

### 2.2 Competency(역량 분야)
NVIDIA NPN의 주요 Competency를 다음과 같이 정의한다.

| Competency Code | 명칭 | 설명 |
|-----------------|------|------|
| **AI-COMP** | AI Computing (DGX, HGX) | 생성형 AI/LLM 학습·추론 인프라 |
| **AI-ENT** | AI Enterprise Software | NVIDIA AI Enterprise, NIM, NeMo 등 |
| **DC-COMP** | Data Center Computing | 일반 GPU 컴퓨팅, HPC |
| **NETWORK** | Networking | Spectrum, Quantum InfiniBand, BlueField DPU |
| **VIZ** | Visualization (Pro Viz) | RTX, Omniverse, Design/Simulation |
| **VIRT** | Virtual GPU (vGPU) | VDI, 가상화 워크로드 |
| **EDGE** | Edge Computing | Jetson, IGX, Industrial Edge |
| **AUTO** | Automotive | DRIVE 플랫폼 |

### 2.3 Level(역량 등급)

| Level | 기준(예시) | 혜택(예시) |
|-------|-----------|-----------|
| **Elite** | 최상위 등급 / 다수 Competency 보유 / 매출 상위 | MDF 최우선, Co-sell 우선권 |
| **Preferred** | 핵심 Competency 보유 / 안정적 매출 | MDF 지원, 기술 트레이닝 우선 |
| **Registered** | 입문 단계 / 1~2개 Competency | 기본 트레이닝, 카탈로그 접근 |

### 2.4 파트너 매핑 매트릭스(Template)

> ※ 실제 데이터는 별도 데이터셋으로 관리하며, 본 기획서는 구조 정의를 목적으로 한다.

| Partner ID | Partner Name | Type | AI-COMP | AI-ENT | DC-COMP | NETWORK | VIZ | VIRT | EDGE | AUTO |
|-----------|--------------|------|---------|--------|---------|---------|-----|------|------|------|
| P001 | (예시) Partner A | SP | Elite | Elite | Preferred | Preferred | - | Registered | - | - |
| P002 | (예시) Partner B | SA | Preferred | Preferred | - | - | Registered | - | - | - |
| P003 | (예시) Partner C | Distributor | Elite | - | Elite | Elite | Preferred | Preferred | Registered | - |

**매핑 규칙**
- 각 셀은 해당 Competency 보유 Level을 표기 (`Elite` / `Preferred` / `Registered` / `-`(미보유))
- Distributor의 경우 산하 SP/SA Coverage 범위도 함께 기록 (별도 시트)
- 매년 Q1에 NPN Portal 데이터 기준으로 갱신

---

## 3. Fiscal Year별 Competency별 매출 분석

### 3.1 분석 목적
- 파트너별로 **어느 Competency가 매출을 견인하는지** 식별
- FY 단위 추세를 통해 **성장/정체/하락 영역** 진단
- Competency Level과 실제 매출 간 **정합성 검증** (Elite인데 매출이 낮다면 원인 분석)

### 3.2 데이터 모델

**핵심 필드**
- Partner ID, Partner Name, Partner Type
- Fiscal Year (FY24, FY25, FY26 …)
- Quarter (Q1~Q4)
- Competency
- Revenue (USD, Net)
- Deal Count
- Avg Deal Size

### 3.3 분석 템플릿

#### 3.3.1 파트너별 FY별 총매출 추이
```
Partner: [Partner Name]
┌──────────┬────────┬────────┬────────┬─────────┐
│ Fiscal Y │  FY24  │  FY25  │  FY26  │ YoY %   │
├──────────┼────────┼────────┼────────┼─────────┤
│ Revenue  │   $XM  │   $XM  │   $XM  │  +X.X%  │
│ Deal Cnt │    XX  │    XX  │    XX  │  +X.X%  │
└──────────┴────────┴────────┴────────┴─────────┘
```

#### 3.3.2 파트너별 × Competency별 × FY별 매출 매트릭스

| Partner | Competency | FY24 Rev | FY25 Rev | FY26 Rev | CAGR | Mix(FY26) |
|---------|------------|----------|----------|----------|------|-----------|
| Partner A | AI-COMP | $X.XM | $X.XM | $X.XM | XX% | XX% |
| Partner A | AI-ENT | $X.XM | $X.XM | $X.XM | XX% | XX% |
| Partner A | DC-COMP | $X.XM | $X.XM | $X.XM | XX% | XX% |
| ... | ... | ... | ... | ... | ... | ... |

#### 3.3.3 핵심 지표(KPI)
1. **YoY Growth Rate** : (FY(N) – FY(N-1)) / FY(N-1)
2. **Revenue Mix per Competency** : 파트너 내 Competency 매출 비중
3. **Competency Concentration (HHI)** : 매출 집중도(다각화 vs 편중)
4. **Level-Revenue Alignment Score** : Level 대비 매출 분위 정합성
5. **Avg Deal Size 추이** : 거래 대형화/소형화 추세

### 3.4 시각화 권장(대시보드)
- 히트맵: Partner × Competency 매출 강도
- 스택바: FY별 Competency Mix
- 라인: FY별 YoY Growth (Top 10 파트너)
- 산점도: Level(X) vs Revenue(Y) — 이상치 탐지

---

## 4. 파트너별 경쟁력 분석

### 4.1 분석 프레임워크
파트너의 경쟁력을 **5개 축**으로 평가한다.

| 축 | 설명 | 측정 지표(예) |
|----|------|--------------|
| **C1. Competency Coverage** | 보유 Competency 폭 | 보유 Competency 수, Elite 비중 |
| **C2. Revenue Performance** | 매출 규모 및 성장성 | FY 매출, YoY, CAGR |
| **C3. Technical Capability** | 인증 엔지니어/전문가 수 | NCP, NCA 보유자, Lab 보유 |
| **C4. Market Reach** | 영업 커버리지 | 산업/지역 커버리지, 신규 고객 수 |
| **C5. Strategic Alignment** | NVIDIA 전략과의 정합성 | 신제품 채택 속도, GTM 협업도 |

### 4.2 평가 모델
각 축을 1~5점 척도로 평가하고 가중 평균을 산출 → **Partner Competitiveness Score (PCS)**.

```
PCS = w1·C1 + w2·C2 + w3·C3 + w4·C4 + w5·C5
(기본 가중치 예: 0.20 / 0.30 / 0.20 / 0.15 / 0.15)
```

### 4.3 SWOT 분석 템플릿(파트너 단위)

```
┌───────────────────────┬───────────────────────┐
│ Strengths             │ Weaknesses            │
│ - 어느 Competency      │ - 부족한 Competency    │
│   에서 강한가?         │ - Level 대비 저성과     │
│ - 차별화 자산          │   영역                 │
├───────────────────────┼───────────────────────┤
│ Opportunities         │ Threats               │
│ - 신규 Competency      │ - 경쟁 파트너의 약진    │
│   진입 가능성          │ - 시장/기술 변화        │
│ - 미개척 산업/지역     │ - 인력 이탈 리스크      │
└───────────────────────┴───────────────────────┘
```

### 4.4 포지셔닝 맵
**X축**: Competency Coverage (보유 폭) / **Y축**: Revenue Performance (매출 규모)
- **1사분면 (Star)**: 폭넓은 역량 + 높은 매출 → 전략적 파트너, 공동 GTM 우선
- **2사분면 (Specialist)**: 좁은 역량 + 높은 매출 → 특정 영역 챔피언, 심화 투자
- **3사분면 (Emerging)**: 좁은 역량 + 낮은 매출 → 육성 후보, 트레이닝 집중
- **4사분면 (Wide-Underperform)**: 넓은 역량 + 낮은 매출 → 활성화 필요, 원인 진단

### 4.5 경쟁사 대비 벤치마킹
동일 Type/Region 내 파트너 그룹을 기준으로 백분위를 산출한다.

| 지표 | 파트너 값 | 그룹 중앙값 | 백분위 | 평가 |
|------|----------|------------|--------|------|
| FY26 Revenue | $XM | $XM | XX% | ↑/↓ |
| Elite Competency 수 | X | X | XX% | ↑/↓ |
| 인증 엔지니어 수 | X | X | XX% | ↑/↓ |
| YoY Growth | X% | X% | XX% | ↑/↓ |

---

## 5. 실행 계획(Roadmap)

### Phase 1. 데이터 정합화 (M+1 ~ M+2)
- NPN Portal, CRM(Salesforce), ERP 매출 데이터 연동
- 파트너 마스터 정비 (중복/이관/M&A 반영)
- Competency-Level 스냅샷 확보

### Phase 2. 매핑 & 분석 모델 구축 (M+2 ~ M+4)
- Partner × Competency × Level 매트릭스 완성
- FY별 Competency 매출 데이터 마트 구축
- PCS(Partner Competitiveness Score) 산식 확정 및 검증

### Phase 3. 대시보드 & 리포트 (M+4 ~ M+5)
- BI 대시보드 (Tableau/Power BI) 배포
- 파트너별 1-pager 리포트 자동화

### Phase 4. 운영 & 거버넌스 (M+5 이후)
- 분기별 파트너 리뷰(QBR)에 분석 결과 활용
- 연 1회 Tier 재산정 및 육성 계획 갱신
- 파트너 자율 조회 포털 구축 검토

---

## 6. 거버넌스 및 R&R

| 역할 | 담당 | 책임 |
|------|------|------|
| Sponsor | 채널 총괄 | 의사결정 및 예산 승인 |
| PMO | 파트너 운영팀 | 일정·산출물 관리 |
| Data Lead | BI/Analytics팀 | 데이터 모델·대시보드 |
| Partner Lead | PAM(Partner Account Manager) | 파트너 데이터 검증, QBR |
| Tech Lead | Solution Architect | Competency 평가 |

---

## 7. 리스크 및 대응

| 리스크 | 영향 | 대응 방안 |
|--------|------|----------|
| 매출 데이터 정합성 부족 | 분석 신뢰도 저하 | 데이터 거버넌스 룰 수립, 정기 클렌징 |
| Competency 정의 변경(NVIDIA 본사) | 매핑 재작업 | 본사 NPN 정책 변경 모니터링 채널 운영 |
| 파트너 M&A/이관 | 시계열 단절 | 파트너 ID 매핑 이력 관리(SCD Type-2) |
| 민감 매출 정보 노출 | 컴플라이언스 이슈 | 권한별 데이터 마스킹, 접근 통제 |

---

## 8. 부록(Appendix)

### A. 용어 정의
- **NPN**: NVIDIA Partner Network
- **SP / SA / Distributor**: 본문 2.1 참조
- **Competency**: NVIDIA가 정의한 파트너 전문 분야
- **PCS**: Partner Competitiveness Score (본 기획서에서 정의)

### B. 참고 산출물
- 파트너 매핑 매트릭스 (Excel)
- FY별 Competency 매출 데이터 마트 (DB / BI)
- 파트너 1-pager 리포트 (PDF, 자동 생성)

### C. 향후 확장 검토
- End-Customer 단위까지 분해한 매출 분석
- Competency × 산업(Vertical) 매트릭스 추가
- 파트너 Health Score(이탈/리스크 예측 모델) 연계
