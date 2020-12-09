# Blind

블라인드풀

## list

블라인드 풀 유저 목록

GET /api/v1/blind/list HTTP  
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
# 회원 정보 호출
curl -X GET --url 'http://rippler.chaeft.com/api/v1/blind/list' \
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
                "friend_id": 1,
                "name": "111"
            }
        ],
        "item_length": 1,
        "total": 1
    }
}
```


## restore

친구 블라인드 해제

POST /api/v1/blind/restore HTTP  
HOST: rippler.chaeft.com  
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|friend_list|Array| 블라인드 해제 할 friend_id list |o|


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
# 친구 블라인드 해제
curl -X POST --url 'http://rippler.chaeft.com/api/v1/blind/restore' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "friend_list" : [
        1,2,3
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