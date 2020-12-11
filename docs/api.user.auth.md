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
# 가입 여부
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




## sms_auth_req

번호 인증 요청

POST /api/v1/auth/sms_auth_req HTTP  
HOST: rippler.chaeft.com
Content-Type: application/json;charset=utf-8  

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|receiver|String| phone number |o|

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
# 번호 인증 요청
curl -X POST --url 'http://rippler.chaeft.com/api/v1/auth/sms_auth_req' \
-H 'Content-Type: application/json;charset=utf-8' \
-d '{
    "receiver":"01012345678"
}'
```

response  
```bash
{
    "success": true,
    "message": "success",
    "code": 1000,
    "data": {
        "item": [true]
        "item_length": 1,
        "total": 1,
    }
}
```




## sms_auth_res

인증 확인

POST /api/v1/auth/sms_auth_res HTTP  
HOST: rippler.chaeft.com
Content-Type: application/json;charset=utf-8  

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|num|String| phone number |o|
|auth_num|Int| 문자 인증 숫자 |o|

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
# 인증 확인
curl -X POST --url 'http://rippler.chaeft.com/api/v1/auth/sms_auth_res' \
-H 'Content-Type: application/json;charset=utf-8' \
-d '{
    "num": "01012345678",
    "auth_num": 121212
}'
```

response  
```bash
{
    "success": true,
    "message": "success",
    "code": 1000,
    "data": {
        "item": [true]
        "item_length": 1,
        "total": 1,
    }
}
```




## num find

휴대전화 가입 여부

POST /api/v1/auth/num_find HTTP  
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
# 가입 여부
curl -X POST --url 'http://rippler.chaeft.com/api/v1/auth/num_find' \
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
        "item": [1] // 해당 번호의 user_id || [false] // 가입되어있지 않음
        "item_length": 1,
        "total": 1,
    }
}
```




## password change

비밀번호 변경

POST /api/v1/auth/num_find HTTP  
HOST: rippler.chaeft.com
Content-Type: application/json;charset=utf-8  

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|id|Int| 회원 id(/num_find) |o|
|password|String| 변경 할 비밀번호 |o|

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
# 가입 여부
curl -X POST --url 'http://rippler.chaeft.com/api/v1/auth/num_find' \
-H 'Content-Type: application/json;charset=utf-8' \
-d '{
    "id": 1
    "password": "1q2w3e4r"
}'
```
 
response  
```bash
{
    "success": true,
    "message": "success",
    "code": 1000,
    "data": {
        "item": [true]
        "item_length": 1,
        "total": 1,
    }
}
```