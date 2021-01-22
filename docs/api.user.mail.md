# Mail Feed

우편함 게시판


# list
게시물 목록

GET /api/v1/mail/list HTTP  
HOST: rippler.chaeft.com    
token : token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|page|Int| 현재 페이지 숫자 |o|
|limit|Int| 한 페이지에 보여줄 갯수 |x|

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
# 게시물 목록 호출
curl -X GET --url 'http://rippler.chaeft.com/api/v1/mail/list?page=1' \
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
                    },
                    {
                        "name": "pools",
                        "value": 1
                    }
                ]
            },
            {
                "id": 30,
                "mail_id": 33,
                "mail_type": 1,
                "user_id": 3,
                "name": "333",
                "thumbnail": 3,
                "title": "이순신",
                "contents": "캬캬",
                "share": null // 공유한 게시물의 경우 해당 id를 가지고 interest/item 호출
                "count": 0,
                "anonymous": 0,
                "my_post": 0,
                "me": 0,
                "create_by": "2020-12-20 01:53:27",
                "update_by": null,
                "medias": [
                    {
                        "name": "image",
                        "value": 1
                    },
                    {
                        "name": "video",
                        "value": 5
                    },
                    {
                        "name": "pools",
                        "value": 1
                    }
                ]
            },
            ........
        ],
        "item_length": 7,
        "total": 7
    }
}
```



# item
게시물 단건

GET /api/v1/mail/item HTTP  
HOST: rippler.chaeft.com    
token : token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|id|Int| 게시물 id |o|

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
# 게시물 단건 호출
curl -X GET --url 'http://rippler.chaeft.com/api/v1/mail/item?id=1' \
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
                    },
                    {
                        "name": "pools",
                        "value": 1
                    }
                ]
            }
        ],
        "item_length": 1,
        "total": 1
    }
}
```



## insert feed

게시물 작성

POST /api/v1/mail/insert_feed
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|title|String| 제목 |o|
|contents|String| 내용 |o|
|anonymous|Int| 익명 여부 |o|
|share|Int| 관심사 게시물 공유 여부 |x|
|media|Array| 첨부파일 배열 |x|
|friend_list|Array| 공개대상에 추가할 친구 목록 |o|
|pool_list|Array| 공개대상에 추가할 풀 목록 |x|
|mail_type|Int| 게시물 타입 (0:text short, 1:text long, 2:image, 3:video) |o|

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
# 우편함 게시물 작성
curl -X POST --url 'http://rippler.chaeft.com/api/v1/mail/insert_feed' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "title": "이런 게시물",
    "contents": "ㄱㅔㅅㅣㅁㅜㄹ",
    "anonymous": 0,
    "share": 145,
    "media": [
        {"type": "image", "id": 30},
        {"type": "image", "id": 31}
    ],
    "friend_list": [
        1,3,5
    ],
    "pool_list": [
        {"group_id": 9, "count": 4} //(count : 해당 풀에서 추가한 멤버 수) 
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



## update feed

게시물 수정

POST /api/v1/mail/update_feed
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|mail_id|Int| 게시물 내 mail_id |o|
|title|String| 제목 |x|
|contents|String| 내용 |x|

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
# 우편함 게시물 수정
curl -X POST --url 'http://rippler.chaeft.com/api/v1/mail/update_feed' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "mail_id" : 43
    "title": "밥"
    "contents": "바밥",
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



## delete feed

게시물 삭제

POST /api/v1/mail/delete_feed
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|mail_id|Int| 게시물 내 mail_id |o|

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
# 우편함 게시물 삭제
curl -X POST --url 'http://rippler.chaeft.com/api/v1/mail/delete_feed' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "mail_id" : 43
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



# target list
공개대상 목록

GET /api/v1/mail/target_list HTTP  
HOST: rippler.chaeft.com    
token : token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|mail_id|Int| 게시물 본문 mail_id |o|

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
# 게시물 공개 대상 목록 호출
curl -X GET --url 'http://rippler.chaeft.com/api/v1/mail/target_list?mail_id=43' \
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
                "target": [
                    {
                        "friend_id": 1,
                        "name": "111",
                        "thumbnail": 1
                    },
                    {
                        "friend_id": 3,
                        "name": "333",
                        "thumbnail": 1
                    },
                    {
                        "friend_id": 5,
                        "name": "555",
                        "thumbnail": 51
                    }
                ],
                "pool_list: [...]
            },
        ],
        "item_length": 1,
        "total": 1
    }
}
```



## target update

공개대상 수정

POST /api/v1/mail/target_update
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|mail_id|Int| 게시물 내 mail_id |o|
|insert_list|Array| 추가할 친구 id list |x|
|delete_list|Array| 제외할 친구 id list |x|
|pool_list|Array| 게시물에 설정 할 pool list |x|

친구의 경우 추가와 삭제를 나누고
풀의 경우 전체 삭제 하였다가 pool_list에 있는 모든 풀 insert

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
# 게시물 공개대상 수정
curl -X POST --url 'http://rippler.chaeft.com/api/v1/mail/target_update' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "mail_id" : 80
    "pool_list":[
            {"count":1,"pool_id":53},
            {"count":3,"pool_id":52}
    ],
    "insert_list": [12]
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



## like

게시물 좋아요

POST /api/v1/mail/like
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|mail_id|Int| 게시물 내 mail_id |o|

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
# 게시물 좋아요
curl -X POST --url 'http://rippler.chaeft.com/api/v1/mail/like' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "mail_id" : 43
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



## un like

게시물 좋아요 해제

POST /api/v1/mail/un_like
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|mail_id|Int| 게시물 내 mail_id |o|

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
# 게시물 좋아요 해제
curl -X POST --url 'http://rippler.chaeft.com/api/v1/mail/un_like' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "mail_id" : 43
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



# comment list
댓글 목록

GET /api/v1/mail/comment_list HTTP  
HOST: rippler.chaeft.com    
token : token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|id|Int| 게시물 id |o|

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
# 게시물 댓글 목록 호출
curl -X GET --url 'http://rippler.chaeft.com/api/v1/mail/comment_list?id=45' \
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
                "id": 35, // 내가보는 게시물의 댓글 id
                "mail_com_id": 6, // 동일 댓글의 부모 id
                "parent": 0, 
                "contents": "적을내용",
                "user_id": 2,
                "create_by": "2020-12-21 13:42:27",
                "update_by": null,
                "thumbnail": 2,
                "name": "222",
                "me": 0,
                "total_comment_count": 1
            }
        ],
        "item_length": 1,
        "total": 1
    }
}
```



# child comment list
하나의 댓글에 대한 대댓글 목록

GET /api/v1/mail/comment_child_list HTTP  
HOST: rippler.chaeft.com    
token : token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|id|Int| 게시물 id |o|
|mail_com_id|Int| 부모댓글의 parent_id |o|

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
# 하나의 댓글에 대한 대댓글 목록 호출
curl -X GET --url 'http://rippler.chaeft.com/api/v1/mail/comment_child_list?id=34&mail_com_id=35' \
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
                "id": 41,
                "mail_com_id": 2,
                "parent": 35,
                "contents": "qweqweqw",
                "user_id": 2,
                "create_by": "2020-12-22 17:16:59",
                "update_by": null,
                "thumbnail": 2,
                "name": "222",
                "me": 0
            }
        ],
        "item_length": 1,
        "total": 1
    }
}
```



## insert comment

댓글 작성

POST /api/v1/mail/insert_comment
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|mail_id|Int| 게시글 본문인 mail_id |o|
|user_id|Int| 게시글 작성자 id |o|
|parent|Int| 댓글, 대댓글 여부(0:댓글 / 이외 : 대댓글(댓글의 mail_com_id 입력)) |o|
|id|Int| 게시글 id |o|
|contents|String| 내용 |o|


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
# 댓글 작성
curl -X POST --url 'http://rippler.chaeft.com/api/v1/mail/insert_comment' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "mail_id": 43,
    "user_id": 4,
    "parent": 0, //대댓글일 경우 댓글의 mail_com_id 입력
    "id": 47,
    "contents": "abcabc"
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



## update comment

댓글 수정

POST /api/v1/mail/update_comment
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|mail_id|Int| 게시글 본문인 mail_id |o|
|user_id|Int| 게시글 작성자 id |o|
|mail_com_id|Int| 댓글 공통 id |o|
|mail_child_id|Int| 게시글 id |o|
|contents|String| 내용 |o|


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
# 댓글 수정
curl -X POST --url 'http://rippler.chaeft.com/api/v1/mail/update_comment' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "mail_id": 43,
    "user_id": 4,
    "mail_com_id": 14,
    "mail_child_id": 52,
    "contents": "abcabc"
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



## delete comment

댓글 삭제

POST /api/v1/mail/delete_comment
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|mail_com_id|Int| 댓글 공통 id |o|


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
# 댓글 삭제
curl -X POST --url 'http://rippler.chaeft.com/api/v1/mail/delete_comment' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "mail_com_id": 14
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