// import React from "react";
// import { PollTabs } from "./components/PollComponent";
// import { PollRow } from "./components/PollList";

// function App() {
//   // read pollId from URL
//   const urlParams = new URLSearchParams(window.location.search);
//   const pollId = urlParams.get("pollId");

//   return (
//     <div>
//       <h1 style={{ textAlign: "center" }}>Polls</h1>

//       {pollId ? (
       
//         <PollTabs  />
//       ) : (
      
//         <PollRow />
//       )}
//     </div>
//   );
// }

// export default App;





////////////updated
import React, { useEffect } from "react";
import { PollTabs } from "./components/PollComponent";
import { PollRow } from "./components/PollList";

function App() {
  // Get pollId from query string
  const urlParams = new URLSearchParams(window.location.search);
  const pollId = urlParams.get("pollId");

  // ✅ Fetch anonymous token on initial load
  useEffect(() => {
    const fetchAnonToken = async () => {
      const existingToken = localStorage.getItem("token");
      if (!existingToken) {
        try {
//           const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/anon`, {
//   method: "POST",
// });




const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const res = await fetch(`${API_URL}/auth/anon`, { method: 'POST' });
          const data = await res.json();
          localStorage.setItem("token", data.token);
          console.log("Anonymous token stored:", data.token);
        } catch (error) {
          console.error("Failed to fetch anonymous token:", error);
        }
      }
    };

    fetchAnonToken();
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Polls</h1>
      {pollId ? <PollTabs /> : <PollRow />}
    </div>
  );
}

export default App;
