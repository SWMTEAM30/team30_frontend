# 🎨 The First Take - LLM 기반 개인 맞춤형 스타일 큐레이션 플랫폼

**"패션을 잘 알지 못하는 2030 세대를 위해, 단 하나의 완벽한 옷을 찾아주는 AI 스타일리스트"**

[![React](https://img.shields.io/badge/React-Next.js-blue?style=for-the-badge&logo=react)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TanStack Query](https://img.shields.io/badge/-TanStack%20Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)](https://tanstack.com/query/latest)
[![Jotai](https://img.shields.io/badge/Jotai-000000?style=for-the-badge&logo=jotai&logoColor=white)](https://jotai.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> 본 프로젝트는 **소프트웨어 마에스트로 16기 연수 과정**의 일환으로 진행되었습니다.

---

## 🧐 About The Project

`The First Take`는 정보 과부하와 비효율적인 탐색 과정에 지친 2030 세대를 위한 AI 기반 패션 큐레이션 플랫폼입니다. 사용자는 더 이상 수많은 쇼핑몰을 헤매며 끝없이 스크롤할 필요가 없습니다.

LLM 기반의 대화형 인터페이스를 통해 사용자의 체형, 취향, TPO(시간, 장소, 상황) 등 미묘하고 복합적인 니즈를 파악하고, 벡터 유사도 기반 추천 시스템을 통해 단 하나의 가장 적합한 아이템을 **명확한 추천 이유**와 함께 제안합니다. 사용자의 피드백을 실시간으로 반영하여 추천의 정확도를 높여가는, 당신만을 위한 개인 AI 스타일리스트를 경험해보세요.

---

## ✨ Key Features

- **🤖 LLM 기반 대화형 인터페이스**: 복잡한 필터 대신, AI와의 자연스러운 대화를 통해 원하는 스타일을 찾아갑니다.
- **🎯 정밀한 개인 맞춤 추천**: 사용자의 체형, 취향, TPO, 심지어 보유한 기본 아이템까지 고려하여 최적의 아이템을 추천합니다.
- **✍️ 명확한 추천 이유 제시**: "왜 이 옷을 추천했는지"에 대한 구체적인 이유를 설명하여 사용자의 구매 결정에 확신을 더합니다.
- **🔄 실시간 피드백 반영**: 추천 결과에 대한 사용자의 피드백을 즉각적으로 반영하여, 대화가 이어질수록 더욱 정교해지는 재추천 시스템을 제공합니다.
- **📚 패션 위키 자동 생성**: 대화에 등장하는 패션 용어(예: '아메카지', '고프코어')에 대한 설명과 이미지를 담은 위키 페이지를 AI가 자동으로 생성하여 콘텐츠를 확장합니다.
- **📱 하이브리드 앱 지원**: Capacitor를 통해 웹 프로젝트를 안드로이드 앱으로 패키징하여, 모바일 환경에서도 최적의 사용자 경험을 제공합니다.

---

## 🛠️ Tech Stack

### **Frontend**

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **State Management**:
  - **Server State**: TanStack Query
  - **Client State**: Jotai
- **Styling**: Tailwind CSS, shadcn/ui
- **CI/CD**: GitHub Actions, AWS EC2, PM2

### **Backend & AI**

- **Backend**: Spring, PostgreSQL, Redis
- **AI**: FastAPI, LangChain, LangGraph, MongoDB
