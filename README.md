# 📜 서비스 내용

도서를 등록, 검색, 대출, 예약 할 수 있는 API 서비스입니다.

NestJS 공부 목적을 위해 프로젝트를 진행하였습니다.

제공하는 핵심 기능은 아래와 같습니다.

1. 도서 검색, 신규 도서 등록
2. 도서 대출 및 반납
3. 대출된 도서 예약, 반납 시 알림

<table align="center">
  <tr>
    <th>
      공통
    </th>
    <th>
      관리자
    </th>
  </tr>
  <tr>
   <td align="left" width="350px" class="사용자">
     - 회원가입, 인증, 로그인 
     <br/>
     - 도서 검색, 조회
     <br/>
     - 도서 대출, 반납, 예약, 예약 취소
   </td>
   <td align="left" width="350px" class="관리자">
     - 회원 권한 관리
     <br/>
     - 도서 정보 추가, 수정, 삭제
     <br/>
     - 예약, 알림 기록 삭제
   </td>
  </tr>
</table>

서비스에 대한 API를 정리한 문서입니다.

https://booklend.kro.kr/api-docs

도서 DB에 대한 데이터는 도서관 정보나루(https://www.data4library.kr/openDataL) 에서

인천광역시 교육청 부평도서관 장서/대출 데이터를 사용하였습니다.

Postman 같은 API 플랫폼을 통해서 API를 사용하는 것이 아닌 사용자가 직접 이용해볼 수 있는 간단한 웹사이트를 만들고자 합니다.


# 💾 DB 구조

![Booklend](https://github.com/user-attachments/assets/cd212fae-b2ef-4a98-a444-9421445d6488)


# 🖥️ 시스템 구조

![image](https://github.com/user-attachments/assets/faed1c58-91d1-4739-9d5e-9fabfc46b387)


클라이언트 요청: 사용자 클라이언트가 웹 서버에 HTTP/HTTPS 요청을 보냅니다.

웹 서버 처리: 웹 서버가 클라이언트의 요청을 받아서 백엔드 애플리케이션 서버에 전달하고, 그 응답을 클라이언트에 요청을 반환합니다.

애플리케이션 서버 처리: 애플리케이션 서버가 클라이언트 요청을 처리합니다.

데이터베이스 접근: 애플리케이션 서버가 데이터베이스 서버에 접근하여 필요한 데이터를 조회하거나 저장합니다.

캐시 사용: 애플리케이션 서버가 자주 사용하는 데이터(도서 정보, 주간 인기 도서)는 캐시 서버에 저장하여 빠르게 접근합니다.

CI / CD: Push될 때마다 빌드가 실행됩니다. 성공적으로 빌드가 마무리되면 AWS 환경에 배포됩니다.

# 🔨 사용 기술

- NestJS, PostgreSQL, KafkaJS, Redis, Docker, Nginx, Aws EC2
