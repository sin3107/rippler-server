# Interest Feed

관심사 피드

## list
 
관심사 피드 호출

GET /api/v1/interest/list HTTP  
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
# 관심사 피드 호출
curl -X GET --url 'http://rippler.chaeft.com/api/v1/interest/list?page=1' \
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
                "id": 25,
                "title": "😩☺️😂😊❤️❤️❤️❤️",
                "contents": "Arerawrwaerwarwaer",
                "user_id": 127,
                "profile_id": 17,
                "me": 1,
                "nickname": "aaaaa11111",
                "thumbnail": 173,
                "create_by": "2021-01-25 10:56:10",
                "keywords": [
                    {
                        "id": 91,
                        "keyword_id": 11,
                        "name": "친구",
                        "cnt": 1,
                        "me": 1
                    },
                    ...
                ],
                "media": [
                    {
                        "id": 175,
                        "type": "image"
                    }
                ],
                "total_count": 3,
                "comment_count": 1,
                "post_type": 2
            },
            {
                "id": 1,
                "title": "1번글",
                "contents": "1번글",
                "user_id": 5,
                "profile_id": 5,
                "me": 0,
                "nickname": "bbb",
                "thumbnail": 1,
                "create_by": "2020-12-18 14:07:06",
                "keywords": [
                    {
                        "id": 1,
                        "keyword_id": 11,
                        "name": "친구",
                        "cnt": 20,
                        "me": 0
                    },
                    ...
                ],
                "media": [
                    {
                        "id": 5,
                        "type": "image"
                    },
                    ...
                ],
                "total_count": 109,
                "comment_count": 15,
                "post_type": 0
            }
        ],
        "item_length": 2,
        "total": 2
    }
}
```



## item
 
관심사 게시물 단일 호출

GET /api/v1/interest/item HTTP  
HOST: rippler.chaeft.com    
token : token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|post_id|Int| 게시물 id |o|

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
# 관심사 게시물 단일 호출
curl -X GET --url 'http://rippler.chaeft.com/api/v1/interest/item?post_id=1' \
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
                "profile_id": 5,
                "user_id": 5,
                "me": 0,
                "nickname": "bbb",
                "thumbnail": 1,
                "create_by": "2020-12-18 14:07:06",
                "update_by": null,
                "title": "1번글",
                "contents": "1번글",
                "keywords": [
                    {
                        "id": 7,
                        "keyword_id": 17,
                        "keyword_name": "연애",
                        "count": 22,
                        "me": 0
                    },
                    {
                        "id": 1,
                        "keyword_id": 11,
                        "keyword_name": "친구",
                        "count": 20,
                        "me": 0
                    },
                    {
                        "id": 4,
                        "keyword_id": 14,
                        "keyword_name": "친구구함",
                        "count": 18,
                        "me": 0
                    },
                    {
                        "id": 10,
                        "keyword_id": 24,
                        "keyword_name": "고백",
                        "count": 17,
                        "me": 0
                    },
                    {
                        "id": 9,
                        "keyword_id": 19,
                        "keyword_name": "커플",
                        "count": 9,
                        "me": 0
                    },
                    {
                        "id": 8,
                        "keyword_id": 18,
                        "keyword_name": "사랑",
                        "count": 8,
                        "me": 0
                    },
                    {
                        "id": 6,
                        "keyword_id": 16,
                        "keyword_name": "속마음",
                        "count": 6,
                        "me": 0
                    },
                    {
                        "id": 5,
                        "keyword_id": 15,
                        "keyword_name": "마음",
                        "count": 5,
                        "me": 0
                    },
                    {
                        "id": 3,
                        "keyword_id": 13,
                        "keyword_name": "친구공유",
                        "count": 3,
                        "me": 0
                    },
                    {
                        "id": 2,
                        "keyword_id": 12,
                        "keyword_name": "우정",
                        "count": 1,
                        "me": 0
                    }
                ],
                "total_count": 109,
                "medias": [
                    {
                        "name": "image",
                        "value": 5
                    },
                    {
                        "name": "image",
                        "value": 78
                    },
                    {
                        "name": "video",
                        "value": 83
                    }
                ],
                "post_type": 0
            }
        ],
        "item_length": 1,
        "total": 1
    }
}
```



## search

관심사 게시물이 현재 사용중인 키워드 검색

GET /api/v1/interest/search HTTP  
HOST: rippler.chaeft.com    
token : token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|text|String| 포함 검색어 |o|

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
# 관심사 게시물이 현재 사용중인 키워드 검색
curl -X GET --url 'http://rippler.chaeft.com/api/v1/interest/search?text=친구' \
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
                "id": 14,
                "keyword_name": "친구구함"
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



## search result
 
키워드로 게시물 검색

GET /api/v1/interest/search_result HTTP  
HOST: rippler.chaeft.com    
token : token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|keyword_id|Int| 키워드 id |o|

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
# 관심사 게시물 단일 호출
curl -X GET --url 'http://rippler.chaeft.com/api/v1/interest/search_result?keyword_id=11' \
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
                "id": 7,
                "profile_id": 5,
                "user_id": 5,
                "nickname": "bbb",
                "thumbnail": 1,
                "title": "7번째 글입니다",
                "contents": "7번째 글입니다",
                "create_by": "2020-12-14 11:12:22",
                "update_by": "2020-12-16 18:26:42",
                "keywords": "[{\"id\": 28, \"keyword_id\": 19, \"name\": \"커플\", \"cnt\": 64, me: 1},...]",
                "media": "[{\"id\": 7, \"type\": \"image\"}]",
                "total_count": 95,
                "comment_count" : 4,
                "post_type": 1
            },
            {
                "id": 4,
                "profile_id": 5,
                "user_id": 5,
                "nickname": "bbb",
                "thumbnail": 1,
                "title": "4번째 글입니다",
                "contents": "4번째 글입니다",
                "create_by": "2020-12-14 10:58:41",
                "update_by": "2020-12-16 18:26:42",
                "keywords": "[{\"id\": 19, \"keyword_id\": 13, \"name\": \"친구공유\", \"cnt\": 300, me: 0},...]",
                "media": "[{\"id\": 4, \"type\": \"image\"}]",
                "total_count": 600,
                "comment_count" : 4,
                "post_type": 1
            }
        ],
        "me": 1, // 검색한 키워드 현재 추가되어 있는지 여부 (1: 추가되어있음, 0: 없음)
        "item_length": 2,
        "total": 2
    }
}
```



## insert feed

관심사 게시물 작성

POST /api/v1/interest/insert_feed
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|profile_id|Int| 프로필 id |o|
|title|String| 제목 |o|
|contents|String| 내용 |o|
|media|Array| 첨부파일 배열 |x|
|keyword_list|Array| 키워드 text 배열 |o|
|post_type|Int| 게시물 타입 (0:text short, 1:text long, 2:image, 3:video) |o|

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
    "media" : [
        {"id": 1, "type": "video"} // video or image
    ],
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



## update feed

관심사 게시물 수정

POST /api/v1/interest/update_feed
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|id|Int| 게시물 id |o|
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
# 관심사 게시물 수정
curl -X POST --url 'http://rippler.chaeft.com/api/v1/interest/update_feed' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "id" : 7,
    "title" : "abcd",
    "contents": "efgh"
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

관심사 게시물 삭제

POST /api/v1/interest/delete_feed
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

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
# 관심사 게시물 삭제
curl -X POST --url 'http://rippler.chaeft.com/api/v1/interest/delete_feed' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "id" : 7
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



## best comments
 
해당 글의 인기 코멘트

GET /api/v1/interest/best_comments HTTP  
HOST: rippler.chaeft.com    
token : token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|post_id|Int| 게시글 id |o|

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
# 인기 코멘트
curl -X GET --url 'http://rippler.chaeft.com/api/v1/interest/best_comments?post_id=:pid' \
-H 'token: token' \
```

parent_comment가 null이 아닐 시 해당 댓글은 대댓글로써 부모(parent_comment)를 상단에 보여 주어야 함

response  
```bash
{
    "success": true,
    "message": "success",
    "code": 1000,
    "data": {
        "item": [
            {
                "id": 9,
                "parent": 5,
                "post_id": 1,
                "profile_id": 9,
                "user_id": 1,
                "me": 0,
                "contents": "5-1",
                "count": 99,
                "create_by": "2020-12-14 15:42:14",
                "update_by": null,
                "parent_comment": "[{\"thumbnail\": 1, \"contents\": \"2번 댓글\"}]"
            },
            {
                "id": 5,
                "parent": 0,
                "post_id": 1,
                "profile_id": 9,
                "user_id": 1,
                "me": 0,
                "contents": "2번 댓글",
                "count": 38,
                "create_by": "2020-12-14 15:30:08",
                "update_by": null,
                "parent_comment": null
            },
            {
                "id": 2,
                "parent": 1,
                "post_id": 1,
                "profile_id": 8,
                "user_id": 1,
                "me": 0,
                "contents": "1-1",
                "count": 22,
                "create_by": "2020-12-14 15:28:52",
                "update_by": "2020-12-16 10:22:14",
                "parent_comment": "[{\"thumbnail\": 1, \"contents\": \"1번 댓글\"}]"
            },
            {
                "id": 6,
                "parent": 0,
                "post_id": 1,
                "profile_id": 10,
                "user_id": 1,
                "me": 0,
                "contents": "3번 댓글",
                "count": 22,
                "create_by": "2020-12-14 15:30:28",
                "update_by": null,
                "parent_comment": null
            },
            {
                "id": 1,
                "parent": 0,
                "post_id": 1,
                "profile_id": 8,
                "user_id": 1,
                "me": 0,
                "contents": "1번 댓글",
                "count": 17,
                "create_by": "2020-12-14 15:26:59",
                "update_by": null,
                "parent_comment": null
            }
        ],
        "item_length": 5,
        "total": 5
    }
}
```



## comments
 
해당 글의 댓글 목록

GET /api/v1/interest/comments HTTP  
HOST: rippler.chaeft.com    
token : token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|post_id|Int| 게시글 id |o|

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
# 댓글 목록 호출
curl -X GET --url 'http://rippler.chaeft.com/api/v1/interest/comments?post_id=:pid' \
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
                "post_id": 1,
                "profile_id": 11,
                "user_id": 1,
                "parent": 0,
                "contents": "7번 댓글",
                "COUNT": 1,
                "create_by": "2020-12-16 09:25:44",
                "update_by": null,
                "nickname": null,
                "thumbnail": null,
                "total_count": 6,
                "me": 0
            },
            {
                "id": 10,
                "post_id": 1,
                "profile_id": 10,
                "user_id": 1,
                "parent": 0,
                "contents": "6번 댓글",
                "COUNT": 12,
                "create_by": "2020-12-14 17:44:30",
                "update_by": "2020-12-14 17:49:20",
                "nickname": "FFF",
                "thumbnail": 1,
                "total_count": 6,
                "me": 0
            },
            {
                "id": 7,
                "post_id": 1,
                "profile_id": 8,
                "user_id": 1,
                "parent": 0,
                "contents": "4번 댓글",
                "COUNT": 0,
                "create_by": "2020-12-14 15:30:39",
                "update_by": null,
                "nickname": "CCCC",
                "thumbnail": 1,
                "total_count": 6,
                "me": 0
            },
        ],
        "item_length": 3,
        "total": 3
    }
}
```



## child_comments
 
대댓글 목록 호출

GET /api/v1/interest/child_comments HTTP  
HOST: rippler.chaeft.com    
token : token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|comment_id|Int| 댓글 id |o|

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
# 대댓글 호출
curl -X GET --url 'http://rippler.chaeft.com/api/v1/interest/child_comments?post_id=:pid' \
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
                    "id": 9,
                    "post_id": 1,
                    "profile_id": 9,
                    "user_id": 5,
                    "nickname": "DDD",
                    "thumbnail": 1,
                    "parent": 5,
                    "contents": "5-1",
                    "COUNT": 99,
                    "create_by": "2020-12-14 15:42:14",
                    "update_by": null,
                    "me": 1
                }
        ],
        "item_length": 3,
        "total": 3
    }
}
```



## insert comment

관심사 댓글 작성

POST /api/v1/interest/insert_comment
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|post_id|Int| 게시물 id |o|
|profile_id|Int| 프로필 id |o|
|parent|Int| 댓글의 부모글 (0이면 댓글, 0이 아니면 대댓글) |o|
|contents|String| 댓글 내용 |o|

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
curl -X POST --url 'http://rippler.chaeft.com/api/v1/interest/insert_comment' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "post_id" : 7,
    "profile_id" : 7,
    "parent" : 0,
    "contents" : "가나다라마바사아자차카타파하",
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
            4
        ],
        "item_length": 1,
        "total": 1
    }
}
```



## update comment

관심사 댓글 수정

POST /api/v1/interest/update_comment
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|id|Int| 댓글 id |o|
|post_id|Int| 게시물 id |o|
|profile_id|Int| 프로필 id |o|
|contents|String| 댓글 내용 |o|

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
curl -X POST --url 'http://rippler.chaeft.com/api/v1/interest/update_comment' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
        "id" : 9,
        "post_id": 1,
        "profile_id" : 9,
        "contents" : "가가가가가가가가"
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

관심사 댓글 삭제

POST /api/v1/interest/delete_comment
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|id|Int| 댓글 id |o|
|post_id|Int| 게시물 id |o|
|parent|Int| 댓글 레벨 |o|

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
curl -X POST --url 'http://rippler.chaeft.com/api/v1/interest/delete_comment' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
        "id" : 9,
        "post_id": 1,
        "parent" : 0
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



## like comment

댓글 좋아요

POST /api/v1/interest/like_comment
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|id|Int| 댓글 id |o|
|profile_id|Int| 프로필 id |o|

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
# 댓글 좋아요
curl -X POST --url 'http://rippler.chaeft.com/api/v1/interest/like_comment' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
        "id" : 9
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



## un like comment

댓글 좋아요 해제

POST /api/v1/interest/un_like_comment
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|id|Int| 댓글 id |o|

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
# 댓글 좋아요 해제
curl -X POST --url 'http://rippler.chaeft.com/api/v1/interest/un_like_comment' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "id" : 9
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



## feed keywords
 
게시물에 대한 투표 키워드 전체 호출

GET /api/v1/interest/feed_keywords HTTP  
HOST: rippler.chaeft.com    
token : token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|post_id|Int| 게시글 id |o|

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
# 게시물에 대한 투표 키워드 전체 호출
curl -X GET --url 'http://rippler.chaeft.com/api/v1/interest/feed_keywords?post_id=1' \
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
                "id": 47,
                "post_id": 13,
                "keyword_id": 31,
                "count": 2,
                "keyword_name": "평가",
                "me": 0
            },
            {
                "id": 48,
                "post_id": 13,
                "keyword_id": 39,
                "count": 1,
                "keyword_name": "헤비급",
                "me": 1
            },
            {
                "id": 55,
                "post_id": 13,
                "keyword_id": 42,
                "count": 1,
                "keyword_name": "강호동",
                "me": 1
            }
        ],
        "item_length": 3,
        "total": 3
    }
}
```



## keyword like

게시물에 등록된 키워드에 투표

POST /api/v1/interest/keyword_like
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|id|Int| 게시물에 등록된 키워드 id |o|
|post_id|Int| 게시물 id |o|
|profile_id|Int| 현재 선택된 프로필 id |o|

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
# 게시물 키워드 투표
curl -X POST --url 'http://rippler.chaeft.com/api/v1/interest/keyword_like' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "id": 55,
    "post_id": 13,
    "profile_id" : 22
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



## keyword un like

게시물에 등록된 키워드에 투표 해제

POST /api/v1/interest/keyword_like
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|id|Int| 게시물에 등록된 키워드 id |o|
|post_id|Int| 게시물 id |o|

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
# 게시물 키워드 투표 해제
curl -X POST --url 'http://rippler.chaeft.com/api/v1/interest/keyword_un_like' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "id": 55,
    "post_id": 13
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



## keyword add

게시물에 투표 키워드 등록

POST /api/v1/interest/keyword_add
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|keyword_list|Array| 키워드 문구 추가된 배열 |o|
|post_id|Int| 게시물 id |o|
|profile_id|Int| 현재 선택된 프로필 id |o|

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
# 게시물 투표 키워드 추가
curl -X POST --url 'http://rippler.chaeft.com/api/v1/interest/keyword_add' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "post_id": 13,
    "keyword_list": ["감감", "남남"],
    "profile_id" : 22
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