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

  - `companyId(필수)`: 정수값, 1 이상
  - `position(필수)`: 문자열, 100자 이하
  - `content(필수)`: 문자열
  - `stack(선택)`: 문자열, 100자 이하, 전달하지 않으면 null 저장
  - `rewards(선택)`: 정수값, 0 이상, 전달하지 않으면 0 저장

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
  - `rewards(선택)`: 정수값, 0 이상

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

## 요구사항 분석 및 구현

### 요구사항 분석

1. 채용공고 등록

   - 회사는 채용공고를 하나 이상 등록할 수 있다.
   - 채용공고에는 `[회사id, 채용포지션, 채용내용, 기술스택, 채용보상금]`을 등록한다.
   - 채용공고 등록 시 `[회사id, 채용포지션, 채용내용]`은 필수값이다.
   - 채용공고 등록 시 `[기술스택, 채용보상금]`은 선택값이다.

2. 채용공고 수정

   - 회사는 채용공고를 수정할 수 있다.
   - 채용공고의 `[채용포지션, 채용내용, 기술스택, 채용보상금]`을 모두 수정할 수 있다.
   - 채용공고 수정 시 `[회사id]`는 수정할 수 없다.
   - 채용공고 수정 시 `[채용포지션, 채용내용, 기술스택, 채용보상금]`은 모두 선택값이다.
   - 채용공고 수정 시 입력한 값만 수정한다.

3. 채용공고 삭제

   - 회사는 채용공고를 삭제할 수 있다.
   - 채용공고가 삭제되면 채용공고의 지원내역도 삭제되어야 한다.

4. 채용공고 목록 가져오기

   - 채용공고 목록을 조회한다.
   - 채용공고 목록 조회 시 회사 정보도 함께 조회한다.

5. 채용공고 검색하기

   - 채용공고를 `회사명` 또는 `채용포지션`을 기준으로 검색한다.
   - 검색 키워드에 따라 채용공고 목록을 조회한다.
   - 채용공고 목록 조회 시 회사 정보도 함께 조회한다.

6. 채용공고 상세 페이지 가져오기

   - 채용공고의 모든 데이터를 조회한다.
   - 채용공고 조회 시 회사 정보와 회사가 올린 다른 채용공고의 id도 조회한다.

7. 채용공고 지원하기

   - 사용자는 채용공고에 한 번만 지원할 수 있다.
   - 채용공고 지원 시 지원내역에 `[유저id, 채용공고id]`를 등록한다.

### 요구사항 구현

#### 1. 모델링

요구사항 분석 이후, 원티드 홈페이지를 참고하면서 선발 과제의 최소한의 요구 사항에 맞춰 모델링을 진행하였다. 따라서 기본적인 정보들만 담을 수 있도록 모델링하였다.

요구사항을 구현하기 위해 필요한 데이터를 찾아 보았다.

회사

```
회사 이름
회사 국가
회사 지역
```

채용공고

```
채용공고 포지션
채용공고 내용
합격보상금
기술스택 및 툴
공고 시간
공고 수정 시간
```

사용자

```
이름
이메일
휴대폰 번호
```

지원내역

```
지원 시간
```

이 외에도 찾은 데이터가 더 있었지만 가장 기본적인 데이터만 선택하였다.

필요하다고 생각한 데이터를 모두 고르고 스키마를 작성했다.

- 총 4개의 모델(회사, 채용공고, 사용자, 지원내역)을 구성하였다.
- Prisma를 사용해 모델링을 진행하였고 필요한 데이터와 데이터의 성격에 맞게 데이터 타입들을 지정하였다.
- one-to-many 관계 설정
  - 회사 - 채용공고 (1 - N)
  - 채용공고 - 지원내역 (1 - N)
  - 사용자 - 지원내역 (1 - N)
- 지원내역의 경우 jobPostingId와 userId의 조합을 unique로 설정하여 1회만 지원할 수 있게 하였다.
- 채용공고 삭제 시 delete cascade를 설정하여 채용공고와 관련된 지원내역도 삭제되도록 하였다.

#### 2. API 설계

모델링을 작성한 이후, API를 설계했다. 리소스를 크게 `채용공고`, `지원내역` 두 개로 나누었다. 같은 URL은 HTTP 메서드를 통해 구분하였다.

1. 채용공고 API

   - 기본 엔드포인트: /posts
   - 채용공고 id가 필요한 경우 패스 파라미터 사용: /posts/{id}
   - 목록 조회, 검색하기와 같이 조건이 필요한 경우 쿼리 파라미터 사용
     - 목록 조회: /posts/list?page=:page&take=:take
     - 검색하기: /posts?search=:search&field=:field
   - HTTP 메서드
     - 생성: POST
     - 수정: PATCH
     - 삭제: DELETE
     - 조회: GET

2. 지원내역 API

   - 기본 엔드포인트: /applications
   - HTTP 메서드
     - 생성: POST

회사, 사용자의 경우 API 없이 `Prisma Studio`를 사용해 직접 데이터베이스에 생성하였다.

#### 3. 코드 작성

##### 채용공고 등록

- DTO 선언 및 유효성 검증(`class-validtor`)

  ```ts
  export class CreateJobPostingDto {
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    companyId: number;

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    position: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    rewards?: number;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    stack?: string;
  }
  ```

  - 스키마에서 선언한 데이터 타입 및 제약조건에 맞게 입력 값에 대해 유효성 검증

- 컨트롤러 라우트 핸들러(POST /posts)

  ```ts
  @Post()
  createJobPosting(
    @Body() dto: CreateJobPostingDto, //
  ): Promise<JobPosting> {
    return this.jobPostingService.createJobPosting(dto);
  }
  ```

  - 유효성 검증을 통과한 dto를 서비스 로직에 전달
  - 서비스에서 리턴한 채용공고를 클라이언트에 응답

- 서비스 로직

  ```ts
  async createJobPosting(
    dto: CreateJobPostingDto, //
  ): Promise<JobPosting> {
    const jobPosting = await this.prismaService.jobPosting.create({
      data: {
        ...dto,
      },
    });
    return jobPosting;
  }
  ```

  - JobPosting 테이블에 레코드 생성 후 컨트롤러에 리턴

##### 채용공고 수정

- DTO 선언 및 유효성 검증(`class-validtor`)

  ```ts
  export class UpdateJobPostingDto extends PartialType(
    OmitType(CreateJobPostingDto, ['companyId'] as const),
  ) {}
  ```

  - `CreateJobPostingDto` 중에서 `companyId`를 제외하고 모든 프로퍼티를 옵셔널로 선언
  - 스키마에서 선언한 데이터 타입 및 제약조건에 맞게 입력 값에 대해 유효성 검증

- id 패스 파라미터 유효성 검증(`IdValidationPipe`)

  ```ts
  export class IdValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
      value = +value;
      if (!this.isInteger(value) || !this.isPositive(value))
        throw new BadRequestException(`유효하지 않은 id`);
      return +value;
    }

    private isInteger(value: any): boolean {
      return Number.isInteger(value);
    }

    private isPositive(value: any): boolean {
      return value > 0;
    }
  }
  ```

  - 음수이거나 문자열 정수값이 아닌 경우에 대해 유효성 검증

- 컨트롤러 라우트 핸들러(`PATCH /posts/{id}`)

  ```ts
  @Patch(':id')
  updateJobPosting(
    @Param('id', IdValidationPipe) id: number, //
    @Body() dto: UpdateJobPostingDto, //
  ): Promise<JobPosting> {
    return this.jobPostingService.updateJobPosting(id, dto);
  }
  ```

  - 유효성 검증을 통과한 id, dto를 서비스 로직에 전달
  - 서비스에서 리턴한 채용공고를 클라이언트에 응답

- 서비스 로직

  ```ts
  async updateJobPosting(
    id: number, //
    dto: UpdateJobPostingDto,
  ): Promise<JobPosting> {
    const jobPosting = await this.getJobPostingById(id);
    if (!jobPosting) throw new ForbiddenException('리소스 접근 거부');

    return this.prismaService.jobPosting.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
  }
  ```

  - JobPosting 테이블에서 레코드 조회 후 존재하지 않으면 ForbiddenException 응답
  - JobPosting 테이블에서 레코드 업데이트 후 컨트롤러에 리턴

##### 채용공고 삭제

- id 패스 파라미터 유효성 검증(`IdValidationPipe`)

  ```ts
  export class IdValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
      value = +value;
      if (!this.isInteger(value) || !this.isPositive(value))
        throw new BadRequestException(`유효하지 않은 id`);
      return +value;
    }

    private isInteger(value: any): boolean {
      return Number.isInteger(value);
    }

    private isPositive(value: any): boolean {
      return value > 0;
    }
  }
  ```

  - 음수이거나 문자열 정수값이 아닌 경우에 대해 유효성 검증

- 컨트롤러 라우트 핸들러(`DELETE /posts/{id}`)

  ```ts
  @Delete(':id')
  deleteJobPosting(
    @Param('id', IdValidationPipe) id: number, //
  ): Promise<{ deleted: boolean; message?: string }> {
    return this.jobPostingService.deleteJobPosting(id);
  }
  ```

  - 유효성 검증을 통과한 id를 서비스 로직에 전달
  - 서비스에서 리턴한 삭제 성공 여부 객체를 클라이언트에 응답

- 서비스 로직

  ```ts
  async deleteJobPosting(
    id: number, //
  ): Promise<{ deleted: boolean; message?: string }> {
    const jobPosting = await this.getJobPostingById(id);
    if (!jobPosting) throw new ForbiddenException('리소스 접근 거부');

    try {
      await this.prismaService.jobPosting.delete({
        where: {
          id,
        },
      });
      return { deleted: true };
    } catch (_) {
      return { deleted: false, message: '삭제 실패' };
    }
  }
  ```

  - JobPosting 테이블에서 레코드 조회 후 존재하지 않으면 ForbiddenException 응답
  - JobPosting 테이블에서 레코드 제거
    - 성공 시 { deleted: true } 리턴
    - 실패 시 { deleted: false, message: '삭제 실패' } 리턴

##### 채용공고 목록 가져오기

- DTO 선언 및 유효성 검증(`class-valiator`, `class-transformer`)

  ```ts
  export class GetJobPostingsDto {
    @Type(() => Number)
    @IsOptional()
    @IsInt()
    page?: number = 1;

    @Type(() => Number)
    @IsOptional()
    @IsInt()
    take?: number = 10;
  }
  ```

  - 페이지네이션 적용
  - 쿼리 파라미터 page, take에 대해 유효성 검증
  - 전달하지 않으면 각각 기본값 1, 10 사용

- 컨트롤러 라우트 핸들러(`GET /posts/list?page=:page&take=:take`)

  ```ts
  @Get('list')
  getJobPostings(
    @Query() dto: GetJobPostingsDto, //
  ): Promise<PageDto<JobPosting>> {
    return this.jobPostingService.getJobPostings(dto);
  }
  ```

  - 유효성 검증을 통과한 dto를 서비스 로직에 전달
  - 서비스에서 리턴한 채용공고 목록을 클라이언트에 응답

- 서비스 로직

  ```ts
  async getJobPostings({
    page,
    take,
  }: GetJobPostingsDto): Promise<PageDto<JobPostingWithCompany>> {
    const totalCounts = await this.prismaService.jobPosting.count();
    const pageMetaDto = new PageMetaDto({ totalCounts, page, take });
    const jobPostings = await this.prismaService.jobPosting.findMany({
      take: pageMetaDto.take,
      skip: (pageMetaDto.page - 1) * pageMetaDto.take,
      include: includeCompany,
    });

    if (pageMetaDto.lastPage >= pageMetaDto.page) {
      return new PageDto<JobPostingWithCompany>(jobPostings, pageMetaDto);
    } else {
      throw new ForbiddenException('리소스 접근 거부');
    }
  }
  ```

  - include를 통해 relation 쿼리를 수행해 회사 정보까지 조회
  - 요청 시 전달한 page가 현재 레코드로 생성할 수 있는 마지막 페이지보다 크면 ForbiddenException 응답
  - 그렇지 않으면 조회한 채용공고 목록과 페이지네이션 메타데이터를 컨트롤러에 리턴

- PageDto

  ```ts
  export class PageDto<T> {
    constructor(
      private readonly data: T[], //
      private readonly meta: PageMetaDto,
    ) {}
  }
  ```

  - getJobPostings 서비스 로직의 리턴 타입
  - data 프로퍼티에 채용공고 할당
  - meta 프로퍼티에 페이지네이션 메타데이터 할당

- PageMetaDto

  ```ts
  export class PageMetaDto {
    readonly page: number;
    readonly take: number;
    readonly startPage: number;
    readonly lastPage: number;
    readonly pageList: number[];
    readonly hasPrevPage: boolean;
    readonly hasNextPage: boolean;

    constructor({ totalCounts, page, take }: PageMetaDtoParameters) {
      // page, take 값 설정
      //    음수 입력 시 기본값 1, 10 사용
      page = page <= 0 ? 1 : page;
      take = take <= 0 ? 10 : take;

      const PAGE_LIST_SIZE = 10; // 페이지에서 보여줄 최대 페이지 수
      const totalPage = Math.ceil(totalCounts / take); // 총 페이지 수
      let quotient = Math.floor(page / PAGE_LIST_SIZE); // 시작 페이지를 구하기 위한 몫
      if (page % PAGE_LIST_SIZE === 0) quotient -= 1;

      this.page = page;
      this.take = take;

      this.startPage = quotient * PAGE_LIST_SIZE + 1; // 페이지에서 보여줄 시작 페이지
      const endPage =
        this.startPage + PAGE_LIST_SIZE - 1 < totalPage
          ? this.startPage + PAGE_LIST_SIZE - 1
          : totalPage; // 페이지에서 보여줄 마지막 페이지
      this.lastPage = totalPage; // 총 페이지
      this.pageList = Array.from(
        { length: endPage - this.startPage + 1 },
        (_, i) => this.startPage + i,
      ); // 페이지에 표시할 페이지 번호 배열

      this.hasPrevPage = this.page > 1;
      this.hasNextPage = this.page < totalPage;
    }
  }
  ```

  - offset 기반 페이지네이션을 적용하기 위한 메타데이터
  - 쿼리 파라미터로 입력한 page, take 값에 따라 페이지네이션 메타데이터 생성

- includeCompany, JobPostingWithCompany

  ```ts
  export const includeCompany = {
    company: true,
  } satisfies Prisma.JobPostingInclude;

  export type JobPostingWithCompany = Prisma.JobPostingGetPayload<{
    include: typeof includeCompany;
  }>;
  ```

  - relation 쿼리 수행 시 리턴하는 데이터 타입 선언

##### 채용공고 검색하기(회사명, 채용포지션)

- DTO 선언 및 유효성 검증

  ```ts
  export class SearchJobPostingsDto {
    @IsNotEmpty()
    @IsString()
    @Length(1, 100) // 1글자부터 position 필드 최대 길이 100글자까지
    search: string;

    @IsIn(['position', 'company'])
    field: string;
  }
  ```

  - 스키마에서 선언한 데이터 타입 및 제약조건에 맞게 입력 값에 대해 유효성 검증
  - field의 경우 `company(회사명)`, `position(채용포지션)`에 속하는지 확인

- 컨트롤러 라우트 핸들러(`GET /posts?search=:search&field=:field`)

  ```ts
  @Get()
  searchJobPostings(
    @Query() dto: SearchJobPostingsDto, //
  ): Promise<JobPosting[]> {
    return this.jobPostingService.searchJobPostings(dto);
  }
  ```

  - 유효성 검증을 통과한 dto를 서비스 로직에 전달
  - 서비스 로직에서 리턴한 채용공고 목록을 클라이언트에 응답

- 서비스 로직

  ```ts
  async searchJobPostings({
    search,
    field,
  }: SearchJobPostingsDto): Promise<JobPostingWithCompany[]> {
    let jobPostings = null;
    switch (field) {
      case 'company':
        jobPostings = await this.searchInCompany(search);
        break;
      case 'position':
        jobPostings = await this.searchInPosition(search);
        break;
      default:
        jobPostings = [];
    }

    return jobPostings;
  }
  ```

  - company 검색 또는 position 검색에 따라 별도의 서비스 로직 호출
  - 검색한 채용공고 목록을 컨트롤러에 리턴

- searchInCompany, searchInPosition

  ```ts
  private searchInCompany(
    search: string, //
  ): Promise<JobPostingWithCompany[]> {
    return this.prismaService.jobPosting.findMany({
      where: {
        company: {
          name: {
            contains: search,
          },
        },
      },
      include: includeCompany,
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  private searchInPosition(
    search: string, //
  ): Promise<JobPostingWithCompany[]> {
    return this.prismaService.jobPosting.findMany({
      where: {
        position: {
          contains: search,
        },
      },
      include: includeCompany,
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
  ```

  - 회사명 또는 채용포지션에 대해 검색 키워드 LIKE 검색 수행
  - include를 통해 relation 쿼리를 수행해 회사 정보까지 조회
  - 생성일 기준 오름차순 정렬

##### 채용공고 상세 페이지 가져오기

- id 패스 파라미터 유효성 검증(`IdValidationPipe`)

  ```ts
  export class IdValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
      value = +value;
      if (!this.isInteger(value) || !this.isPositive(value))
        throw new BadRequestException(`유효하지 않은 id`);
      return +value;
    }

    private isInteger(value: any): boolean {
      return Number.isInteger(value);
    }

    private isPositive(value: any): boolean {
      return value > 0;
    }
  }
  ```

  - 음수이거나 문자열 정수값이 아닌 경우에 대해 유효성 검증

- 컨트롤러 라우트 핸들러(`GET /posts/{id}`)

  ```ts
  @Get(':id')
  getDetailPage(
    @Param('id', IdValidationPipe) id: number, //
  ): Promise<JobPosting> {
    return this.jobPostingService.getDetailPage(id);
  }
  ```

  - 유효성 검증을 통과한 id를 서비스 로직에 전달
  - 서비스에서 리턴한 채용공고를 클라이언트에 응답

- 서비스 로직

  ```ts
  async getDetailPage(
    id: number, //
  ): Promise<JobPostingWithCompanyAndJobPostingsId> {
    const jobPosting = await this.prismaService.jobPosting.findUnique({
      where: { id },
      include: includeCompanyAndSelectJobPostingsId,
    });
    if (!jobPosting) throw new ForbiddenException('리소스 접근 거부');

    return jobPosting;
  }
  ```

  - JobPosting 테이블에서 레코드 조회 후 존재하지 않으면 ForbiddenException 응답
  - include를 통해 relation 쿼리를 수행해 회사 정보, 회사가 올린 채용공고의 id까지 조회
  - 조회한 채용공고를 컨트롤러에 리턴

- includeCompanyAndSelectJobPostingsId, JobPostingWithCompanyAndJobPostingsId

  ```ts
  export const includeCompanyAndSelectJobPostingsId = {
    company: {
      include: {
        jobPostings: {
          select: {
            id: true,
          },
        },
      },
    },
  } satisfies Prisma.JobPostingInclude;

  export type JobPostingWithCompanyAndJobPostingsId =
    Prisma.JobPostingGetPayload<{
      include: typeof includeCompanyAndSelectJobPostingsId;
    }>;
  ```

  - relation 쿼리 수행 시 리턴하는 데이터 타입 선언

##### 채용공고 지원하기

- DTO 선언 및 유효성 검증

  ```ts
  export class CreateApplicationDto {
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    userId: number;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    jobPostingId: number;
  }
  ```

  - 스키마에서 선언한 데이터 타입 및 제약조건에 맞게 입력 값에 대해 유효성 검증

- 컨트롤러 라우트 핸들러(`POST /applications`)

  ```ts
  @Post()
  createApplication(
    @Body() dto: CreateApplicationDto, //
  ): Promise<Application> {
    return this.applicationService.createApplication(dto);
  }
  ```

  - 유효성 검증을 통과한 dto를 서비스 로직에 전달
  - 서비스에서 리턴한 지원내역을 클라이언트에 응답

- 서비스 로직

  ```ts
  async createApplication(
    dto: CreateApplicationDto, //
  ): Promise<Application> {
    try {
      const application = await this.prismaService.application.create({
        data: {
          ...dto,
        },
      });
      return application;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ForbiddenException('이미 지원하였음');
        else if (error.code === 'P2003')
          throw new ForbiddenException('리소스 접근 거부');
      }
    }
  }
  ```

  - 지원내역 레코드를 생성하여 컨트롤러에 리턴
  - 이미 지원한 경우 ForbiddenException 응답
  - 외래키 제약조건이 실패하는 경우(userId, jobPostingId에 해당하는 레코드가 없음) ForbiddenException 응답
