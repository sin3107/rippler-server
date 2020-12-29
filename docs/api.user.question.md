# Questions

문의사항


## join
문의 대화 진입

GET /api/v1/question/ HTTP  
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
# 문의 대화 진입 // 종료되지 않은 대화가 있을 시 그것이 호출
curl -X GET --url 'http://rippler.chaeft.com/api/v1/question?page=1' \
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
                "question_id" : 1,
                "id": 7,
                "user": 0,
                "value": "궁금하신 문의사항을 보내주세요.",
                "create_by": "2020-12-23 14:15:11"
            }
        ],
        "item_length": 1,
        "total": 1
    }
}
```



## read
대화 내용 호출

GET /api/v1/question/read HTTP  
HOST: rippler.chaeft.com    
token : token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|id|Int| 문의 id |o|
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
# 대화 내용 호출
curl -X GET --url 'http://rippler.chaeft.com/api/v1/question?id=1&page=1' \
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
                "question_id": 7,
                "id": 4,
                "user": 0,
                "create_by": "2020-12-23 14:15:11",
                "value": "궁금하신 문의사항을 보내주세요."
            },
            {
                "question_id": 7,
                "id": 5,
                "user": 0,
                "create_by": "2020-12-23 14:15:11",
                "value": "안녕하세요"
            }
        ],
        "item_length": 2,
        "total": 2
    }
}
```



## send

문의 메시지 보내기

POST /api/v1/question/send
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|id|Int| 문의 id |o|
|value|String| 문의 내용 |o|

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
# 문의 메시지 보내기
curl -X POST --url 'http://rippler.chaeft.com/api/v1/mail/question/send' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "id": 1,
    "value: "안녕하세요 문의 좀.."
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



## close

문의 대화 종료

POST /api/v1/question/close
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|id|Int| 문의 id |o|

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
# 문의 대화 종료
curl -X POST --url 'http://rippler.chaeft.com/api/v1/mail/question/close' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "id": 1
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