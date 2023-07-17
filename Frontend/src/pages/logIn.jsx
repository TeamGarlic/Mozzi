import Layout from "@/components/Layout";
import LoginModal from "@/components/LoginModal";
import useInput from "@/hooks/useInput.js";

function LogIn() {
  const id = useInput();
  const pw = useInput();

  function login() {
    alert(`id : ${id.value}, pw : ${pw.value}`);
    id.reset();
    pw.reset();
  }
  return (
    <Layout>
      <LoginModal logIn={login} id={id} pw={pw}/>
    </Layout>
  );
}

export default LogIn;
