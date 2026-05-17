# 프레시밀크 (FreshMilk) — Company Website

> 경계를 허물고, 시장에서 가능성을 찾는 팀.
> *기술과 콘텐츠의 트렌드를 융합해 사람들에게 즐거움을 전합니다.*

프레시밀크 회사 소개 정적 웹사이트입니다.
디자인 컨셉은 **LIVE LAB** — 명함 톤의 단정함은 유지하되, 실험실/라이브 콘텐츠 룸의 시그니처 디테일로 회사 정체성을 시각화합니다.

---

## 기술 스택

- 순수 HTML5 + CSS3 + Vanilla JS (빌드 도구 없음)
- 폰트: [Pretendard](https://github.com/orioncactus/pretendard) (CDN) + JetBrains Mono
- 호스팅: GitHub → Vercel

## 섹션 구성 (7섹션 단일 페이지)

1. **Hero** — H1 + EXP INDEX (4개 프로젝트) + 상하 마키
2. **About** — 미션 / 비전 / 한 줄 스토리 + 숫자 카드
3. **How we work** — Core Values 3 + Code of Conduct 6
4. **Projects** — 스토릿(메인) + tolli / 픽토리 / econoup
5. **Team** — 김강산 (CEO) / 김동신 (기획팀장)
6. **Lab Notes** — 풀블리드 마젠타 placeholder (`EXP LOG — INCOMING.`)
7. **Contact** — 메일 / 주소 / 전화

## 디렉터리 구조

```
freshmilk/
  index.html                # 메인 7섹션
  404.html                  # 커스텀 404
  robots.txt
  sitemap.xml
  vercel.json
  README.md
  assets/
    logo.png                # 워드마크
    businesscard.png        # 명함 마스터 (사이트엔 미사용)
    css/  reset.css, tokens.css, marquee.css, main.css
    js/   i18n.js, main.js, nav.js, cursor.js
    img/  favicon.svg, og-image.svg, grid-paper.svg, noise.svg,
          team/{kgsan,kdshin}.svg
          projects/{storit,tolli,picktory,econoup}.svg
  i18n/
    ko.json
    en.json
```

## 로컬 실행

`fetch()` 기반의 i18n 로드 때문에 정적 서버가 필요합니다.

```bash
# Python 3
python -m http.server 5500

# Node (선택)
npx serve -p 5500
```

브라우저에서 `http://localhost:5500` 접속.
또는 VSCode의 Live Server 확장을 추천.

## 콘텐츠 / 번역 편집

- 모든 노출 텍스트는 [i18n/ko.json](i18n/ko.json) / [i18n/en.json](i18n/en.json) 의 key-value 로 관리됩니다.
- HTML 안에서는 `data-i18n="섹션.키"` 속성으로 매핑됩니다.
- 영문은 핵심 카피만 1차 번역, 본문은 우선 한국어 유지 → 점진적으로 보강.

## Vercel 배포

1. GitHub 저장소에 푸시
2. [vercel.com](https://vercel.com) → **Add New… → Project** → GitHub repo import
3. 빌드 설정
   - Framework Preset: **Other**
   - Root Directory: 그대로
   - Build Command: (비움)
   - Output Directory: (비움)
4. **Deploy** 클릭
5. Settings → Domains 에서 `freshmilk.kr` / `www.freshmilk.kr` 추가
6. 도메인 등록기관에서 Vercel이 안내하는 A / CNAME 레코드 입력

## 라이선스

© 2026 FreshMilk. All rights reserved.
