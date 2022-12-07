# [강의 출처 : 따라 배우는 도커](https://www.youtube.com/playlist?list=PLApuRlvrZKogb78kKq1wRvrjg1VMwYrvi)

# Docker

## 무엇을 컨테이너로 만드나요?

- 개발한 애플리케이션(실행파일)과 운영환경이 모두 들어있는 독립된 공간

> Polygot Programing 에 적합함.

Polygot Programing : 여러 언어를 이용해서 프로그래밍 하는 것.

- 이 기능은 자바로, 저 기능은 노드로, 이런 기능은 파이썬으로.
  - 목적에 따라 효율적인 언어를 사용해 개발해낼 수 있음.
- 컨테이너화 시켜서.
- 각 어플리케이션 서비스에 맞춰 컨테이너를 만들 수 있음.

---

## 컨테이너를 어떻게 만들까요?

- Dockerfile 이라는 파일을 만든 후 쉽고 명확한 구문을 가진 text file로 Top - Down 해석

```
FROM node:12
COPY hello.js
CMD ['node', '/hello.js']
```

$ docker build -t imagename:tag .

- 가장 끝의 .은 imagename파일이 현재 폴더에 있다고 말해주는 것임.

위의 파일은 node 12버전으로 hello.js를 복사 한 뒤 CMD로 명령어를 실행 시키는 것.

<img width="1109" alt="도커 명령어 사진" src="https://user-images.githubusercontent.com/71562311/206129367-0db93bcb-9102-4706-afa8-15ad3d5929fa.png">


- FROM은 Dockerfile에 가장 위에 있어야 함.
  - 운영 환경, node:12라는 베이스 이미지를 이용하는 것.
- COPY와 ADD 호스트에 있는 파일을 컨테이너에 넣어주는 것.
- USER은 보안을 위해 설정
- EXPOSE는 포트포워딩(포트번호를 연결시켜 주는 것)을 위해 사용.

---

## 컨테이너를 어떻게 배포할까요?

```
docker built -t hellojs:latest .
docker login
docker push hellojs:latest
```

docker login을 위해서 docker hub에 가입을 해야할 것임.

Explore에 보면 공식적인 컨테이너와 다른 사람이 올린 컨테이너를 볼 수 있으니 참고하자!

위와 같은 과정을 거치면 Docker hub에 컨테이너를 배포할 수 있음.

- 다른 사람이 사용할 수 있도록.

---

## 컨테이너 만들기/ 배포하기

```
FROM node:12
COPY hello.js /
COPY package.json /
RUN npm install
CMD [ "node", "hello.js" ]
```

package.json을 넣어주고 express를 다운받기 위해 npm install을 추가.

docker images를 입력하면 현재 이미지들을 확인할 수 있음.

`docker run -d -p 8080:8080 --name web hellojs `

- run을 이용해 현재 이미지로 컨테이너를 생성
- -d는 백그라운드 환경에서 실행하겠다는 의미
- -p는 포트포워딩을 위한 문구.

  - 포트포워딩: 밖에서 들어오는 요청을 도커 안의 포트와 연결해주는 작업.
    - 클라이언트가 localhost8080으로 요청을 보냈다면 이는 도커안으로 들어오지 못하기 때문에 도커 안, 컨테이너에 8080포트를 연결해주어야 함.

- --name을 이용해 컨테이너의 이름 지정

`docker tag hellojs:latest gwonyeong/hellojs:latest`
hellojs를 gwonyeong(docker hub의 유저 네임)으로 태그 걸어줌.

- docker hub에 push하기 위해서는 유저 이름을 앞에 붙여주어야 함.

`docker push gwonyeong/hellojs`

- 이를 도커 허브에 올릴 수 있음!

[위의 파일을 올린 REPO](https://hub.docker.com/repository/docker/gwonyeong/hellojs)

$docker pull imagename:tag

$docker run imagename:tag

---

# 실질적으로 도커 컨테이너 사용하기

<img width="1087" alt="컨테이너 사용" src="https://user-images.githubusercontent.com/71562311/206129422-943371e2-6f97-4184-ace1-da9b1f05e2f2.png">


- 컨테이너 실행 라이프 사이클
  - Docker HOST에서 컨테이너 앱으로 실행시켜 주어야 함.

$ docker create --name webserver nginx:1.14

- 컨테이너 생성까지

$ docker start webserver

- 컨테이너를 실행하기

$ docker ps

- 현재 생성된, 중단된, 실행중인 컨테이너의 상태를 확인

$docker inspect webserver

- 동작중인 컨테이너, 이미지의 상세정보를 확인

<img width="1052" alt="컨테이너 실행 종료 명령어" src="https://user-images.githubusercontent.com/71562311/206129529-29337daf-a0d9-4d9a-9459-b8f36b6154a5.png">

- pull -> create -> start를 묶어둔 것이 run명령어
  - run을 실행하면 이미지가 현재 있는지 검색해보고 없으면 도커 허브에서 다운받음.
  - 이후 컨테이너 생성, 컨테이너 스타트

---

## 동작중인 컨테이너 명령어

- 실행중인 컨테이너 관리

- docker ps
- docker top webserver
  - 도커에서 동작중인 프로세스
- docker logs webserver
  - 현재 실행중인 컨테이너의 로그정보
- docker exec webserver /bin/bash
  - 현재 실행중인 컨테이너에서 실행
- docker stop webserver
- docker rm webserver

---

# 컨테이너 볼륨?

- 컨테이너 이미지는 readonly
- 컨테이너에 추가되는 데이터들은 별도의 RW 레이어에 저장
- 예를들어 mysql이라면 데이터 저장은 readwrite로 저장되는 것.
  - mysql컨테이너를 삭제하면..? readwrite도 삭제되기 때문에 복원할 수 없음.

## 데이터를 영구적으로 보존하기 위해서는??

- 컨테이너가 만들어주는 데이터를 영구적 보존
  -mysql readwrite(/var/lib/mysql)를 실제 HOST의 저장소에 저장하면 된다!
  - docker run -d --name db -v /dbdata:/var/lib/mtsql -e MYSQL_ALLOW_EMPTY_PASSWORD=pass mysql:latest
  - -v : 볼륨 마운트를 이용.
    - :을 기준으로 호스트 : 컨테이너 로 나뉘게 됨.

## 컨테이너끼리 데이터 공유

- docker run -v /webdata:/webdata -d --name df smlinux/df:latest
- docker run -d -v /webdata:/usr/share/nginx/html:ro -d ubuntu:latest

- 좀더 추가해야함 @@@@@@@@@@@@@@ (맥 os에서는 리눅스처럼 os에 바로 도커가 설치되는게 아닌 VM을 이용하기 때문에 dbdata를 확인할 수 없었음.)

---

# 도커 컴포즈?

- 여러 컨테이너를 일괄적으로 정의하고 실행할 수 있는 툴 - 하나의 서비스를 운영하기 위해서는 여러 개의 애플리케이션이 동작해야함 - 컨테이너화 된 애플리케이션들을 통합 관리 - yaml파일을 이용해 파일 관리!
  > 도커 파일을 여러개 만들어서 이 파일들을 도커 컴포즈로 연결시켜 주는 것!

## 도커 컴포즈로 컨테이너 실행?

- docker docs에서 문법 확인 가능

<img width="1308" alt="도커 컴포즈 문법" src="https://user-images.githubusercontent.com/71562311/206129572-0f8c10d7-a4f2-4616-9962-59fd78750389.png">


- link : A container , B container를 연결시켜야하는 경우?
  - 서로 환경변수를 알고있어야 한다던가 호스트 네임을 알고있어야 한다던가

<img width="1181" alt="도커 컴포즈 문법2" src="https://user-images.githubusercontent.com/71562311/206129587-61be1123-68cf-4a1a-aa51-f9897648d2ee.png">


- environment : 환경변수 지정

1. docker-compose.yml을 생성
2. docker-compose up : 도커 컴포즈 실행

$ docker-compose ps 현재 디렉토리에 있는 도커파일 확인

(도커 컴포즈 명령어)

- docker-compose config : docker-compose의 문법 확인
