import { Routes, Route } from "react-router-dom";
import SignIn from "./pages/signIn/SignIn";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
    </Routes>
  );
}

export default App;