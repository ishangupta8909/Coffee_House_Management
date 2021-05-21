import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import EmployeeLogin from "./pages/EmployeeLogin/EmployeeLogin.jsx";
import CustomerLogin from "./pages/CustomerLogin/CustomerLogin.jsx";
import EmployeeHome from "./pages/EmployeeHome/EmployeeHome";
import CustomerHome from "./pages/CustomerHome/CustomerHome";

function App() {
  return (
    <Router>
      <Route exact path="/" component={Home} />
      <Route exact path="/employee/login" component={EmployeeLogin} />
      <Route exact path="/employee/home" component={EmployeeHome} />
      <Route exact path="/customer/login" component={CustomerLogin} />
      <Route exact path="/customer/home" component={CustomerHome} />
    </Router>
  );
}

export default App;
