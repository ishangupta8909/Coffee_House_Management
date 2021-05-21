import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import cookie from "react-cookies";

export default function CustomerLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const login = async () => {
    setErr("");
    const response = await fetch(
      `${process.env.REACT_APP_URL}/api/login/customer`,
      {
        method: "post",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      }
    );
    const customer_id = await response.json();
    if (customer_id) {
      console.log(customer_id);
      cookie.save("coffee-customer", customer_id, { path: "/" });
      window.location.href = "/customer/home";
    } else {
      setErr("Incorrect username or password");
    }
  };
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  return (
    <div>
      <Navbar />
      <div>
        <div className="background-image"></div>
        <div className="login-card">
          <p>Customer Login:</p>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {err}
          <button onClick={login}>Submit</button>
        </div>
      </div>
    </div>
  );
}
