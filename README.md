# wanted-pre-onboarding-backend

원티드 프리온보딩 백엔드 인턴십 선발과제(기업 채용 웹 서비스)

## 실행하기

서버(로컬)

- `npm install`
- `npm run start`
- 3000번 포트 사용

데이터베이스(도커 컴포즈)

- 도커 컴포즈를 사용하므로 도커 설치가 필요합니다.(사용한 도커 버전: v20.10.22)
- `docker-compose build`
- `docker-compose up`
- 5432번 포트 사용

Prisma

- 마이그레이션: `npx prisma migrate dev`
- Client 생성: `npx prisma generate`
- Studio 실행: `npx prisma studio`
  - 회사, 사용자 등록 가능

## 테스트하기

```
npm test
```

- `jest` 테스팅 라이브러리 사용

주요 컨트롤러와 서비스에 대해 유닛 테스트를 작성하였다. 작성한 컨트롤러와 서비스는 다음과 같다.

지원내역(Application)

- ApplicationController(application.controller.ts)
- ApplicationService(application.service.ts)

채용공고(JobPosting)

- JobPostingController(job-posting.controller.ts)
- JobPostingService(job-posting.service.ts)

## 기술 스택

- 언어: `TypeScript(v5.0.0)`
- 프레임워크: `NestJS(v9.0.0)`
- 데이터베이스: `Postgresql(13)`
- ORM: `Prisma(v5.3.1)`
- `도커(v20.10.22)`

## 모델링과 ERD

### 모델링

원티드 홈페이지를 참고하면서 선발 과제의 최소한의 요구 사항에 맞춰 모델링을 진행하였다. 따라서 기본적인 정보들만 담을 수 있도록 데이터베이스 스키마를 구성하였다.

먼저 요구 사항을 구현하기 위해 필요한 데이터를 찾아 보았다.

회사와 관련하여 찾은 데이터들은 다음과 같다.

- 회사 이름
- 회사 소개
- 회사 주소
- 회사 국적(국가)
- 회사 지역
- 회사 직종
- 회사 설명 태그
- 회사 홈페이지 주소
- 평균 연봉
- 직원수
- 회사 관련 뉴스

이 중에서 고른 것은 다음과 같다.

- 회사 이름
- 회사 국가
- 회사 지역

채용공고와 관련하여 찾은 데이터들은 다음과 같다.

- 채용공고 포지션
- 채용공고 내용
- 합격보상금
- 기술스택 및 툴
- 공고 시간
- 공고 수정 시간
- 공고 마감일
- 근무지역

이 중에서 고른 것은 다음과 같다.

- 채용공고 포지션
- 채용공고 내용
- 합격보상금
- 기술스택 및 툴
- 공고 시간
- 공고 수정 시간

사용자 데이터는 다음과 같다.

- 이름
- 이메일
- 휴대폰 번호

지원내역과 관련하여 찾은 데이터들은 다음과 같다.

- 지원 회사
- 지원 포지션
- 지원 시간
- 진행 상태
- 추천 현황
- 보상금 신청 여부

이 중에서 고른 것은 다음과 같다.

- 지원 시간

최종 모델링은 다음과 같다.

```
model Company {
  id          Int    @id @default(autoincrement())
  name        String @db.VarChar(30)
  nationality String @db.VarChar(30)
  region      String @db.VarChar(30)

  jobPostings JobPosting[] // one-to-many(Company - JobPosting)
}

model JobPosting {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  content   String
  position  String   @db.VarChar(100)
  stack     String?  @db.VarChar(100)
  rewards   Int      @default(0)

  companyId Int
  company   Company @relation(fields: [companyId], references: [id])

  applications Application[] // one-to-many(JobPosting - Application)
}

model User {
  id    Int    @id @default(autoincrement())
  name  String @db.VarChar(100)
  phone String @db.Char(11)
  email String @unique @db.VarChar(100)

  applications Application[] // one-to-many(User - Application)
}

model Application {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())

  jobPostingId Int
  jobPosting   JobPosting @relation(fields: [jobPostingId], references: [id], onDelete: Cascade) // 채용공고 삭제 - 지원내역 삭제

  userId Int
  user   User @relation(fields: [userId], references: [id])

  @@unique([jobPostingId, userId]) // 1회 지원 가능
}
```

- 총 4개의 모델(회사, 채용공고, 사용자, 지원내역)을 구성하였다.
- Prisma를 사용해 모델링을 진행하였고 필요한 데이터와 데이터의 성격에 맞게 데이터 타입들을 지정하였다.
- one-to-many 관계 설정
  - Company - JobPosting (1 - N)
  - JobPosting - Application (1 - N)
  - User - Application (1 - N)
- Application의 경우 jobPostingId와 userId의 조합을 unique로 설정하여 1회만 지원할 수 있게 하였다.
- 채용공고 삭제 시 delete cascade를 설정하여 채용공고와 관련된 지원내역도 삭제되도록 하였다.

### ERD

모델링을 기반으로 ERD를 작성하였다.

![image](https://user-images.githubusercontent.com/56855262/273532121-5724180f-ea45-46c5-aaf2-f8ed76cb9e99.png)

## API 명세서

**회사, 사용자 레코드 생성의 경우 `prisma studio`를 사용하였다.** 사전과제의 요구 사항에 따라 총 7개의 API를 구현하였다.

| 설명                       | 메서드 | URL                                  |
| -------------------------- | ------ | ------------------------------------ |
| 채용공고 등록              | POST   | /posts                               |
| 채용공고 수정              | PATCH  | /posts/{id}                          |
| 채용공고 삭제              | DELETE | /posts/{id}                          |
| 채용공고 목록 조회         | GET    | /posts?page=:page&take=:take         |
| 채용공고 검색(회사 이름)   | GET    | /posts?search=:search&field=company  |
| 채용공고 검색(채용 포지션) | GET    | /posts?search=:search&field=position |
| 채용공고 상세 페이지 조회  | GET    | /posts/{id}                          |
| 채용공고 지원              | POST   | /applications                        |

### 1. 채용공고 등록

채용공고 테이블에 채용공고 레코드를 생성하고 생성한 채용공고 레코드를 리턴합니다.

- 엔드포인트

  ```
  POST /posts
  ```

- 요청 바디(application/json) 예시

  ```json
  {
    "companyId": 1,
    "position": "NestJS 백엔드 개발자",
    "content": "NestJS 백엔드 개발자를 모집 중입니다.....",
    "stack": "#NestJS #Node.js",
    "rewards": 500000
  }
  ```

  - `companyId(필수)`: 정수값
  - `position(필수)`: 문자열, 100자 이하
  - `content(필수)`: 문자열
  - `stack(선택)`: 문자열, 100자 이하, 전달하지 않으면 null 저장
  - `rewards(선택)`: 정수값, 전달하지 않으면 0 저장

- 응답

  - 성공 예시

    ```json
    201 Created
    {
      "id": 1,
      "createdAt": "2023-10-09T09:23:50.185Z",
      "updatedAt": "2023-10-09T09:23:50.185Z",
      "content": "NestJS 백엔드 개발자를 모집 중입니다.....",
      "position": "NestJS 백엔드 개발자",
      "stack": "#NestJS #Node.js",
      "rewards": 500000,
      "companyId": 1
    }
    ```

  - 실패
    - `400 BadRequest`: 요청 바디 값 유효성 검증 실패
    - `500 InternalServerError`: 서버 오류

### 2. 채용공고 수정

채용공고 레코드를 업데이트하고 업데이트한 채용공고 레코드를 리턴합니다.

- 엔드포인트

  ```
  PATCH /posts/{id}
  ```

  - `id(필수)`: 정수값

- 요청 예시

  ```
  PATCH /posts/1
  ```

  ```json
  {
    "position": "[신입] NestJS 백엔드 개발자",
    "content": "신입 NestJS 백엔드 개발자를 모집 중입니다.....",
    "stack": "#NestJS #Node.js #AWS",
    "rewards": 100000
  }
  ```

  - `position(선택)`: 문자열, 100자 이하
  - `content(선택)`: 문자열
  - `stack(선택)`: 문자열, 100자 이하
  - `rewards(선택)`: 정수값

- 응답
  - 성공 예시
    ```json
    200 OK
    {
      "id": 1,
      "createdAt": "2023-10-09T09:23:50.185Z",
      "updatedAt": "2023-10-09T09:31:53.457Z",
      "content": "신입 NestJS 백엔드 개발자를 모집 중입니다.....",
      "position": "[신입] NestJS 백엔드 개발자",
      "stack": "#NestJS #Node.js #AWS",
      "rewards": 100000,
      "companyId": 1
    }
    ```
  - 실패
    - `400 Bad Request`: 요청 패스 파라미터 값 유효성 검사 실패 | 요청 바디 값 유효성 검사 실패
    - `403 Forbidden`: id에 해당하는 채용공고 레코드가 없는 경우
    - `500 InternalServerError`: 서버 오류

### 3. 채용공고 삭제

채용공고 레코드를 제거하고 객체 형태로 삭제 성공 여부를 리턴합니다. 채용공고 레코드 삭제 시 채용공고에 지원한 지역내역이 모두 삭제됩니다.

- 엔드포인트

  ```
  DELETE /posts/{id}
  ```

  - `id(필수)`: 정수값

- 요청 예시
  ```
  DELETE /posts/1
  ```
- 응답
  - 성공 예시
    ```json
    200 OK
    {
      "deleted": true
    }
    ```
  - 실패1
    ```json
    200 OK
    {
      "deleted": false,
      "message": "삭제 실패"
    }
    ```
  - 실패2
    - `400 Bad Request`: 요청 패스 파라미터 값 유효성 검사 실패 | 요청 바디 값 유효성 검사 실패
    - `403 Forbidden`: id에 해당하는 채용공고 레코드가 없는 경우
    - `500 InternalServerError`: 서버 오류

### 4. 채용공고 목록 가져오기

채용공고 레코드들을 조회하고, 채용공고 레코드 배열과 페이지네이션 메타 데이터를 리턴합니다.

페이지네이션을 적용하여 기본 페이지는 1로, 기본 조회 갯수는 10을 사용합니다.

- 엔드포인트

  ```
  GET /posts/list?page=:page&take=:take
  ```

  - `page(선택)`: 정수값, 전달하지 않으면 기본값 1 사용
  - `take(선택)`: 정수값, 전달하지 않으면 기본값 10 사용

- 요청 예시
  ```
  GET /posts/list?page=1
  ```
- 응답

  - 성공 예시

    ```json
    200 OK
    {
      "data": [
        {
          "id": 1,
          "createdAt": "2023-10-09T12:02:26.813Z",
          "updatedAt": "2023-10-09T12:02:26.813Z",
          "content": "Express 백엔드 개발자를 모집 중입니다.....",
          "position": "Express 백엔드 개발자",
          "stack": "#Express #Node.js",
          "rewards": 500000,
          "companyId": 1,
          "company": {
            "id": 1,
            "name": "원티드랩",
            "nationality": "대한민국",
            "region": "서울"
          }
        },
        {
          "id": 2,
          "createdAt": "2023-10-09T12:02:42.434Z",
          "updatedAt": "2023-10-09T12:02:42.434Z",
          "content": "NestJS 백엔드 개발자를 모집 중입니다.....",
          "position": "NestJS 백엔드 개발자",
          "stack": "#NestJS #Node.js",
          "rewards": 500000,
          "companyId": 1,
          "company": {
            "id": 1,
            "name": "원티드랩",
            "nationality": "대한민국",
            "region": "서울"
          }
        }
      ],
      "meta": {
        "page": 1,
        "take": 10,
        "startPage": 1,
        "lastPage": 1,
        "pageList": [1],
        "hasPrevPage": false,
        "hasNextPage": false
      }
    }
    ```

  - 실패
    - `400 Bad Request`: 요청 쿼리 파라미터 값 유효성 검증 실패
    - `403 Forbidden`: 요청 페이지가 마지막 페이지보다 큰 경우
    - `500 InternalServerError`: 서버 오류

### 5. 채용공고 검색하기(회사 이름)

회사 이름을 검색해 해당하는 회사의 채용공고 레코드를 배열로 리턴합니다.

- 엔드포인트
  ```
  GET /posts?search=:search&field=company
  ```
  - `search(필수)`: 문자열, 1글자 이상 100글자 이하
  - `field(필수)`: 문자열, company 또는 position
- 요청 예시
  ```
  GET /posts?search=원티드&field=company
  ```
- 응답
  - 성공 예시
    ```json
    200 OK
    [
      {
        "id": 1,
        "createdAt": "2023-10-09T09:48:47.923Z",
        "updatedAt": "2023-10-09T09:48:47.923Z",
        "content": "NestJS 백엔드 개발자를 모집 중입니다.....",
        "position": "NestJS 백엔드 개발자",
        "stack": "#NestJS #Node.js",
        "rewards": 500000,
        "companyId": 1,
        "company": {
          "id": 1,
          "name": "원티드랩",
          "nationality": "대한민국",
          "region": "서울"
        }
      },
      {
        "id": 2,
        "createdAt": "2023-10-09T09:49:07.941Z",
        "updatedAt": "2023-10-09T09:49:07.941Z",
        "content": "Express 백엔드 개발자를 모집 중입니다.....",
        "position": "Express 백엔드 개발자",
        "stack": "#Express #Node.js",
        "rewards": 500000,
        "companyId": 1,
        "company": {
          "id": 1,
          "name": "원티드랩",
          "nationality": "대한민국",
          "region": "서울"
        }
      }
    ]
    ```
  - 실패
    - `400 Bad Request`: 요청 쿼리 파라미터 값 유효성 검증 실패
    - `500 InternalServerError`: 서버 오류

### 6. 채용공고 검색하기(채용 포지션)

채용 포지션을 검색해 해당하는 채용공고 레코드를 배열로 리턴합니다.

- 엔드포인트
  ```
  GET /posts?search=:search&field=position
  ```
  - `search(필수)`: 문자열, 1글자 이상 100글자 이하
  - `field(필수)`: 문자열, company 또는 position
- 요청 예시
  ```
  GET /posts?search=백엔드&field=position
  ```
- 응답
  - 성공 예시
    ```json
    200 OK
    [
      {
        "id": 1,
        "createdAt": "2023-10-09T09:48:47.923Z",
        "updatedAt": "2023-10-09T09:48:47.923Z",
        "content": "NestJS 백엔드 개발자를 모집 중입니다.....",
        "position": "NestJS 백엔드 개발자",
        "stack": "#NestJS #Node.js",
        "rewards": 500000,
        "companyId": 1,
        "company": {
          "id": 1,
          "name": "원티드랩",
          "nationality": "대한민국",
          "region": "서울"
        }
      },
      {
        "id": 2,
        "createdAt": "2023-10-09T09:49:07.941Z",
        "updatedAt": "2023-10-09T09:49:07.941Z",
        "content": "Express 백엔드 개발자를 모집 중입니다.....",
        "position": "Express 백엔드 개발자",
        "stack": "#Express #Node.js",
        "rewards": 500000,
        "companyId": 1,
        "company": {
          "id": 1,
          "name": "원티드랩",
          "nationality": "대한민국",
          "region": "서울"
        }
      }
    ]
    ```
  - 실패
    - `400 Bad Request`: 요청 쿼리 파라미터 값 유효성 검증 실패
    - `500 InternalServerError`: 서버 오류

### 7. 채용공고 상세 페이지 가져오기

채용공고 레코드를 조회해 리턴합니다. 채용공고를 올린 회사의 채용공고가 더 있다면 채용공고의 id들을 함께 리턴합니다.

- 엔드포인트
  ```
  GET /posts/{id}
  ```
  - `id(필수)`: 정수값
- 요청 예시
  ```
  GET /posts/1
  ```
- 응답
  - 성공 예시
    ```json
    200 OK
    {
      "id": 1,
      "createdAt": "2023-10-09T09:48:47.923Z",
      "updatedAt": "2023-10-09T09:48:47.923Z",
      "content": "NestJS 백엔드 개발자를 모집 중입니다.....",
      "position": "NestJS 백엔드 개발자",
      "stack": "#NestJS #Node.js",
      "rewards": 500000,
      "companyId": 1,
      "company": {
        "id": 1,
        "name": "원티드랩",
        "nationality": "대한민국",
        "region": "서울",
        "jobPostings": [
          {
            "id": 1
          },
          {
            "id": 2
          }
        ]
      }
    }
    ```
  - 실패
    - `400 Bad Request`: 요청 패스 파라미터 값 유효성 검증 실패
    - `403 Forbidden`: id에 해당하는 채용공고 레코드가 없는 경우
    - `500 InternalServerError`: 서버 오류

### 8. 지원하기

지원내역 레코드를 생성해 리턴합니다.

- 엔드포인트

  ```
  POST /applications
  ```

- 요청 바디(application/json) 예시

  ```json
  {
    "userId": 1,
    "jobPostingId": 1
  }
  ```

  - `userId(필수)`: 정수값, 1 이상
  - `jobPostingId(필수)`: 정수값, 1 이상

- 응답

  - 성공 예시

    ```json
    201 Created
    {
      "id": 1,
      "createdAt": "2023-10-09T10:18:21.595Z",
      "jobPostingId": 1,
      "userId": 1
    }
    ```

  - 실패
    - `400 Bad Request`: 요청 바디 값 유효성 검증 실패
    - `403 Forbidden`: 사용자가 채용공고에 이미 한 번 지원한 경우 | userId 또는 jobPostingId에 해당하는 레코드가 없는 경우(외래키 제약조건 실패)
    - `500 InternalServerError`: 서버 오류

## 테스트 코드 작성

유닛 테스트 코드 작성 경험이 많이 없어서 구글링, 깃허브 검색, 유튜브 강의 등을 참고해 테스트 코드 작성을 시작했다.

서비스를 의존성 주입 받는 컨트롤러의 경우 서비스를 모킹하여 컨트롤러 유닛 테스트 코드를 작성하였다. 그리고 PrismaService를 의존성 주입 받는 서비스의 경우 PrismaService를 모킹하여 서비스 유닛 테스트 코드를 작성하였다. 유닛 테스트 코드의 경우 여러 시나리오를 가정해서, 어떤 데이터가 입력되면 모킹 데이터를 반환하게 하여 반환된 데이터가 해당 모킹 데이터와 일치하는지를 확인하는 방식으로 테스트 코드를 작성하였다.

테스트 코드를 작성하는 과정에서 작성했던 코드에 어떤 문제가 있을지를 꽤 오랫동안 생각할 수 있었다. 그 과정 속에서 문제가 발생할 수 있는 시나리오를 찾을 수 있었고 직접 시나리오를 진행하면서 실제로 문제가 발생하는 것도 확인할 수 있었다. 테스트 코드의 필요성을 체감할 수 있었고 견고한 백엔드 애플리케이션을 만드려면 왜 테스트 코드 작성이 필요한지도 알 수 있었다.

테스트 코드 작성에 많은 시간을 쓰긴 했지만 현재 테스트 코드가 내가 작성한 코드가 정상적으로 동작하는지를 정확하게 테스트하고 있는 지는 아직은 잘 모르겠다. 테스트 코드에 문제가 있겠지만, 여러 자료를 참고하면서 테스트 코드 작성법에 대해 많이 배울 수 있었다.
