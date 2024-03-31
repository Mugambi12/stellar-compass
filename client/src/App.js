import React, { useEffect, useState } from "react";

const App = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/medicines/medications")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setMessage(data))
      .catch((error) => {
        console.error("Error fetching data:", error);
        setMessage("Error fetching data. Please try again later.");
      });
  }, []);

  return <div className="container">{message}</div>;
};

export default App;
