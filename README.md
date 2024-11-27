## 📜 서비스 내용

도서를 등록, 검색, 대출, 예약 할 수 있는 API 서비스입니다.

NestJS 공부 목적을 위해 프로젝트를 진행하였습니다.

제공하는 핵심 기능은 아래와 같습니다.

1. 도서 검색, 신규 도서 등록
2. 도서 대출 및 반납
3. 대출된 도서 예약, 반납 시 알림


서비스에 대한 api를 정리한 문서입니다. 

https://booklend.p-e.kr/api-docs


도서DB에 대한 데이터는 도서관 정보나루(https://www.data4library.kr/openDataL) 에서

인천광역시 교육청 부평도서관  장서/대출 데이터를 사용하였습니다.

현재는 기능만 완성하였고 추후에는 CI/CD를 구성하거나

Postman 같은 API 플랫폼을 통해서 API를 사용하는 것이 아닌 사용자가 직접 이용해볼 수 있는 간단한 웹사이트를 만들고자 합니다.

## 🔨 사용 기술

- NestJS, PostgreSQL, KafkaJS, Redis, Docker
