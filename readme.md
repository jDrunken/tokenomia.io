# tokenomia.io static site builder  
  
gulp.js 기반의 task running으로 tokenomia.io 사이트를 building 합니다.  
  
## 환경설정  
  
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
  
  
## 실행 URL  
  
주력 브라우저에서 <http://localhost:7080> 주소를 실행시킵니다.  

------------------------------------------------------------

## trouble shotting

`ReferenceError: internalBinding is not defined` 이란 에러가 발생할 경우 natives 모듈을 수동으로 업그레이드 해줍니다.

```
❯ npm install natives@1.1.6
```



