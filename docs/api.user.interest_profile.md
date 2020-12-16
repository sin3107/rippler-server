# Interest Profile

관심사 프로필

## list
 
프로필 목록 호출

GET /api/v1/interest_profile/list HTTP  
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
# 프로필 목록 호출
curl -X GET --url 'http://rippler.chaeft.com/api/v1/interest_profile/list' \
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
                "id": 4,
                "profile_order": null,
                "profile_type": null,
                "nickname": "aaa",
                "status_msg": "a",
                "thumbnail": 1
            },
            {
                "id": 5,
                "profile_order": null,
                "profile_type": null,
                "nickname": "bbb",
                "status_msg": "bbb",
                "thumbnail": 1
            }
        ],
        "item_length": 2,
        "total": 2
    }
}
```



## Info
 
프로필 정보 확인

GET /api/v1/interest_profile/info?id=:id HTTP  
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
# 프로필 정보 호출
curl -X GET --url 'http://rippler.chaeft.com/api/v1/interest_profile/info?id=1' \
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
                "nickname": "bbb",
                "status_msg": "bbb",
                "thumbnail": 1
            }
        ],
        "item_length": 1,
        "total": 1
    }
}
```



## edit

프로필 수정

POST /api/v1/interest_profile/edit
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|id|Int| 프로필 id |o|
|nickname|String| 닉네임 |x / 아래 3개중 1개 이상 필수|
|thumbnail|Int| 대표 이미지 |x|
|status_msg|String| 상태 메시지 |x|

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
# 프로필 정보 수정
curl -X POST --url 'http://rippler.chaeft.com/api/v1/interest_profile/edit' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "id" : 5
    "nickname" : "abcd",
    "thumbnail" : 1,
    "status_msg" : "가나다라"
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



## add

프로필 추가

POST /api/v1/interest_profile/add
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|nickname|String| 닉네임 |o|
|profile_order|Int| 프로필 순서 |o|
|profile_type|Int| 대표 프로필 여부 0:x, 1:o |o|
|thumbnail|Int| 대표 이미지 |x|
|status_msg|String| 상태 메시지 |x|

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
# 프로필 추가
curl -X POST --url 'http://rippler.chaeft.com/api/v1/interest_profile/add' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "nickname" : "abcd",
    "profile_order" : 2,
    "profile_type" : 1,
    "thumbnail" : 1,
    "status_msg" : "가나다라"
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
            6
        ],
        "item_length": 1,
        "total": 1
    }
}
```



## del

프로필 삭제

POST /api/v1/interest_profile/del
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|id|Int| 프로필 id |o|

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
# 프로필 삭제
curl -X POST --url 'http://rippler.chaeft.com/api/v1/interest_profile/del' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "id" : 6
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



## order set

프로필 순서 설정

POST /api/v1/interest_profile/order_set
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|profile_list|Array| 프로필id, 순서 |o|

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
# 프로필 삭제
curl -X POST --url 'http://rippler.chaeft.com/api/v1/interest_profile/order_set' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "profile_list" : [
            {"id":4, "profile_order": 2},
            {"id":5, "profile_order": 1},
            {"id":7, "profile_order": 3}
    ]
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



## rep profile

대표 프로필 설정

POST /api/v1/interest_profile/rep_profile
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|profile_list|Array| 프로필id, 순서 |o|

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
# 대표 프로필 설정
curl -X POST --url 'http://rippler.chaeft.com/api/v1/interest_profile/rep_profile' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "id" : 6
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



## main
 
프로필 메인 화면

GET /api/v1/interest_profile/main HTTP  
HOST: rippler.chaeft.com    
token : token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|profile_id|Int| 프로필 id |o|

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
# 프로필 메인화면 호출
curl -X GET --url 'http://rippler.chaeft.com/api/v1/interest_profile/main?profile_id=:pid' \
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
                "id": 2,
                "sum": 214,
                "media": 2
            },
            {
                "id": 3,
                "sum": 392,
                "media": 3
            },
            {
                "id": 4,
                "sum": 600,
                "media": 4
            },
            {
                "id": 5,
                "sum": 1089,
                "media": 5
            },
            {
                "id": 6,
                "sum": 666,
                "media": 6
            },
        ],
        "item_length": 5,
        "total": 5
    }
}
```