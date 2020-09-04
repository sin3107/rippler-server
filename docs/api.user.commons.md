# role and capability

사용자 공통 API

## roles

회원 유형

GET /api/commons/roles HTTP  
HOST: hearo.chaeft.com   

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|

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
curl -X POST --url 'https://hearo.chaeft.com/api/commons/roles'
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

## capabilities

회원 유형별 능력
( 소방공무원의 경우 > 보직, 소방공무원 가족의 경우 소방공무원 보직, 전문가의 경우 전문가 유형)  

GET /api/commons/capability?role={roleId} HTTP  
HOST: hearo.chaeft.com   

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|role|int| roles에서 선택된 role id |o|

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
curl -X POST --url 'https://hearo.chaeft.com/api/commons/capability?role=1'
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