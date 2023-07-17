import Layout from "@/components/Layout";
import SignupModal from "@/components/SignupModal";
import useInput from "@/hooks/useInput.js";

function SignUp() {
  const id = useInput();
  const pw = useInput();
  const pw2 = useInput();
  function sign() {
    alert(`id : ${id.value}, pw : ${pw.value}, pw2 : ${pw2.value}`);
    id.reset();
    pw.reset();
  }

  return (
    <Layout>
      <SignupModal signUp={sign} id={id} pw={pw} pw2={pw2} />
    </Layout>
  );
}

export default SignUp;
