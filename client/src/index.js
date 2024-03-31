// import React from "react";
// import { createRoot } from "react-dom";
// import App from "./App";
//
// createRoot(document.getElementById("root")).render(<App />);

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const App = () => {
  useEffect(() => {
    fetch("/users/hello")
      .then((response) => response.json())
      .then((data) => console.log("data"));
  }, []);

  const [message, setMessage] = useState("");
  return <div className="container">{message}</div>;
};

ReactDOM.render(<App />, document.getElementById("root"));
