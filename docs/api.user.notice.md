# Notice

공지 사항

## list

공지 목록 호출

GET /api/v1/notice/list HTTP  
HOST: rippler.chaeft.com
token : token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|page|Int| 현재 페이지 |o|
|limit|Int| 한 페이지에 표시될 수 |x|

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
# 공지사항 목록 호출
curl -X GET --url 'http://rippler.chaeft.com/api/v1/notice/list?page=1' \
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
                "id": 2,
                "subject": "제목",
                "contents": "내용",
                "create_by": "2020-12-16 14:30:51",
                "update_by": null
            },
            {
                "id": 1,
                "subject": "제목1",
                "contents": "내용1",
                "create_by": "2020-12-16 14:29:54",
                "update_by": "2020-12-16 14:30:54"
            }
        ],
        "item_length": 2,
        "total": 2
    }
}
```


## item

공지 게시물 단건 호출

GET /api/v1/notice/item HTTP  
HOST: rippler.chaeft.com
token : token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|id|Int| 공지 게시물 id |o|

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
# 알림 게시물 단건 호출
curl -X GET --url 'http://rippler.chaeft.com/api/v1/notice/item' \
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
                "subject": "제목",
                "contents": "내용",
                "create_by": "2020-12-16 14:30:51",
                "update_by": null
            }
        ],
        "item_length": 1,
        "total": 1
    }
}
```