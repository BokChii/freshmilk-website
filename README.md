# 프레시밀크 (FreshMilk) — Company Website

> 스토릿을 중심으로, 매일 찾게 만드는 콘텐츠 제품을 실험하는 포항의 스튜디오.

프레시밀크 회사 소개 정적 웹사이트입니다.

---

## 기술 스택

- 순수 HTML5 + CSS3 + Vanilla JS (빌드 도구 없음)
- 폰트: [Pretendard](https://github.com/orioncactus/pretendard) (CDN) + JetBrains Mono
- 호스팅: GitHub → Vercel

## 섹션 구성 (단일 페이지)

1. **Hero** — H1 + trust bar + CTA
2. **About** — 미션 / 비전 / 스토리 + 원칙 3 + timeline
3. **Projects** — 스토릿(메인) + tolli / 픽토리 + econoup 티저
4. **Team** — 김강산 (CEO) / 김동신 (기획)
5. **Updates** — 최근 소식 3건
6. **Contact** — 대표 메일 + 문의 유형 + 주소
7. **Footer** — 사업자 정보

## 디렉터리 구조

```
freshmilk/
  index.html
  404.html
  robots.txt
  sitemap.xml
  vercel.json
  README.md
  assets/
    css/  reset.css, tokens.css, main.css
    js/   i18n.js, main.js, nav.js, cursor.js
    img/  favicon.svg, og-image.svg, team/, projects/
  i18n/
    ko.json
    en.json
```

## 로컬 실행

`fetch()` 기반 i18n 로드 때문에 정적 서버가 필요합니다.

```bash
python -m http.server 5500
# http://localhost:5500
```

## 콘텐츠 편집

- 모든 노출 텍스트: [i18n/ko.json](i18n/ko.json) / [i18n/en.json](i18n/en.json)
- HTML: `data-i18n`, `data-i18n-html`, `data-i18n-attr`

## Vercel 배포

1. GitHub 저장소에 푸시
2. [vercel.com](https://vercel.com) → Import Project
3. Framework Preset: **Other** (빌드 명령 없음)
4. Domains: `freshmilk.kr`

## 라이선스

© 2026 FreshMilk. All rights reserved.
