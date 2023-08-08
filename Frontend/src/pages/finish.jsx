import { Link, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import PropTypes from "prop-types";

function Finish({mozzi}) {
  const location = useLocation();
  return (
    <Layout>
      <div className="w-full h-screen p-4 flex-col">
        <div className="text-3xl">사진 공유</div>
        <div className="flex h-[calc(100%-5rem)]">
          <div className="w-1/2 flex my-auto max-h-[calc(100%-5rem)]  overflow-scroll scrollbar-hide">
            <div className="w-full justify-center text-center">
              <video autoPlay src={mozzi && `https://api.mozzi.lol/files/mozziroll/${mozzi}`}></video>
            </div>
          </div>
          <div className=" w-1/2 flex-col justify-center items-center text-center m-auto">
            <div>
              {new Date().toLocaleDateString()}의 추억
              <br />
              with
              <br />
              user1
              <br />
              user2
              <br />
              user3
              <br />
              user4
            </div>
            <ul className="flex gap-5 text-center justify-center mt-20">
              <li><a href={`https://api.mozzi.lol/files/mozziroll/${mozzi}`} target="_blanck">다운받기</a></li>
              <li>카톡공유</li>
              <li>인스타공유</li>
              <li>
                <Link to="/">홈으로</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Finish;

Finish.propTypes = {
  mozzi: PropTypes.string,
}
