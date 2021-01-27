# Notifications

알림 설정

## list

알림 설정 목록 호출

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

POST /api/v1/notification/update
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



## mail_list

우편함 알림 목록 호출

GET /api/v1/notification/mail HTTP  
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
# 우편함 알림 목록 호출
curl -X GET --url 'http://rippler.chaeft.com/api/v1/notification/mail' \
-H 'token: token' \
```

response  
```bash

detail_type
0: 신고 
1: 문의답변 

2: 우편함 게시글 공유 
3: 우편함좋아요 
4: 우편함 댓글 
5: 우편함 대댓글 

6: 관심사 투표
7: 관심사 댓글
8: 관심사 대댓글
9: 관심사 댓글 좋아요
10: 정지 해제

{
    "success": true,
    "message": "success",
    "code": 1000,
    "data": {
        "item": [
            {
                "id": 24,
                "detail_type": 3,
                "user_id": 4,
                "thumbnail": 1,
                "post_id": 23,
                "comment_id": null,
                "contents": "444님이 회원님의 게시물에 좋아요 하였습니다.",
                "create_by": "2020-12-24 16:21:26",
                "pages": 1 // 관계없음: 0 / 우편함:1 / 관심사: 2
            },
            {
                "id": 22,
                "detail_type": 4,
                "user_id": 4,
                "thumbnail": 1,
                "post_id": 23,
                "comment_id": 132,
                "contents": "ㄹㅇㅋㅋ",
                "create_by": "2020-12-24 16:00:41",
                "pages": 1 // 관계없음: 0 / 우편함:1 / 관심사: 2
            }
        ],
        "item_length": 2,
        "total": 2
    }
}
```



## interest_list

관심사 알림 목록 호출

GET /api/v1/notification/interest HTTP  
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
# 관심사 알림 목록 호출
curl -X GET --url 'http://rippler.chaeft.com/api/v1/notification/interest' \
-H 'token: token' \
```

response  
```bash

detail_type
0: 신고 
1: 문의답변 

2: 우편함 게시글 공유 
3: 우편함좋아요 
4: 우편함 댓글 
5: 우편함 대댓글 

6: 관심사 투표
7: 관심사 댓글
8: 관심사 대댓글
9: 관심사 댓글 좋아요
10: 정지 해제

{
    "success": true,
    "message": "success",
    "code": 1000,
    "data": {
        "item": [
            {
                "id": 24,
                "detail_type": 3,
                "user_id": 4,
                "thumbnail": 1,
                "post_id": 23,
                "comment_id": null,
                "contents": "444님이 회원님의 게시물에 좋아요 하였습니다.",
                "create_by": "2020-12-24 16:21:26",
                "pages": 2 // 관계없음: 0 / 우편함:1 / 관심사: 2
            },
            {
                "id": 22,
                "detail_type": 4,
                "user_id": 4,
                "thumbnail": 1,
                "post_id": 23,
                "comment_id": 132,
                "contents": "ㄹㅇㅋㅋ",
                "create_by": "2020-12-24 16:00:41",
                "pages": 2 // 관계없음: 0 / 우편함:1 / 관심사: 2
            }
        ],
        "item_length": 2,
        "total": 2
    }
}
```



## Delete

알림 삭제

POST /api/v1/notification/delete
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|id|Int| 알림 id |o|

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
# 알림 삭제
curl -X POST --url 'http://rippler.chaeft.com/api/v1/notification/delete' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "id" : 23
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