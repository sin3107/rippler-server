# User Auth

사용자 Authorization

## OAuth Exists

OAuth 있는지 확인  

POST /api/auth/exists/oauth HTTP  
HOST: hearo.chaeft.com  
Content-Type: application/json;charset=utf-8  

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|provider|String| 제공업체, 제공자 |o|
|authId|String| 제공업체, 제공자가 제공하는 id |o|

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
curl -X POST --url 'https://hearo.chaeft.com/api/auth/exists/oauth' \
-H 'Content-Type: application/json;charset=utf-8' \
-d '{
    "provider":"kakao",
    "authId":"12341234"
}'
```

response  
```bash
{
    "success": true,
    "message": "success",
    "code": 1000,
    "data": {
        "item": [],
        "item_length": 0,
        "total": 0,
    }
}
```

## email Exists

이메일 있는지 확인  

POST /api/auth/exists/email HTTP  
HOST: hearo.chaeft.com  
Content-Type: application/json;charset=utf-8  

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|email|String| 이메일 |o|

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
curl -X POST --url 'https://hearo.chaeft.com/api/auth/exists/email' \
-H 'Content-Type: application/json;charset=utf-8' \
-d '{
    "email":"email@gmail.com"
}'
```

response  
```bash
{
    "success": true,
    "message": "success",
    "code": 1000,
    "data": {
        "item": [],
        "item_length": 0,
        "total": 0,
    }
}
```

## nickname Exists

닉네임 있는지 확인  

POST /api/auth/exists/nickname HTTP  
HOST: hearo.chaeft.com  
Content-Type: application/json;charset=utf-8  

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|provider|String| 제공업체, 제공자 |o|
|authId|String| 제공업체, 제공자가 제공하는 id |o|

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
curl -X POST --url 'https://hearo.chaeft.com/api/auth/exists/nickname' \
-H 'Content-Type: application/json;charset=utf-8' \
-d '{
    "nickname":"닉네임"
}'
```

response  
```bash
{
    "success": true,
    "message": "success",
    "code": 1000,
    "data": {
        "item": [],
        "item_length": 0,
        "total": 0,
    }
}
```