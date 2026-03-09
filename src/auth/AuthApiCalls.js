export const handleSignIn = async (values) => {

  const adminUser = {
    email: "admin@gmail.com",
    password: "admin123"
  };

  if (
    values.email === adminUser.email &&
    values.password === adminUser.password
  ) {
    // token save
    localStorage.setItem("auth_token", "dummy_token_123");

    return true;
  } else {
    alert("Invalid email or password");
    return false;
  }
};