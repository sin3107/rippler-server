# Pools

풀 정보

## list

풀 목록 호출

GET /api/v1/pool/list HTTP  
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
curl -X GET --url 'http://rippler.chaeft.com/api/v1/pool/list' \
-H 'token: token' \
```

response  
```bash
{
    "success": true,
    "message": "success",
    "code": 1000,
    "data": {
        "pool_list": [
            {
                "id": 2,
                "name": "2번",
                "thumbnail": 2,
                "favorite": 0,
                "cnt": 3
            }
        ],
        "favorite_pool_list": [
            {
                "id": 1,
                "name": "1번",
                "thumbnail": 1,
                "favorite": 1,
                "cnt": 4
            }
        ],
        "blind_cnt": [
            {
                "cnt": 0
            }
        ]
    }
}
```


## single list

풀 단일 항목 친구 목록 호출

GET /api/v1/pool/single_list?gid=:gid HTTP  
HOST: rippler.chaeft.com
token : token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|gid|Int|그룹id|o|

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
curl -X GET --url 'http://rippler.chaeft.com/api/v1/pool/single_list?gid=1' \
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
                "thumbnail": null,
                "status_msg": null
            },
            {
                "id": 2,
                "friend_name": "222",
                "thumbnail": null,
                "status_msg": null
            },
            {
                "id": 3,
                "friend_name": "333",
                "thumbnail": null,
                "status_msg": null
            },
            {
                "id": 4,
                "friend_name": "444",
                "thumbnail": null,
                "status_msg": null
            }
        ],
        "item_length": 4,
        "total": 4
    }
}
```


## create

풀 생성

POST /api/v1/pool/create HTTP  
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|name|String|풀 이름|o|
|friend_list|Array|풀에 들어갈 friend_id list|o|
|thumbnail|Int|썸네일 id|o|
|favorite|Int|즐겨찾기 여부 0:x/1:o|o|

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
curl -X POST --url 'http://rippler.chaeft.com/api/v1/pool/create' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "name" : "1번",
    "thumbnail" : 1,
    "favorite" : true,
    "friend_list": [
        1, 2, 3
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


## update

풀 수정(이름, 썸네일, 멤버)

POST /api/v1/pool/update HTTP  
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|id|String|풀 이름|o|
|name|Array|풀에 들어갈 friend_id list|x|
|thumbnail|Int|썸네일 id|x|
|insert_list|Array|추가 할 friend_id list|x|
|delete_list|Array|제거 할 friend_id list|x|

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
curl -X POST --url 'http://rippler.chaeft.com/api/v1/pool/update' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "id" : 1,
    "name" : "abc",
    "thumbnail" : 1
}'

or 

-d '{
    "id" : 1,
    "insert_list" : [1,2,3],
    "delete_list" : [4]
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