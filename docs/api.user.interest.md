# Keyword

관심사 키워드


## keyword list

키워드 목록

GET /api/v1/keyword/list HTTP
HOST : rippler.chaeft.com
token : token


## request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|

## response

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
# 키워드 목록
curl -X GET --url 'http://rippler.chaeft.com/api/v1/keyword/list' \
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
                "category_id": 1,
                "category_name": " 친구",
                "child": "
                    [{\"id\": 11, \"name\": \"친구\"},{\"id\": 12, \"name\": \"우정\"},
                    {\"id\": 13, \"name\": \"친구공유\"},{\"id\": 14, \"name\": \"친구구함\"},
                    {\"id\": 15, \"name\": \"마음\"},{\"id\": 16, \"name\": \"속마음\"}]"
            },
            {
                "category_id": 2,
                "category_name": " 연애",
                "child": "
                    [{\"id\": 17, \"name\": \"연애\"},{\"id\": 18, \"name\": \"사랑\"},
                    {\"id\": 19, \"name\": \"커플\"},{\"id\": 24, \"name\": \"고백\"},{\"id\": 25, \"name\": \"썸\"},
                    {\"id\": 26, \"name\": \"애인\"},{\"id\": 27, \"name\": \"여사친\"},{\"id\": 28, \"name\": \"남사친\"},
                    {\"id\": 29, \"name\": \"남자친구\"},{\"id\": 30, \"name\": \"여자친구\"}]"
            },
            {
                "category_id": 3,
                "category_name": " 평가",
                "child": "[{\"id\": 31, \"name\": \"평가\"}]"
            },
            {
                "category_id": 4,
                "category_name": " 없음",
                "child": null
            }
        ],
        "item_length": 4,
        "total": 4
    }
}
```



## user keyword setting

유저 키워드 설정

POST /api/v1/keyword/user_setting HTTP
HOST : rippler.chaeft.com
token : token


## request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|insert_list|Array|추가 할 키워드 id list|x|
|delete_list|Array|제거 할 키워드 id list|x|
둘 중 최소 1개는 필수

## response

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
# 유저 키워드 설정
curl -X POST --url 'http://rippler.chaeft.com/api/v1/keyword/user_setting' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "insert_list" : [1,2]
}'
```

response  
```bash
{
    "success": true,
    "message": "success",
    "code": 1000,
    "data": {
        "item": [true],
        "item_length": 1,
        "total": 1
    }
}
```



## my keywords

내가 설정한 키워드 목록

GET /api/v1/keyword/me HTTP
HOST : rippler.chaeft.com
token : token


## request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|

## response

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
# 내가 설정한 키워드
curl -X GET --url 'http://rippler.chaeft.com/api/v1/keyword/me' \
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
                "id": 11,
                "keyword_name": "친구"
            },
            {
                "id": 12,
                "keyword_name": "우정"
            },
            {
                "id": 13,
                "keyword_name": "친구공유"
            }
        ],
        "item_length": 3,
        "total": 3
    }
}
```



## hot keywords

인기 키워드 목록

GET /api/v1/keyword/hot HTTP
HOST : rippler.chaeft.com
token : token


## request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|

## response

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
# 인기 키워드
curl -X GET --url 'http://rippler.chaeft.com/api/v1/keyword/hot' \
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
                "id": 12,
                "keyword_name": "우정",
                "count": 2
            },
            {
                "id": 17,
                "keyword_name": "연애",
                "count": 1
            },
            {
                "id": 28,
                "keyword_name": "남사친",
                "count": 1
            }
        ],
        "item_length": 3,
        "total": 3
    }
}
```