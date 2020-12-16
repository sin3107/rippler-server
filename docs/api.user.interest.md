# Interest Feed

관심사 피드

## list
 
프로필 목록 호출

GET /api/v1/interest/list HTTP  
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
curl -X GET --url 'http://rippler.chaeft.com/api/v1/interest/list' \
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
                "profile_order": 1,
                "profile_type": 0,
                "nickname": "aaa",
                "status_msg": "a",
                "thumbnail": 1
            },
            {
                "id": 5,
                "profile_order": 2,
                "profile_type": 1,
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



## insert feed

관심사 게시물 작성

POST /api/v1/interest_profile/insert_feed
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|profile_id|Int| 프로필 id |o|
|title|String| 제목 |o|
|contents|String| 내용 |o|
|media|Int| 첨부파일 id |x|
|media_type|String| 첨부파일 type(image / video) |x|
|keyword_list|Array| 키워드 text 배열 |o|


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
# 관심사 게시물 작성
curl -X POST --url 'http://rippler.chaeft.com/api/v1/interest/insert_feed' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "profile_id" : 7,
    "title" : "abcd",
    "contents": "efgh",
    "media" : 1,
    "media_type" : "image",
    "keyword_list": [
        "평가", "헤비급"
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


