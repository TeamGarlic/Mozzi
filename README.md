#### DB Dump, Default JWT Token 제외 등 소스 반출 사전 조치 완료
#### SSAFY 9기 공통 프로젝트 우수상

# 🎥 [Mozzi](https://mozzi.lol/)

## SSAFY 9기 공통 프로젝트 - A109 Team Garlic  
### 비대면 단체 클립영상 촬영 플랫폼, Mozzi  
> [https://mozzi.lol/](https://mozzi.lol/)  
  
  
# 👨‍👩‍👧‍👦 팀원 소개
- [곽민규](https://github.com/RookMG) : Frontend&Backend / Leader  
- [김민정](https://github.com/kimminjeong05) : Backend / Backend Leader  
- [박준홍](https://github.com/ssumthingood) : Frontend / Frontend Leader  
- [유창재](https://github.com/zzangjae) : Backend
- [윤태영](https://github.com/yyytae0) : Frontend  
- [정우정](https://github.com/ssafyWooJeong) : Backend / DevOps  
  
  
# 📆 프로젝트 소개
* 프로젝트명  
  비대면 단체 클립영상 촬영 플랫폼, Mozzi  
   
* 서비스 특징  
  WebRTC 기술을 활용해 각 참가자의 웹캠 영상에서 실시간으로 배경을 제거해 한 화면에 합성, 서로 다른 공간에 있어도 함께 있는 것처럼 영상 찍기  
   
* [UCC 영상, 시연 영상](https://pattern-ounce-358.notion.site/d63b8f36c8664fe3856c11dce39c44a4)  
  
# ✨기획 배경
### 1. 단체사진/영상 수요의 지속적인 성장
- 시간이 갈수록 단체사진에 대한 수요는 꾸준히 증가하고 있다.
### 2. 공간상의 제약
- 단체사진에 대한 수요는 증가하지만 그 특성상 공간상의 제약으로 인원의 제한이 생기거나 자리에 없는 사람의 촬영이 불가능하다.
### 3. Zoom과 같은 비대면 회의 서비스의 한계
- 분리된 UI로 인해 단체로 사진이나 영상을 남기고 싶어도 같은 장소에 있는 현장감이나 소속감에 한계가 존재한다.
  
  
# 🙌주요 기능
 ### 1. 촬영 준비 및 개인 설정
 함께 촬영할 사용자들을 위한 부스를 제공하고 촬영에 사용될 기능들을 제공한다
 - 로그인한 유저는 메인페이지의 부스생성을 통해 부스를 만들고 해당 부스의 공유코드를 이용해 다른 유저들을 초대할 수 있다
 - 촬영에 사용할 프레임을 확인하고 선택할 수 있다
 - 채팅을 이용하여 마이크를 사용하지 못하는 사용자와도 원할한 소통이 가능하다
 - 개인설정을 이용하여 카메라 기울임, 크기, 자동 설정을 할 수 있다
 ### 2. 촬영 및 영상 합성
 배경을 제공하고 영상 합성에 적합한 기능들을 제공한다
 - 배경 변경하기를 통해 방장이 가진 배경을 업로드하거나 제공된 배경을 이용하여 영상을 촬영할 수 있다.
 - 유저목록을 확인하고 드래그를 통해 사용자들의 앞 뒤 위치를 조정할 수 있다
 - 촬영 버튼을 이용하여 배경과 사용자들의 움직임을 영상으로 저장한다
 ### 3. 영상편집 및 저장
 제공한 프레임을 기반으로 영상 편집을 도와주고 완성된 영상과 개별 클립들에 대한 다운로드를 지원한다
 - 클릭이나 드래그로 프레임을 편집할 수 있다
 - 만들기를 눌러 완성된 클립을 mp4, gif 등 다양한 확장자로 다운로드할 수 있다
 - 클립을 만들기 위해 저장된 개별 클립들에 대한 저장 또한 mp4, gif 등 다양한 확장자로 다운로드 할 수 있다.
 ### 4. 공유 및 좋아요
 - 마음에 드는 클립을 커뮤니티에 등록할 수 있다
 - 커뮤니티를 통해 다른 사람들의 클립을 구경하고 좋아요를 할 수 있다
    
    
# 시연 설명
### 메인 페이지
<img width="1511" alt="image" src="https://github.com/RookMG/Mozzi/assets/56148069/756ec810-bd05-42e5-a3e2-d5193e2227c5">
- 로그인 된 사용자는 부스 생성하기를 클릭하여  새로운 부스를 생성할 수 있습니다.
- 공유코드를 알고있다면 부스 참가하기를 클릭하여 생성된 부스로 참가할 수 있습니다.

### 촬영 준비 페이지
![촬영준비](asset/a.gif)
- 부스 화면에서는 촬영에 사용할 원하는 프레임을 선택할 수 있습니다.
- 개인 설정 기능을 사용하여 카메라 회전, 크기 조절, 마이크/비디오 on&off가 가능합니다.
- 채팅 기능을 사용하여 마이크가 되지 않는 사용자와도 대화를 할 수 있습니다.

### 촬영 페이지
![촬영중](asset/b.gif)
- 실제 촬영이 진행 될 배경을 선택하거나 원하는 배경을 업로드하여 사용할 수 있습니다.  
- 카메라 소스의 위치, 크기를 마우스를 이용해 조절 할 수 있습니다.
- 유저 목록의 순서를 바꾸어 영상에 표시되는 사용자들의 위치를 변경할 수 있습니다.

### 편집 및 저장 페이지
![촬영마무리](asset/c.gif)
- 촬영한 클립들을 클릭이나 드래그하여 프레임을 편집할 수 있습니다.
- 완성한 클립과 촬영한 개별 클립들을 webm, mp4, gif의 형태로 저장할 수 있습니다.
- 로그인한 참가자의 경우 제목을 지정하여 마이페이지에 등록할 수 있습니다. 

### 커뮤니티
![커뮤니티](asset/d.gif)
- 촬영한 모찌롤들을 커뮤니티에 게시할 수 있다.
- 다양한 사람들이 찍은 모찌롤들을 보고 다른 아이디어를 얻을 수 있다.
- 좋아요/시간 순으로 모찌롤 게시물들을 볼 수 있다.
- 내 모찌롤은 나중에 다운로드 받을 수 있고, 커뮤니티에 공유 여부를 정할 수 있다.
  
  
# 💁 설계
### [🧱 서비스아키텍쳐](https://www.notion.so/4a0a6b88d9e441058dc0e8bcd2995434)  
<img width="1043" alt="image" src="https://github.com/RookMG/Mozzi/assets/56148069/b9f29210-4f56-4436-a415-5d7422f5b031">

### [📱 화면흐름도](https://www.notion.so/0528422cb76b41e686f20c8e7e8a4294)  
<img width="470" alt="image" src="https://github.com/RookMG/Mozzi/assets/56148069/d8449e25-d514-4179-89c8-f2cc74092581">
  
### [🎩 와이어프레임](https://www.figma.com/embed?embed_host=notion&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FGsUUmt9HyBKVr3m8NPzqdP%2FInsaengClip%3Ftype%3Ddesign%26mode%3Ddesign%26t%3D0E7AlPhWhJF6ljF7-0)  
![image](https://github.com/RookMG/Mozzi/assets/56148069/d1c94a01-0dbb-4439-a5a6-4c932c8afb08)

### [🎨 ERD](https://www.notion.so/ERD-8f884a4d995349e38206cfe4396cc81a)  
![image](https://github.com/RookMG/Mozzi/assets/56148069/7e182af2-5b6f-4bfe-824d-84c6cee0fb98)
  
### [📬 API 명세서](https://www.notion.so/adf01362ac67439c8486bdecc2f2862a?v=fe04bea7894e40c6a50a95fc4c274b65)  
명세서는 링크로 참고해주세요.  
  
### [📋 컨벤션](https://www.notion.so/4b2b4dca34a446db8ee0e19284e0050c?v=c82137a32d1449b68b52d52ae0653168)  
컨벤션은 링크로 참고해주세요.  
   

# 향후 계획
- 현재에는 Host에서 집중된 권한들을 다른 유저들에게도 분산시키거나 다른 유저들이 보고 있는 배경을 공유하는 등 사용자들간의 상호작용을 더욱 확장시킬 수 있다.
- 실제 서비스를 통해 다양한 컨텐츠들을 만들어볼 수 있다.
  

# ⚙ 개발 환경 및 IDE
### Frontend  
> ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Node.js](https://camo.githubusercontent.com/ab61fce6586c27e04d8ac35d0a77a20b78eb57de63ac2243353f23d3752b1fc3/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4e6f64652e6a732d3333393933333f7374796c653d666f722d7468652d6261646765266c6f676f3d4e6f64652e6a73266c6f676f436f6c6f723d7768697465)
![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![WebStorm](https://img.shields.io/badge/webstorm-143?style=for-the-badge&logo=webstorm&logoColor=white&color=black)
![FFmpeg](https://shields.io/badge/FFmpeg-%23171717.svg?logo=ffmpeg&style=for-the-badge&labelColor=171717&logoColor=5cb85c)
### Backend
> ![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://camo.githubusercontent.com/d04cac57f1f6d0a39ebd084333a6e4d93081a42c9e5aa1b3b511e75ad1a1e20f/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f537072696e675f426f6f742d3644423333463f7374796c653d666f722d7468652d6261646765266c6f676f3d537072696e67426f6f74266c6f676f436f6c6f723d7768697465)
![Gradle](https://camo.githubusercontent.com/ce0bfcaef68659861b497d6dfc5b8b783c2955705472b4e55151f196347d9271/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f477261646c652d4633373434303f7374796c653d666f722d7468652d6261646765266c6f676f3d477261646c65266c6f676f436f6c6f723d7768697465)
![Maria DB](https://img.shields.io/badge/mariadb-003545?style=for-the-badge&logo=mariadb&logoColor=#003545)
![H2](https://img.shields.io/badge/H2-003545?style=for-the-badge&logo=databricks&logoColor=#000000)
![Hibernate](https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge&logo=Hibernate&logoColor=white)
![Oracle Cloud Object Storage](https://img.shields.io/badge/oracle-%23F80000.svg?&style=for-the-badge&logo=oracle&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![IntelliJ](https://camo.githubusercontent.com/d479352761a86806b779129f4be8909d1c8c1fb1e2805bbd86cacd276f831cfa/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f496e74656c6c696a5f494445412d3337373641423f7374796c653d666f722d7468652d6261646765266c6f676f3d496e74656c6c696a49444541266c6f676f436f6c6f723d7768697465)
### Server
> ![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Ubuntu](https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white)
![CloudFlare CDN](https://img.shields.io/badge/cloudflare-%23F38020.svg?&style=for-the-badge&logo=cloudflare&logoColor=white)
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Jenkins](https://camo.githubusercontent.com/9cadc6063746e385b3916ea6ee991ec8eea88306de9208ccf5a94111c0ddf6ee/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4a656e6b696e732d4432343933393f7374796c653d666f722d7468652d6261646765266c6f676f3d4a656e6b696e73266c6f676f436f6c6f723d7768697465)
### WebRTC
> ![WebRTC](https://camo.githubusercontent.com/8976d26dbbac6cd5506c2ed7f158a3fc464b9deff553e61619d17b3c993c7e34/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f7765627274632d3333333333333f7374796c653d666f722d7468652d6261646765266c6f676f3d576562525443266c6f676f436f6c6f723d7768697465)
![Openvidu](https://img.shields.io/badge/openvidu-333333?style=for-the-badge&logo=webrtc&logoColor=#333333)
### Team Work
> ![Mattermost](https://camo.githubusercontent.com/04ce7d705b23f2f899a4acd58de46152ea9ab352ce310182432c59db1bd3e74e/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4d61747465724d4f53542d3030393638383f7374796c653d666f722d7468652d6261646765266c6f676f3d4d61747465726d6f7374266c6f676f436f6c6f723d7768697465)
![Jira](https://img.shields.io/badge/jira-%230A0FFF.svg?style=for-the-badge&logo=jira&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![GitLab](https://camo.githubusercontent.com/cb99570e6da369466c9991c5400a2516cec86a958fc80bc152dcdc020b5e581f/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6769746c61622d4643364432363f7374796c653d666f722d7468652d6261646765266c6f676f3d4769744c6162266c6f676f436f6c6f723d7768697465)
![Notion](https://camo.githubusercontent.com/e6016a8747f69a4f7c5cac44f04f81136a1294f2973f25a8d4c53651337a3d78/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4e6f74696f6e2d4546313937303f7374796c653d666f722d7468652d6261646765266c6f676f3d4e6f74696f6e266c6f676f436f6c6f723d7768697465)
![Figma](https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white)
  

## 카테고리

| Application | Danguage |  Language|
| ---- | ---- | ---- |
| :white_check_mark: Desktop Web | :white_check_mark: 웹 기술 | :white_check_mark: JavaScript | :black_square_button: Vue.js |
| :white_check_mark: Mobile Web | :black_square_button: 웹 디자인 | :black_square_button: TypeScript | :white_check_mark: React |
| :white_check_mark: Responsive Web | :black_square_button: 웹 IoT | :black_square_button: C/C++ | :black_square_button: Angular |
| :black_square_button: Android App | :black_square_button: IoT | :black_square_button: C# | :white_check_mark: Node.js |
| :black_square_button: iOS App | :black_square_button: 모바일 | :black_square_button: Python | :black_square_button: Flask/Django |
| :black_square_button: Desktop App | | :white_check_mark: Java | :white_check_mark: Spring/Springboot |
| | | :black_square_button: Kotlin | |