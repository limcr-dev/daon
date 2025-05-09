# daon

# 프로젝트 파일 설치 및 실행
1. git clone 
    1) workspace_daon 폴더 생성 > git bash 열기
    2) git clone https://github.com/limcr-dev/daon.git 명령어 입력

2. STS4 실행
    1) 프로젝트 열기
        - File > Open Projects from File System > D:\DEV\workspace_daon\daon 선택
    2) application.properties 확인
        ----------------------------------------------------------------
        spring.application.name=daon

       
        spring.datasource.driver-class-name=org.mariadb.jdbc.Driver
        spring.datasource.url=jdbc:mariadb://192.168.0.37:3306/daon
        spring.datasource.username=root
        spring.datasource.password=tiger

       
        server.port=8081

       
        mybatis.mapper-locations=mappers/**/*.xml
        logging.level.com.atoz_develop.mybatissample.repository=TRACE
        mybatis.configuration.map-underscore-to-camel-case=false
      
        ----------------------------------------------------------------

    3) 프로젝트 실행
        - 우클릭 > Run As > Spring Boot App 클릭
        - Driver 오류 시, DBeaver에서 MariaDB 계정 생성 및 연결 필요

3. Visual Studio Code 실행
    1) 프로젝트 열기
        - File > Open Folder > D:\DEV\workspace_daon\daon 선택
    2) 터미널 창 실행
        - 상단바... > Terminal > New Terminal 선택
        - cmd창(Command Prompt)으로 변경
    
    ---------- cmd 창에서 진행 -----------
   
    3) 폴더 이동(cmd)
        - cd front-react 입력
    4) 모듈 설치
        - D:\DEV\workspace_daon\daon\front-react 경로 확인
        - front-react에서 설치해야 오류 없음
        - npm install 입력
    5) package-lock.json 취약점 해결
        - npm audit fix 입력
    6) 프로젝트 실행
        - npm start 입력


# npm install 모음
    1) 풀캘린더
        npm install --save @fullcalendar/react
        npm install @fullcalendar/core
        npm install @fullcalendar/daygrid
        npm install style-loader css-loader sass-loader sass --save
        npm install @fullcalendar/timegrid
        npm install @fullcalendar/interaction
        npm install bootstrap @fullcalendar/bootstrap5
        npm install @fullcalendar/list

    2) 스케줄
        npm install @syncfusion/ej2-react-schedule --save
        npm install @syncfusion/ej2-react-calendars --save

    3) 데이트피커
        npm install react-datepicker --save

    4) crawling
        npm install http-proxy-middleware
        npm install react-spinners
        
    5) react
        npm install react-icons --save
        npm install react-router-dom

    6) react suite
        npm install rsuite --save

    7) colorPicker
        npm install @adobe/react-spectrum
        npm install @react-spectrum/color @react-stately/color @react-aria/color   

    8) jwt
        npm install jwt-decode

    9) web socket
        npm install sockjs-client @stomp/stompjs

    10) 알림
        npm install react-toastify

    11) pdf
        npm install jspdf는 리액트 프로젝트에서 jsPDF 사용용

    12) 엑셀
        npm install xlsx file-saver
    
    13) 그래프
        npm install recharts
        
#설치 후 package.json 파일에서 dependcy 버전 확인
    - "react": "^18.3.1",
    - "react-dom": "^18.3.1"

*** react 규칙 ***
 - 기능별로 폴더 생성 후 내부에 pages, components, css 필요한 폴더 만들어 사용 
 - 카멜표기법 사용
 - 폴더명은 소문자로 시작
 - js 파일명 대문자로 시작
 - css 파일명 소문자로 시작

*** Boot 규칙 ***
 - 베이스 패키지 안에 각 기능별 패키지 만들어 사용
 - DTO는 테이블명이랑 일치하게 생성(테이블 : employees -> DTO : Employees)
 - class, interface 명 대문자로 시작
 - 패키지명, xml명 소문자로 시작
* Employees 테이블은 hrMgt에서 관리
