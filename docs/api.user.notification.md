# Notifications

알림 설정

## list

알림 목록 호출

GET /api/v1/notification/list HTTP  
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
# 알림 목록 호출
curl -X GET --url 'http://rippler.chaeft.com/api/v1/notification/list' \
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
                "mail_feed_count": 1,
                "mail_comment": 0,
                "mail_comment_child": 1,
                "interest_keyword": 1,
                "interest_comment": 1,
                "interest_comment_child": 1,
                "interest_comment_count": 1
            }
        ],
        "item_length": 1,
        "total": 1
    }
}
```


## Update

알림 설정 수정

GET /api/v1/notification/update
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|mail_feed_count|Int| 우편함 피드 좋아요 |x|
|mail_comment|Int| 우편함 댓글 |x|
|mail_comment_child|Int| 우편함 대댓글 |x|
|interest_keyword|Int| 관심사 키워트 투표 |x|
|interest_comment|Int| 관심사 댓글 |x|
|interest_comment_child|Int| 관심사 대댓글 |x|
|interest_comment_count|Int| 관심사 댓글 좋아요 |x|
하나 이상 필수

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
# 알림 설정 수정
curl -X POST --url 'http://rippler.chaeft.com/api/v1/notification/update' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "mail_feed_count" : 1,
    "mail_comment" : 0
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