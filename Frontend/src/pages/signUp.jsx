import Layout from "@/components/Layout";
import SignupModal from "@/components/SignupModal";

function SignUp() {
  function sign() {
    alert("signup");
  }

  return (
    <Layout>
      <SignupModal signUp={sign} />
    </Layout>
  );
}

export default SignUp;
