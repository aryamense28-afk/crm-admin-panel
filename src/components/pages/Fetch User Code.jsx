import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function useLoggedInUser() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user info from localStorage
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");
    const image = localStorage.getItem("profileImage");

    if (username && email && role && image) {
      setUser({ name: username, email, role, image });
    } else {
      // Redirect to login if user info is missing
      navigate("/");
    }
  }, [navigate]);

  return user;
}

export default useLoggedInUser;