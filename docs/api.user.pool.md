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
|name|String|풀 이름 검색어|x|

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
# 풀 목록 호출
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
        "item": [
            {
                "id": 3,
                "name": "1",
                "thumbnail": 1,
                "favorite": 1,
                "cnt": 0
            },
            {
                "id": 4,
                "name": "2",
                "thumbnail": 2,
                "favorite": 1,
                "cnt": 0
            },
            
            {
                "id": 5,
                "name": "3",
                "thumbnail": 3,
                "favorite": 0,
                "cnt": 0
            },
            {
                "id": 12,
                "name": "내내",
                "thumbnail": 2,
                "favorite": 0,
                "cnt": 3
            },
        ],
        "blind_cnt": 1,
        "item_length": 4,
        "total": 4
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
# 풀 단일 항목 친구 호출
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



## favorite

즐겨찾기

POST /api/v1/pool/favorite HTTP  
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|group_id|Int|풀 group id|o|

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
# 풀 즐겨찾기 설정
curl -X POST --url 'http://rippler.chaeft.com/api/v1/pool/favorite' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "group_id": 1
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
# 풀 생성
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
|id|String|풀 id|o|
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
# 풀 수정
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




## delete

풀 삭제

POST /api/v1/pool/delete HTTP  
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|group_id|Int|풀 group id|o|


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
# 풀 삭제
curl -X POST --url 'http://rippler.chaeft.com/api/v1/pool/delete' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "group_id" : 1
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



# sent list
해당 풀에 보낸 게시물 목록

GET /api/v1/pool/sent_list HTTP  
HOST: rippler.chaeft.com    
token : token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|page|Int| 현재 페이지 숫자 |o|
|limit|Int| 한 페이지에 보여줄 갯수 |x|
|id|Int| 해당 풀 id |o|

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
# 해당 풀에 보낸 게시물 목록 호출
curl -X GET --url 'http://rippler.chaeft.com/api/v1/pool/sent_list?id=9&page=1' \
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
                "id": 42,
                "mail_id": 32,
                "mail_type": 1, //게시물 타입 (0:text short, 1:text long, 2:image, 3:video)
                "user_id": 5,
                "name": "555",
                "thumbnail": 5,
                "title": "세에~",
                "contents": "세에에에에에",
                "share": null // 공유한 게시물의 경우 해당 id를 가지고 interest/item 호출
                "count": 0,
                "anonymous": 0,
                "my_post": 0,
                "me": 0,
                "create_by": "2020-12-18 17:04:29",
                "update_by": "2020-12-22 16:57:13",
                "medias": [
                    {
                        "name": "image",
                        "value": 1
                    },
                    {
                        "name": "video",
                        "value": 5
                    }
                ]
            },
        ],
        "item_length": 1,
        "total": 1
    }
}
```