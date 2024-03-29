# User Info

사용자 정보


## Info
 
사용자 정보 확인

GET /api/v1/user/info HTTP  
HOST: rippler.chaeft.com    
token : token

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
# 회원 정보 호출
curl -X GET --url 'http://rippler.chaeft.com/api/v1/user/info' \
-H 'token: token' \
```

response  
```bash
{
    "success": true,
    "message": "success",
    "code": 1000,
    "data": {
        "item": [
                    {
                        "id": 5,
                        "num": "555",
                        "name": "555",
                        "email": "5555",
                        "birth": "555",
                        "gender": 1
                    }
        ],
        "item_length": 1,
        "total": 1
    }
}
```



## get Info

사용자 정보 확인( 단일 )

GET /api/v1/user/get_info?type= HTTP  
HOST: rippler.chaeft.com    
token : token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|type|String|name, email, birth, gender 중 1개|o|

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
# 회원 정보 호출( 단일 )
curl -X GET --url 'http://rippler.chaeft.com/api/v1/user/get_info?type=name' \
-H 'token: token' \
```

response  
```bash
{
    "success": true,
    "message": "success",
    "code": 1000,
    "data": {
        "item": [
            {
                "name": "555"
            }
        ],
        "item_length": 1,
        "total": 1
    }
}
```



## edit

회원 정보 수정

POST /api/v1/user/edit HTTP  
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|name|String| 유저 이름 (4개중 1개 이상 필수) |x|
|email|String| 유저 이메일 |x|
|birth|String| 유저 생년월일 |x|
|gender|String| 유저 성별 (1:남자, 2:여자) |x|

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
# 블라인드풀에 추가
curl -X POST --url 'http://rippler.chaeft.com/api/v1/user/edit' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
        "name" : "김철수"
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
            true
        ],
        "item_length": 1,
        "total": 1
    }
}
```



## pass chk

비밀번호 확인

POST /api/v1/user/pass_chk HTTP  
HOST: rippler.chaeft.com
Content-Type: application/json;charset=utf-8  
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
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
# 비밀번호 확인
curl -X POST --url 'http://rippler.chaeft.com/api/v1/user/pass_chk' \
-H 'Content-Type: application/json;charset=utf-8' 'token': token \
-d '{
    "password": "12312344"
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



## sms_auth_req

번호 인증 요청

POST /api/v1/user/sms_auth_req HTTP  
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
curl -X POST --url 'http://rippler.chaeft.com/api/v1/user/sms_auth_req' \
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

인증 확인 및 번호변경

POST /api/v1/user/sms_auth_res HTTP  
HOST: rippler.chaeft.com
Content-Type: application/json;charset=utf-8  
token: token

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
curl -X POST --url 'http://rippler.chaeft.com/api/v1/user/sms_auth_res' \
-H 'Content-Type: application/json;charset=utf-8' 'token': token \
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



## phone chk

휴대폰 정보 확인

POST /api/v1/user/phone_chk HTTP  
HOST: rippler.chaeft.com
Content-Type: application/json;charset=utf-8  
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|device_id|String| 휴대폰 id |o|
|device_model|String| 휴대폰 모델 |o|
|num|String| 전화번호 |o|

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
# 휴대폰 정보 확인
curl -X POST --url 'http://rippler.chaeft.com/api/v1/user/phone_chk' \
-H 'Content-Type: application/json;charset=utf-8' 'token': token \
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



## authorized

인증 친구 호출

GET /api/v1/user/authorized HTTP  
HOST: rippler.chaeft.com
token: token

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
# 인증 친구호출
curl -X GET --url 'http://rippler.chaeft.com/api/v1/user/authorized' \
-H 'token': token \
`
```

response  
```bash
{
    "success": true,
    "message": "success",
    "code": 1000,
    "data": {
        "item": [
            {id: 1, name: "asd"},
            {id: 1, name: "asd"},
            {id: 1, name: "asd"},
            {id: 1, name: "asd"},
            {id: 1, name: "asd"},
            {id: 1, name: "asd"},
            {id: 1, name: "asd"}
        ],
        "value" : "884a4eece38ce5c0ad67dfa41df7ad479332c5dc126c464d954970a745a19bfb",
        "item_length": 1,
        "total": 1,
    }
}
```



## check

친구 확인

POST /api/v1/user/check HTTP  
HOST: rippler.chaeft.com
Content-Type: application/json;charset=utf-8  
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|id|Int| 친구 id |o|
|name|String| 친구 이름 |o|
|value|String|암호화 비교 값|o|

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
# 친구 확인
curl -X POST --url 'http://rippler.chaeft.com/api/v1/user/check' \
-H 'Content-Type: application/json;charset=utf-8' 'token': token \
-d `{
    "id" : 3,
    "name" : "asd",
    "value" : "884a4eece38ce5c0ad67dfa41df7ad479332c5dc126c464d954970a745a19bfb"
}
`
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



## authorized pool

인증 풀 호출

GET /api/v1/user/authorized_pool HTTP  
HOST: rippler.chaeft.com
token: token

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
# 인증 풀 호출
curl -X GET --url 'http://rippler.chaeft.com/api/v1/user/authorized_pool' \
-H 'token': token \
`
```

response  
```bash
{
    "success": true,
    "message": "success",
    "code": 1000,
    "data": {
        "item": [
            {id: 1, name: "asd"},
            {id: 1, name: "asd"},
            {id: 1, name: "asd"},
            {id: 1, name: "asd"},
            {id: 1, name: "asd"},
            {id: 1, name: "asd"},
            {id: 1, name: "asd"}
        ]
        "value" : "884a4eece38ce5c0ad67dfa41df7ad479332c5dc126c464d954970a745a19bfb",
        "item_length": 1,
        "total": 1,
    }
}
```



## check_pool

풀 확인

POST /api/v1/user/check_pool HTTP  
HOST: rippler.chaeft.com
Content-Type: application/json;charset=utf-8  
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|id|Int| 풀 id |o|
|name|String| 풀 이름 |o|
|value|String|암호화 비교 값|o|

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
# 풀 확인
curl -X POST --url 'http://rippler.chaeft.com/api/v1/user/check_pool' \
-H 'Content-Type: application/json;charset=utf-8' 'token': token \
-d `{
    "id" : 3,
    "name" : "asd",
    "value" : "884a4eece38ce5c0ad67dfa41df7ad479332c5dc126c464d954970a745a19bfb"
}
`
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




## count_authorized

인증 실패 카운트

POST /api/v1/user/count_authorized HTTP  
HOST: rippler.chaeft.com
Content-Type: application/json;charset=utf-8  
token: token

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
# 인증 실패 카운트 
curl -X POST --url 'http://rippler.chaeft.com/api/v1/user/count_authorized' \
-H 'Content-Type: application/json;charset=utf-8' 'token': token \
`
```

response  
```bash
{
    "success": true,
    "message": "success",
    "code": 1000,
    "data": {
        "item": [3] // 현재 실패 횟수
        "item_length": 1,
        "total": 1,
    }
}


5회 실패 시
{
    "success": true,
    "message": "authorized failed"
    "code": 2006,
    "data": {
        "item": [5] // 현재 실패 횟수
        "item_length": 1,
        "total": 1,
    }
}
```






## phone update

휴대폰 정보 수정

POST /api/v1/user/phone_update HTTP  
HOST: rippler.chaeft.com
Content-Type: application/json;charset=utf-8  
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|device_id|String| 휴대폰 id SSAID & UDID |x|
|device_token|String| 휴대폰 토큰 |x|
|device_platform|String| 휴대폰 OS 종류 |x|
|device_brand|String| 휴대폰 브랜드 |x|
|device_model|String| 휴대폰 모델 |x|
|device_version|String| 휴대폰 버전 |x|
|num|String| 전화번호 |x|

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
# 휴대폰 정보 수정
curl -X POST --url 'http://rippler.chaeft.com/api/v1/user/phone_update' \
-H 'Content-Type: application/json;charset=utf-8' 'token': token \
-d `{
    num : "01011112222"
}
`
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



## secession

탈퇴

POST /api/v1/user/secession HTTP  
HOST: rippler.chaeft.com
Content-Type: application/json;charset=utf-8  
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|reason|String| 사유 |o|


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
# 회원 탈퇴
curl -X POST --url 'http://rippler.chaeft.com/api/v1/user/secession' \
-H 'Content-Type: application/json;charset=utf-8' 'token': token \
-d '
{
    "reason": "abcd"
}
'
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