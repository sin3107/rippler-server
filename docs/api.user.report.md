# Reports

신고



## report reason

신고 사유 호출

GET /api/v1/report/report_reason HTTP  
HOST: rippler.chaeft.com
Content-Type: application/json;charset=utf-8  

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
# 신고 사유
curl -X GET --url 'http://rippler.chaeft.com/api/v1/report/report_reason' \
-H 'Content-Type: application/json;charset=utf-8' \
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
                "value": "성희롱이거나 음란한 내용입니다."
            },
            {
                "id": 6,
                "value": "누군가를 괴롭히거나 분쟁을 조장하는 내용입니다."
            },
            {
                "id": 7,
                "value": "폭력적이고 잔인한 내용이거나 공포심·혐오심이 드는 내용입니다."
            },
            {
                "id": 8,
                "value": "특정 집단을 공격하거나 반사회적 내용이 포함되어 있는 혐오성 글입니다."
            }
        ],
        "item_length": 1,
        "total": 1,
    }
}
```


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