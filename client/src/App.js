import { Navigate, Route, Routes } from "react-router-dom";
import Pages from "./components/Pages";
import UserForm from "./UserForm";

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Navigate to="/records" />}></Route>
      <Route path="/login" element={<UserForm type="login" />}></Route>
      <Route path="/register" element={<UserForm type="register" />}></Route>
      <Route path="/records" element={<Pages />}></Route>
    </Routes>
  );
}

export default App;
