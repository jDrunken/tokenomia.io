# eosys.io static site builder

gulp.js 기반의 task running으로 eosys.io 사이트를 building 합니다.

## 개발/배포환경 설정

### 환경설정

``` bash
> npm install gulp -g
```

전역으로 gulp 설치가 완료되고 나면 사전 정의된 각종 플러그인을 설치합니다.

``` bash
> npm install --save
```

설치가 마무리되면 아래처럼 명령어를 실행합니다.  
명령어는 두가지 입니다.

``` bash
> gulp local
# local에서 사이트의 모습을 확인할 수 있습니다. 수정사항은 실시간으로 반영됩니다.

> gulp deploy
# gh-pages에 수정된 사항을 push합니다. github page 배포용입니다.  
```
  
