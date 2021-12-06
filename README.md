# rippler-server

비밀계정으로의 익명 SNS와 전화번호부를 활용한 친구들간의 개별 SNS를 합친 형태

.env.sample 참고하여 .env 작성

## Environment
* encoding = utf-8
* NodeJS@14
* express
* node
* Mysql DB 5.7
* client port 3000
* server client proxy -> /api

### Package Setup
[npm](https://www.npmjs.com/)
* npm install 
 * express
 * dotenv
 * cors
 * crypto
 * jsonwebtoken
 * mysql
 * cookie-parser
 * firebase-admin
 * formidable
 * fs-extra
 * moment
 * aligoapi
* 실행 실패 시 npm i 후 테스트 진행

### App Start
* linux server
 * ```$ npm install -g pm2```
 * ```$ pm2 start server/app.js -i 4 --name "app"```
* local
  * ```$ node server/app```
```
# init logger
# init utils
# init CONSTANT Variables
# init printer
# load db success
# load jwt success
# /api route set success
```

### Directory
```
* docs 
 - api 사용 설명을 위한 폴더
   * CODE.md - 반환 메시지
   * 그 외 .md - api 설명

* server
  * app.js - server 실행 파일
  
  1. commons - 자주 사용하는 기능들을 함수화해 놓은 폴더
    * constant.js - client로 전달 할 코드 설정
    * db.js - mysql 및 query
    * fcm.js - fcm 
    * jwt.js - jwt 설정 
    * logger.js - log
    * mailer.js - smtp
    * notify.js - fcm 출력문
    * out.js - client로 전달 할 json type data
    * util.js - parameter 유효성 체크

  2. routes - api 작성 폴더
    * index.js
    
    2.1. v1
    
      2.1.1. admin
          * answer.js - 문의 관련 api
          * graph.js - 회원가입 통계 api
          * notice.js - 공지 api
          * reports.js - 신고 확인 및 정지 api
          * users.js - 유저 정보 확인
          
      2.1.2. file
          * uploader.js - aws s3 upload
          * viewer.js - aws s3 view
          
      * index.js - 각 api 호출 및 토큰값 특정위치 체크
      * auth.js - 회원가입, 탈퇴, id찾기 등 계정관련 api
      * auth_check.js - index.js에서 로그인 후 사용할 수 있는 기능에 대하여 token 확인
      * blind.js - 차단한 친구 상태 변경, 확인, 검색등의 api
      * friend.js - 친구목록 확인, 전화번호부 동기화, 친구 상태 변경 등의 api
      * interest.js - 익명의 관심사 게시판의 게시물 CRUD api
      * interest_profile.js - 관심사 게시판의 프로필 CRUD API
      * keyword.js - 관심사 게시물에 태그된 투표 키워드 확인, 변경, 자동업데이트 등의 api
      * mail.js - 친구들간의 우편함 게시판의 게시물 CRUD api
      * mail_profile.js - 친구목록에 발생되어질 카카오톡과 유사한 형태의 프로필
      * notice.js - 공지 CRUD api
      * notification.js - fcm 관련 api
      * pool.js - 각 친구들의 모임 설정, 추가, 확인, 삭제등의 api
      * question.js - 질의응답 api
      * report.js - 신고 api
      * tutorial.js - 어플 최초 실행 시 확인을 위한 api
      * user.js - 본인 정보 수정, 입력 등의 api
```
