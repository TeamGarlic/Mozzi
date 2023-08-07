import {useEffect} from "react";
import {createBrowserHistory} from "history";
export const usePreventGoBack = () => {
    const history = createBrowserHistory();

    const preventGoBack = () => {
        history.push(null, '', history.location.href);
        console.log("뒤로가기 막힘");
    };

    // 브라우저에 렌더링 시 한 번만 실행하는 코드
    useEffect(() => {
        (() => {
            history.push(null, '', history.location.href);
            window.addEventListener('popstate', preventGoBack);
        })();

        return () => {
            window.removeEventListener('popstate', preventGoBack);
        };
    }, []);

    useEffect(() => {
        history.push(null, '', history.location.href);
    }, [history, history.location]);
};
