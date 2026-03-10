import { Routes, Route } from "react-router-dom";
import SignIn from "./pages/signIn/SignIn";
import Dashboard from "./pages/dashboard/Dashboard";
import IndexSearch from "./pages/indexes/IndexSearch";
import AuditTrail from "./pages/indexes/AuditTrail";
import IndexLogs from "./pages/indexes/IndexLogs";
import IndexList from "./pages/indexes/IndexList";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/indexes/search" element={<IndexSearch />} />
      <Route path="/indexes/list" element={<IndexList />} />
      <Route path="/indexes/audit" element={<AuditTrail />} />
      <Route path="/indexes/logs" element={<IndexLogs />} />
    </Routes>
  );
}

export default App;
