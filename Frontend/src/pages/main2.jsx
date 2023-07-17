import { useLocation, useParams } from "react-router-dom";
import PropTypes from "prop-types";

// Main(props) 로 접근 가능하지만 구조분해할당 사용하여 {user, address} 형태로 분해
function Main2({ user, address, userData }) {
  // 라우팅 경로가 '/:id' 이고 url이 'http://localhost:3000/112?data=12' 일 경우

  // useParam() -> react-router-dom 라이브러리 내의 url param 사용 훅
  // 넘겨준 params를 구조분해할당으로 분해하여 id param만 사용 선언
  const { id } = useParams();
  // 112 출력
  console.log(id);

  // url이 가진 pathname 자체를 사용하고 싶을때는 useLocation 사용
  const location = useLocation();
  // url 객체 정보 출력
  console.log(location);

  // 쿼리스트링 추출 방법
  const queryStringData = new URLSearchParams(location.search);
  // data 출력
  console.log(queryStringData.get("data"));

  return (
    <>
      <div>
        Main2, {user} / {address}
      </div>
      <div>
        {userData.age} / {userData.blood}
      </div>
      {id}
    </>
  );
}

export default Main2;

// isRequired가 아닌 props의 경우 default value 설정 필요
Main2.defaultProps = {
  user: "",
  userData: {
    age: 20,
    blood: "O",
  },
};

// 내려오는 props들의 자료형 선언 필요(ESLint)
Main2.propTypes = {
  user: PropTypes.string,
  address: PropTypes.string.isRequired,
  // 객체형 데이터 타입체크
  userData: PropTypes.shape({
    age: PropTypes.number,
    blood: PropTypes.string,
  }),
};
