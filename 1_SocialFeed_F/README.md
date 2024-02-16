# 소셜 미디어 통합 Feed 서비스 과제 (F팀)

인스타그램, 스레드, 페이스북, 트위터 등의 SNS에 게시된 게시글을 한 곳에서 확인하는 소셜 미디어 통합 Feed 서비스

## 목차

-   [개요](#개요)
-   [기술 스택](#기술-스택)
-   [실행 스크립트](#실행-스크립트)
-   [API 명세](#api-명세)
-   [프로젝트 진행 및 이슈 관리](#프로젝트-진행-및-이슈-관리)
-   [구현과정(설계 및 의도)](#구현과정설계-및-의도)
-   [TIL](#til)
-   [팀원](#팀원)

## 개요

소셜 미디어 통합 Feed 서비스란?

-   인스타그램, 스레드, 페이스북, 트위터 등 다양한 SNS에 게시된 게시글 중 유저의 해시태그(유저 계정)가 포함된 게시글들을 한 곳에서 확인할 수 있는 서비스입니다.
-   이 서비스를 통해 유저는 자신의 계정이 해시태그로 포함된, 다양한 SNS의 게시글들을 확인할 수 있으며 다른 해시태그나 게시글을 검색할 수 있습니다.
-   또한 해시태그가 포함된 게시글들의 다양한 통계 정보를 확인할 수 있습니다.

## 기술 스택

언어 및 프레임워크: ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)</br>
데이터베이스: ![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)</br>
개발환경: ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)</br>

## 실행 스크립트

```bash
# docker 빌드
npm run build:docker

# docker 실행
npm run start:docker
```

## API 명세

API 명세를 작성한 노션 페이지 링크입니다.

[![Notion](https://img.shields.io/badge/Notion-%23000000.svg?style=for-the-badge&logo=notion&logoColor=white)](https://www.notion.so/API-2c91aa8513504173aca4997cc1abcdd2?pvs=4)🔗</br>

## 프로젝트 진행 및 이슈 관리

프로젝트 진행 및 이슈 관리를 작성한 타임보드 노션 페이지 링크입니다.

[![Notion](https://img.shields.io/badge/Notion-%23000000.svg?style=for-the-badge&logo=notion&logoColor=white)](https://www.notion.so/22e476d775c34931905f1155d33945ff?v=4ed5e40b48234a42919d46436dd06c3f&pvs=4)🔗</br>

## 구현과정(설계 및 의도)

팀원 별로 작성한 구현과정에 대한 노션 페이지 링크입니다.

[회원가입 및 게시물 목록 구현 과정🔗](https://www.notion.so/0ebcd353eefc423c8483149aa340786f?pvs=4)</br>
[기여 업무 개요🔗](https://www.notion.so/0a0e96c247e549a29c54c05e19eff271?pvs=4)</br>
[엔티티 설계 및 게시물 작성, 상세조회 API 설계🔗](https://www.notion.so/API-5e41b73a93f44034aca207d46ba97930?pvs=4)</br>
[요청 실패 시 공통 응답 형식을 반환하는 필터 구현🔗](https://www.notion.so/93d83ac32ba649ae9f699bbe99df40bd?pvs=4)</br>

## TIL

프로젝트를 진행하며 작성했던 TIL을 서로 공유할 수 있도록 노션 페이지에 정리하였습니다.

[![Notion](https://img.shields.io/badge/Notion-%23000000.svg?style=for-the-badge&logo=notion&logoColor=white)](https://www.notion.so/ce558ed53c1e46d38f34d66cb0a55087?v=8d07b98179a448ceb5e2e32284ceb906&pvs=4)🔗</br>

## 팀원

<div align="center">

</br>

![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white) </br>

<table>
   <tr>
     <td colspan='4' align="center">
     </td>
   </tr>
   <tr>
    <td align="center"><b><a href="https://github.com/cabbage556">김태윤🔗</a></b></td>
    <td align="center"><b><a href="https://github.com/developersomin">안소민🔗</a></b></td>
    <td align="center"><b><a href="https://github.com/haeseung123">이해원🔗</a></b></td>
    <td align="center"><b><a href="https://github.com/DevJayKR">최준성🔗</a></b></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/cabbage556"><img src="https://avatars.githubusercontent.com/u/56855262?v=4" width="80px" /></a>
    <td align="center"><a href="https://github.com/developersomin"><img src="https://avatars.githubusercontent.com/u/127207131?v=4" width="80px" /></a></td>
    <td align="center"><a href="https://github.com/developersomin"><img src="https://avatars.githubusercontent.com/u/106800437?v=4" width="80px" /></a></td>
    <td align="center"><a href="https://github.com/developersomin"><img src="https://avatars.githubusercontent.com/u/106816875?v=4" width="80px" /></a></td>
  </tr>
</table>

</div>
<br/>
