# Mail Profile

우편함 프로필


## Info
 
프로필 정보 확인

GET /api/v1/mail_profile/info HTTP  
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
# 프로필 정보 호출
curl -X GET --url 'http://rippler.chaeft.com/api/v1/mail_profile/info' \
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
                "name": "555",
                "thumbnail": 5,
                "status_msg": "5"
            }
        ],
        "item_length": 1,
        "total": 1
    }
}
```




## edit

프로필 수정

GET /api/v1/mail_profile/edit
HOST: rippler.chaeft.com    
Content-Type: application/json;charset=utf-8    
token: token

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|
|name|String| 닉네임 |x / 3개중 1개 이상 필수|
|thumbnail|Int| 대표 이미지 |x|
|status_msg|String| 상태 메시지 |x|

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
# 프로필 정보 수정
curl -X POST --url 'http://rippler.chaeft.com/api/v1/mail_profile/edit' \
-H 'Content-Type: application/json;charset=utf-8' 'token: token' \
-d '{
    "name" : "abcd",
    "thumbnail" : 1,
    "status_msg" : "가나다라"
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