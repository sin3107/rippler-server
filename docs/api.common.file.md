# file

## image show

이미지 호출 API

GET /api/v1/file/image/:imageID HTTP  
token: token  

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|

### response

호출 성공시 이미지 binary 출력  

실패시 아래 사유 출력  

|name|type|desc|
|:---:|:---:|:---:|
|success|boolean|api 성공 여부|
|message|String|api 실패 사유|
|data|Object|api 반환 객체|
|data.success|boolean|성공 실패|
|data.message|String|사유|
|data.item|array|성공시 반환 배열, 실패시 빈 배열|
|data.item_length|int|data.item array 갯수, 실패시 0|


### sample

request  
```bash
# 이미지 호출
curl -vvv --url 'http://rippler.chaeft.com/api/v1/file/image/1'
```

response  
```bash
# 성공
이미지

# 실패
{
    "success": true,
    "message": "success",
    "data": {
        "success": true,
        "message": "not found",
        "item": [],
        "item_length": 0
    }
}
```

## image upload

image file 업로드 API  

POST /api/v1/file/upload/image HTTP  
Content-type: multipart/form-data  

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|

### response

|name|type|desc|
|:---:|:---:|:---:|
|success|boolean|api 성공 여부|
|message|String|api 실패 사유|
|data|Object|api 반환 객체|
|data.success|boolean|성공 실패|
|data.message|String|사유|
|data.item|array|성공시 반환 배열, 실패시 빈 배열|
|data.item_length|int|data.item array 갯수, 실패시 0|


### sample

request  
```bash
# 단일 파일 업로드
curl -vvv --url 'http://rippler.chaeft.com/api/v1/file/upload/image' \
-H 'token: token' \
-F 'file=@name2.png'

# 복수 파일 업로드 키 이름 다르게
curl -vvv --url 'http://rippler.chaeft.com/api/v1/file/upload/image' \
-H 'token: ' \
-F 'file=@name2.png' -F 'file2=@name1.png'

# 복수 파일 업로드 키 array
curl -vvv --url 'http://rippler.chaeft.com/api/v1/file/upload/image' \
-H 'token: ' \
-F 'file[]=@name2.png' -F 'file[]=@name1.png'
```

response  
```bash
{
    "success": true,
    "message": "success",
    "data": {
        "success": true,
        "message": "success",
        "item": [7, 8],
        "item_length": 2
    }
}
```



## video upload

영상 파일 업로드 api

POST /api/v1/file/video/upload
Content-type: multipart/form-data  

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|


### response

|name|type|desc|
|:---:|:---:|:---:|
|success|boolean|api 성공 여부|
|message|String|api 실패 사유|
|data|Object|api 반환 객체|
|data.success|boolean|성공 실패|
|data.message|String|사유|
|data.item|array|성공시 반환 배열, 실패시 빈 배열|
|data.item_length|int|data.item array 갯수, 실패시 0|


### sample

request  
```bash
# 단일 파일 업로드
curl -vvv --url 'http://rippler.chaeft.com/api/v1/file/video/upload' \
-H 'token: token' \
-F 'file=10m.mp4'

```

response  
```bash
{
    "success": true,
    "message": "success",
    "data": {
        "success": true,
        "message": "success",
        "item": [15],
        "item_length": 1
    }
}
```



## video show

비디오 호출 API

GET /api/v1/file/video/:id HTTP  
token: token  

### request

|name|type|desc|required|
|:---:|:---:|:---:|:---:|

### response

|name|type|desc|
|:---:|:---:|:---:|
|success|boolean|api 성공 여부|
|message|String|api 실패 사유|
|data|Object|api 반환 객체|
|data.success|boolean|성공 실패|
|data.message|String|사유|
|data.item|array|성공시 반환 배열, 실패시 빈 배열|
|data.item_length|int|data.item array 갯수, 실패시 0|


### sample

request  
```bash
# 영상 호출
curl -vvv --url 'http://rippler.chaeft.com/api/v1/file/video/5'
```

response  
```bash
# 성공
http://rippler.chaeft.com/video/fsdjks423ksfsoj.mp4

# 실패
{
    "success": true,
    "message": "success",
    "data": {
        "success": true,
        "message": "not found",
        "item": [],
        "item_length": 0
    }
}
```