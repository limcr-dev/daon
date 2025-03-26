*** 프로젝트 파일 설치 및 실행 ***
1. git clone 
    1) workspace_daon 폴더 생성 > git bash 열기
    2) git clone https://github.com/limcr-dev/daon.git 명령어 입력

2. STS4 실행
    1) 프로젝트 열기
        - File > Open Projects from File System > D:\DEV\workspace_daon\daon 선택
    2) application.properties 확인
        - application.properties source
            ----------------------------------------------------------------
            spring.application.name=daon

            # db connection(mariadb) - spring(context.xml)
            spring.datasource.driver-class-name=org.mariadb.jdbc.Driver
            spring.datasource.url=jdbc:mariadb://192.168.0.37:3306/daon
            spring.datasource.username=root
            spring.datasource.password=tiger

            # http port number(default 8080)
            server.port=8081

            # MyBatis - spring(dataSource-config.xml)
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


*** npm install 모음 ***
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

*** 설치 후 package.json 파일에서 dependcy 버전 확인 ***
    - "react": "^18.3.1",
    - "react-dom": "^18.3.1"
