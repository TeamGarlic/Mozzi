import Layout from "@/components/Layout";
import LoginModal from "@/components/LoginModal";

function LogIn() {
  function login() {
    alert("login");
  }
  return (
    <Layout>
      <LoginModal logIn={login} />
    </Layout>
  );
}

export default LogIn;
