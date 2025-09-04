import LoginForm from "./components/login-form";

export default function LoginPage() {
  return (
    <div className="w-full max-w-lg">
      <div className="mb-8 flex justify-center">
        <img
          src="/logo/logo-care-standard.svg"
          alt="Care Standard 360+"
          className="h-12 w-auto"
          draggable={false}
        />
      </div>
      <LoginForm />
    </div>
  );
}
