# Reports

신고

## interest report feed

관심사 게시물 신고

POST /api/v1/report/interest_feed
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|suspect|Int| 피의자(user_id) |o|
|reason|String| 사유 다수를 문자열로 |o|
|content_id|Int| 해당 글의 id |o|

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
# 관심사 게시물 신고
curl -X POST --url 'http://rippler.chaeft.com/api/v1/report/interest_feed' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "suspect": 55,
    "reason": "1,3",
    "content_id": 5
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



## interest report comment

관심사 댓글 신고

POST /api/v1/report/interest_comment
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|suspect|Int| 피의자(user_id) |o|
|reason|String| 사유 다수를 문자열로 |o|
|content_id|Int| 해당 글의 id |o|

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
# 관심사 댓글 신고
curl -X POST --url 'http://rippler.chaeft.com/api/v1/report/interest_comment' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "suspect": 55,
    "reason": "1,3",
    "content_id": 5
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





## mail report feed

우편함 게시물 신고

POST /api/v1/report/mail_feed
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|suspect|Int| 피의자(user_id) |o|
|reason|String| 사유 다수를 문자열로 |o|
|content_id|Int| 해당 글의 id |o|

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
# 우편함 게시물 신고
curl -X POST --url 'http://rippler.chaeft.com/api/v1/report/mail_feed' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "suspect": 55,
    "reason": "1,3",
    "content_id": 5
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



## mail report comment

우편함 댓글 신고

POST /api/v1/report/mail_comment
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|suspect|Int| 피의자(user_id) |o|
|reason|String| 사유 다수를 문자열로 |o|
|content_id|Int| 해당 댓글의 id |o|

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
# 우편함 댓글 신고
curl -X POST --url 'http://rippler.chaeft.com/api/v1/report/mail_comment' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "suspect": 55,
    "reason": "1,3",
    "content_id": 5
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