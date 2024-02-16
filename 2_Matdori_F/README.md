# 위치 기반 맛집 추천 및 맛집 조회 웹 서비스 (F팀)

위치 기반 맛집 추천 및 맛집 조회 서비스

## 목차

-   [개요](#개요)
-   [기술 스택](#기술-스택)
-   [실행 방법](#실행-방법)
-   [프로젝트 구조](#프로젝트-구조)
-   [요구사항 분석](#요구사항-분석)
-   [프로젝트 설계](#프로젝트-설계)
-   [협업 도구](#협업-도구)
-   [프로젝트 진행 및 이슈 관리](#프로젝트-진행-및-이슈-관리)
-   [구현 과정](#구현-과정)
-   [TIL](#til)
-   [팀원](#팀원)

## 개요

위치 기반 맛집 추천 및 맛집 조회 서비스란?

-   데이터 파이프라인을 구축해 공공데이터(오픈API)를 활용하여 지역 음식점 목록을 가져오고 업데이트합니다.
-   유저는 유저 위치 반경 500미터 이내의 맛집을 랜덤으로 추천받을 수 있습니다.
-   유저는 유저 위치 기반 검색 또는 지정한 위치 기반 검색으로 다양한 맛집들의 정보를 조회할 수 있습니다.

## 기술 스택

-   언어 및 프레임워크: ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)</br>
-   데이터베이스: ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)</br>
-   개발환경: ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)</br>

## 실행 방법

```bash
# docker 빌드
npm run docker:build

# docker 실행
npm run docker:start
```

도커 실행 시 루트 디렉터리에 .development.env 파일이 필요합니다. .development.env 파일에 필요한 환경 변수는 다음과 같습니다.

<details>
<summary> 환경 변수 보기 </summary>

```
SERVER_PORT=

POSTGRESQL_USER=
POSTGRESQL_PASSWORD=
POSTGRESQL_HOST=
POSTGRESQL_PORT=
POSTGRESQL_DATABASE=
POSTGRESQL_SYNCHRONIZE=
POSTGRESQL_LOGGING=

# jwt
JWT_ACCESS_SECRET_KEY=
JWT_ACCESS_EXPIRATION_TIME=
JWT_REFRESH_SECRET_KEY=
JWT_REFRESH_EXPIRATION_TIME=

# open api
OPEN_API_JAPANESE_FOOD_URL=
OPEN_API_CHINESE_FOOD_URL=
OPEN_API_KOREAN_FOOD_URL=

JAPANESE_FOOD_AUTH_KEY=
CHINESE_FOOD_AUTH_KEY=
KOREAN_FOOD_AUTH_KEY=

# redis
REDIS_PORT=
REDIS_HOST=
REDIS_INSIGHT_PORT=

# discord webwook
DISCODE_WEBHOOK_URL=
```

</details>

## 프로젝트 구조

프로젝트 구조는 NestJS 모듈을 기준으로 구성했습니다.

<details>
<summary> 프로젝트 구조 보기 </summary>

```
2_Matdori_F
├── DockerFile
├── README.md
├── citys.csv
├── docker-compose.yaml
├── nest-cli.json
├── package-lock.json
├── package.json
├── src
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── auth
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   └── strategy
│   │       ├── access.token.strategy.ts
│   │       └── refresh.token.strategy.ts
│   ├── cache
│   │   ├── cache.module.ts
│   │   └── cache.service.ts
│   ├── citys
│   │   ├── citys.controller.ts
│   │   ├── citys.module.ts
│   │   ├── citys.service.ts
│   │   ├── constants
│   │   │   └── citys-cache.constants.ts
│   │   ├── entity
│   │   │   └── city.entity.ts
│   │   ├── enums
│   │   │   └── city-response.enum.ts
│   │   └── interceptors
│   │       └── citys-cache.interceptor.ts
│   ├── database
│   │   └── database.module.ts
│   ├── global
│   │   ├── configs
│   │   │   ├── jwt.configuration.ts
│   │   │   ├── open-api.configuration.ts
│   │   │   ├── redis.configuration.ts
│   │   │   ├── validation.schema.ts
│   │   │   └── webhook.configuration.ts
│   │   ├── decorators
│   │   │   ├── get-user.decorator.ts
│   │   │   └── response-key.decorator.ts
│   │   ├── entities
│   │   │   ├── base.entity.ts
│   │   │   └── open-api-raws.entity.ts
│   │   ├── enums
│   │   │   ├── business-state.enum.ts
│   │   │   ├── category.enum.ts
│   │   │   └── exception-obj-error.enum.ts
│   │   ├── filters
│   │   │   ├── http-exception.filter.ts
│   │   │   └── jwt-exception.filter.ts
│   │   ├── guard
│   │   │   ├── access.token.guard.ts
│   │   │   └── refresh.token.guard.ts
│   │   ├── interceptors
│   │   │   └── transform.interceptor.ts
│   │   ├── interfaces
│   │   │   ├── exception.obj.ts
│   │   │   ├── lat-lon-to-km.interface.ts
│   │   │   └── token.payload.ts
│   │   ├── tuples
│   │   │   └── point.tuple.ts
│   │   └── utils
│   │       ├── get-enum-keys.ts
│   │       └── lat-lon-to-km.ts
│   ├── main.ts
│   ├── rating
│   │   ├── classes
│   │   │   ├── rating.exception.message.ts
│   │   │   └── rating.response.message.ts
│   │   ├── dto
│   │   │   └── create-rating.dto.ts
│   │   ├── entity
│   │   │   └── rating.entity.ts
│   │   ├── rating.controller.ts
│   │   ├── rating.module.ts
│   │   └── rating.service.ts
│   ├── recommend
│   │   ├── classes
│   │   │   └── recommend.response.message.ts
│   │   ├── interfaces
│   │   │   └── user-locations.interface.ts
│   │   ├── recommend.controller.ts
│   │   ├── recommend.module.ts
│   │   └── recommend.service.ts
│   ├── restaurants
│   │   ├── constants
│   │   │   └── restaurants-cache.constants.ts
│   │   ├── dto
│   │   │   ├── get-posts.dto.ts
│   │   │   ├── page-meta.dto.ts
│   │   │   └── page.dto.ts
│   │   ├── entity
│   │   │   └── restaurant.entity.ts
│   │   ├── enums
│   │   │   ├── restaurant-category.enum.ts
│   │   │   ├── restaurant-exception.enum.ts
│   │   │   ├── restaurant-query.enum.ts
│   │   │   └── restaurant-response.enum.ts
│   │   ├── interceptors
│   │   │   └── restaurants-cache.interceptor.ts
│   │   ├── interfaces
│   │   │   └── page-meta-dto-params.interface.ts
│   │   ├── pipes
│   │   │   └── custom-parse-uuid.pipe.ts
│   │   ├── restaurants.controller.ts
│   │   ├── restaurants.module.ts
│   │   └── restaurants.service.ts
│   ├── schedule
│   │   ├── classes
│   │   │   └── schedule.response.message.ts
│   │   ├── interfaces
│   │   │   ├── open-api-options.interface.ts
│   │   │   └── row.interface.ts
│   │   ├── schedule.module.ts
│   │   └── schedule.service.ts
│   └── users
│       ├── classes
│       │   ├── user.exception.message.ts
│       │   └── user.response.message.ts
│       ├── dto
│       │   ├── create-user.dto.ts
│       │   ├── location-user.dto.ts
│       │   ├── login-user.dto.ts
│       │   └── lunch-recommend.dto.ts
│       ├── entity
│       │   └── user.entity.ts
│       ├── users.controller.ts
│       ├── users.module.ts
│       └── users.service.ts
├── tests
│   ├── app
│   │   └── app.controller.spec.ts
│   ├── auth
│   │   └── auth.service.spec.ts
│   ├── cache
│   │   └── cache.service.spec.ts
│   ├── citys
│   │   ├── citys.controller.spec.ts
│   │   └── citys.service.spec.ts
│   ├── integration
│   │   └── app.e2e-spec.ts
│   ├── jest-e2e.json
│   ├── rating
│   │   ├── rating.controller.spec.ts
│   │   └── rating.service.spec.ts
│   ├── recommend
│   │   ├── recommend.controller.spec.ts
│   │   └── recommend.service.spec.ts
│   ├── restaurants
│   │   ├── restaurants.controller.spec.ts
│   │   └── restaurants.service.spec.ts
│   ├── schedule
│   │   ├── schedule.controller.spec.ts
│   │   └── schedule.service.spec.ts
│   └── users
│       ├── users.controller.spec.ts
│       └── users.service.spec.ts
├── tsconfig.build.json
└── tsconfig.json
```

</details>

## 요구사항 분석

프로젝트 요구사항을 분석한 노션 페이지 링크입니다.

[요구사항 분석🔗](https://www.notion.so/eab8074ab0674c288deee64fa11fca7f?pvs=4)

## 프로젝트 설계

### 아키텍쳐

![image](https://github.com/pre-onboarding-backend-F/2_Matdori_F/assets/56855262/272bb21b-8cc3-40f6-880e-cbd67e5f2828)

### ERD

![image](https://github.com/pre-onboarding-backend-F/2_Matdori_F/assets/56855262/a7bc8089-0d42-4792-8ded-6e6e235bf9f2)

### API 설계

API 설계 및 명세를 정리한 노션 페이지 링크입니다.

[API 설계🔗](https://admitted-podium-88c.notion.site/REST-API-08a30b7a61644fa9b718312300f2785c?pvs=4)

## 협업 도구

-   프로젝트 관리 : ![Notion](https://img.shields.io/badge/Notion-%23000000.svg?style=for-the-badge&logo=notion&logoColor=white)

-   커뮤니케이션 : ![Discord](https://img.shields.io/badge/discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)

-   형상 관리 : ![github](https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white) ![git](https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white)

## 프로젝트 진행 및 이슈 관리

![image](https://github.com/pre-onboarding-backend-F/2_Matdori_F/assets/56855262/0d8bd2b7-5a33-4c21-b0b5-b8c026a30009)

![image](https://github.com/pre-onboarding-backend-F/2_Matdori_F/assets/56855262/8da08651-51cf-415d-ad07-60a55df070dc)

프로젝트 진행 및 이슈 관리를 작성한 타임보드 노션 페이지 링크입니다.

[프로젝트 task 페이지🔗](https://admitted-podium-88c.notion.site/0684f37da2a3409dbc38bc584a7722b3?v=e79847da7cbd46a8b0767012083410ae&pvs=4)

## 구현 과정

팀원 별로 작성한 구현 과정에 대한 노션 페이지 링크입니다.

-   [유저 및 맛집 평가 모듈, 점심 추천 서비스🔗](https://admitted-podium-88c.notion.site/2be6b9515b204430b6419d1cd6b1b3d6?pvs=4)

-   [시군구 목록 조회 캐싱, 맛집 상세정보 조회 캐싱🔗](https://admitted-podium-88c.notion.site/d43a682734254a3caa5ace1e2ab2854f?pvs=4)

-   [데이터 파이프 라인 구현 과정 및 캐시 모듈🔗](https://admitted-podium-88c.notion.site/bd81fccb2d4f40a3bc1e2cbb51ec5aa3?pvs=4)

## TIL

프로젝트를 진행하며 작성했던 TIL을 서로 공유할 수 있도록 노션 페이지에 정리하였습니다.

-   [Nest Request LifeCycle🔗](https://admitted-podium-88c.notion.site/Nest-Request-LifeCycle-a7ba22928d914cbda61b07336c535cb7?pvs=4)

-   [PostgreSQL pr_trgm 모듈과 GIN 인덱스로 검색 성능 올리기🔗](https://admitted-podium-88c.notion.site/PostgreSQL-pr_trgm-GIN-9a438ec1ac254e32ab8fe6fb71e4c756?pvs=4)

-   [빌트인 ParseUUIDPipe에서 메세지 전달하기🔗](https://admitted-podium-88c.notion.site/ParseUUIDPipe-868c579d9dec4c9f8305f89383c426cd?pvs=4)

-   [스케쥴러, RxJS, 데이터 파이프라인🔗](https://admitted-podium-88c.notion.site/RxJS-8a230828540245dfba1e13b5b1a8a7d6?pvs=4)

-   [이벤트🔗](https://admitted-podium-88c.notion.site/09918f826f174174a938daa03580ac9a?pvs=4)

-   [JWT🔗](https://admitted-podium-88c.notion.site/JWT-9e387136b3b2465d9fbc571ee23ff5f5?pvs=4)

-   [TypeScript enum 순회하기🔗](https://admitted-podium-88c.notion.site/TypeScript-enum-654db4a5a06247bfa48fdd0d660c4605?pvs=4)

-   [Redis, Redis Stack, 캐시🔗](https://admitted-podium-88c.notion.site/Redis-Redis-Stack-db658f1556f7444fa49f54f6c17de3e4?pvs=4)

-   [NestJS Request/Response Pipeline🔗](https://admitted-podium-88c.notion.site/NestJS-Request-Response-Pipeline-af216d49b3a84e91b6bf1f93fd85d125?pvs=4)

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
    <td align="center"><b><a href="https://github.com/haeseung123">이해원🔗</a></b></td>
    <td align="center"><b><a href="https://github.com/DevJayKR">최준성🔗</a></b></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/cabbage556"><img src="https://avatars.githubusercontent.com/u/56855262?v=4" width="80px" /></a>
    <td align="center"><a href="https://github.com/haeseung123"><img src="https://avatars.githubusercontent.com/u/106800437?v=4" width="80px" /></a></td>
    <td align="center"><a href="https://github.com/DevJayKR"><img src="https://avatars.githubusercontent.com/u/106816875?v=4" width="80px" /></a></td>
  </tr>
</table>

</div>
<br/>
