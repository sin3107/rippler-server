# User Auth

사용자 Authorization

## Exists

휴대전화번호 가입 여부 확인

POST /api/v1/auth/exists HTTP  
HOST: rippler.chaeft.com
Content-Type: application/json;charset=utf-8  

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|num|String| phone number |o|

### response

|name|type|desc|
|:---:|:---:|:---:|
|success|boolean|api 성공 여부|
|message|String|api 리턴 메시지|
|code|int|api 리턴 코드|
|data|Object|api 반환 객체|
|data.item|array|성공시 반환 배열, 실패시 빈 배열|
|data.item_length|int| data.item 의 갯수 |
|data.total|int| 총 갯수 |

### sample

request  
```bash
# 전체 가맹점
curl -X POST --url 'http://rippler.chaeft.com/api/v1/auth/exists' \
-H 'Content-Type: application/json;charset=utf-8' \
-d '{
    "num":"01012345678"
}'
```

response  
```bash
{
    "success": true,
    "message": "success",
    "code": 1000,
    "data": {
        "item": [true]//중복가입된 번호 or [false]//사용가능한 번호,
        "item_length": 1,
        "total": 1,
    }
}
```


## SignUp

회원가입

POST /api/v1/auth/signup HTTP  
HOST: rippler.chaeft.com
Content-Type: application/json;charset=utf-8  

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|num|String| 휴대전화번호 |o|
|password|String| 비밀번호 |o|
|device_id|String| 휴대폰 고유식별 id (Android: SSAID, Ios: UDID) |x|
|device_token|String| 휴대폰 푸시 토큰 |x|
|device_platform|String| 휴대폰 os(android / ios) |x|
|device_brand|String| 휴대폰 브랜드 |x|
|device_model|String| 휴대폰 모델명 |x|
|device_version|String| 휴대폰 Version |x|



### response

|name|type|desc|
|:---:|:---:|:---:|
|success|boolean|api 성공 여부|
|message|String|api 리턴 메시지|
|code|int|api 리턴 코드|
|data|Object|api 반환 객체|
|data.item|array|성공시 반환 배열, 실패시 빈 배열|
|data.item_length|int| data.item 의 갯수 |
|data.total|int| 총 갯수 |

### sample

request  
```bash
# 회원가입
curl -X POST --url 'http://rippler.chaeft.com/api/v1/auth/signup' \
-H 'Content-Type: application/json;charset=utf-8' \
-d '{
    "num": "01012345678",
    "password": "123123123",
    "device_id": "EW34WWE"
}'
```

response  
```bash
{
    "success": true,
    "message": "success",
    "code": 1000,
    "data": {
        "item": [1], //회원넘버
        "item_length": 1,
        "total": 1,
    }
}
```


## SignIn

로그인

POST /api/v1/auth/signin HTTP  
HOST: rippler.chaeft.com
Content-Type: application/json;charset=utf-8  

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|num|String| 휴대전화번호 |o|
|password|String| 비밀번호 |o|



### response

|name|type|desc|
|:---:|:---:|:---:|
|success|boolean|api 성공 여부|
|message|String|api 리턴 메시지|
|code|int|api 리턴 코드|
|data|Object|api 반환 객체|
|data.item|array|성공시 반환 배열, 실패시 빈 배열|
|data.item_length|int| data.item 의 갯수 |
|data.total|int| 총 갯수 |

### sample

request  
```bash
# 로그인
curl -X POST --url 'http://rippler.chaeft.com/api/v1/auth/signin' \
-H 'Content-Type: application/json;charset=utf-8' \
-d '{
    "num": "01012345678",
    "password": "123123123"
}'
```

response  
```bash
{
    "success": true,
    "message": "success",
    "code": 1000,
    "data": {
        "item": [
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1Ijo1LCJsIjoiNTU1Iiwia
            WF0IjoxNjA3MzI0Njk0LCJleHAiOjE2MDc0MTEwOTQsImlzcyI6ImlzcyIsInN1Y
            iI6InN1YiJ9.lI9_irZJXB5XfoNLXEiT-eCcoMTEpLhIUC_ZpVq7_t8"
        ],
        "item_length": 1,
        "total": 1,
    }
}
```