# Friend 

친구 정보

## list

친구 리스트

GET /api/v1/friend/list HTTP  
HOST: rippler.chaeft.com    
token : token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|name|String|친구 이름 검색어|x|


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
# 친구 목록 호출
curl -X GET --url 'http://rippler.chaeft.com/api/v1/friend/list' \
-H 'token: token' \
```

response  
```bash
{
    "success": true,
    "message": "success",
    "code": 1000,
    "data": {
        "friend": [
            {
                "id": 2,
                "friend_name": "222",
                "set_nickname": null,
                "thumbnail": null,
                "status_msg": null,
                "favorite": 0
            },
            {
                "id": 1,
                "friend_name": "111",
                "set_nickname": null,
                "thumbnail": null,
                "status_msg": null,
                "favorite": 0
            },
            {
                "id": 3,
                "friend_name": "333",
                "set_nickname": null,
                "thumbnail": null,
                "status_msg": null,
                "favorite": 1
            }
        ]
    }
}
```



## item

친구 단수 호출

GET /api/v1/friend/item?fid=:fid HTTP  
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
# 회원 정보 호출
curl -X GET --url 'http://rippler.chaeft.com/api/v1/friend/item?fid=1' \
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
                "id": 1,
                "friend_name": "111",
                "set_nickname": null,
                "thumbnail": null,
                "status_msg": null,
                "favorite": 0
            }
        ],
        "item_length": 1,
        "total": 1
    }
}
```



## sync

최초 친구 동기화 시 /sync => /add   
전화번호부 가져오기

POST /api/v1/friend/sync HTTP  
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token
 
### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|content_list|Array|전화번호부(num, name)|o|

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
# 전화번호부 가져오기
curl -X POST --url 'http://rippler.chaeft.com/api/v1/friend/sync' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "content_list" : [
        {"num": "01011111111", "name": "김철수"},
        {"num": "01022222222", "name": "강민수"},
        {"num": "01033333333", "name": "유민철"}
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
            3
        ],
        "item_length": 1,
        "total": 1
    }
}
```



## add

서로 친구인 유저 친구에 추가

POST /api/v1/friend/add HTTP  
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
# 서로 전화번호부에 보유중인 유저 친구 추가
curl -X POST --url 'http://rippler.chaeft.com/api/v1/friend/add' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
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




## nickname edit

친구 닉네임 변경

POST /api/v1/friend/nickname_edit HTTP  
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|nickname|String|변경 할 닉네임|o|
|friend_id|Int|친구 user id|o|

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
# 친구 닉네임 변경
curl -X POST --url 'http://rippler.chaeft.com/api/v1/friend/nickname_edit' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "nickname": "철수",
    "friend_id": 1
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
            1
        ],
        "item_length": 1,
        "total": 1
    }
}
```




## favorite

즐겨찾기

POST /api/v1/friend/favorite HTTP  
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|friend_id|Int|친구 user id|o|

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
# 친구 즐겨찾기
curl -X POST --url 'http://rippler.chaeft.com/api/v1/friend/favorite' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "friend_id": 1
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




## blind

블라인드 풀

POST /api/v1/friend/blind HTTP  
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|blind_list|Array| 블라인드풀에 넣을 friend_id list |o|

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
curl -X POST --url 'http://rippler.chaeft.com/api/v1/friend/blind' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "blind_list" : [
        1,2,3
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




## setting_state

설정 상태 확인

GET /api/v1/friend/setting_state HTTP  
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
# 현재 설정 상태 호출
curl -X GET --url 'http://rippler.chaeft.com/api/v1/friend/setting_state' \
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
                "auto": 1,
                "blind": 0
            }
        ],
        "item_length": 1,
        "total": 1
    }
}
```




## settings

동기화 설정

POST /api/v1/friend/settings HTTP  
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|blind|Int|동기화시 블라인드 여부 default: 0(x), 1(o)|x|
|auto|Int|자동 동기화 default: 1(o), 0(x)|x|

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
# 동기화 설정
curl -X POST --url 'http://rippler.chaeft.com/api/v1/friend/settings' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "blind":1,
    "auto": 1
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