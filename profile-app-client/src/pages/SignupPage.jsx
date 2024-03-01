import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import authService from "../context/auth.services";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [campus, setCampus] = useState("");
  const [course, setCourse] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();
  const { storeToken, authenticateUser } = useContext(AuthContext);

  const handleUsername = (e) => setUsername(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleCampus = (e) => setCampus(e.target.value);
  const handleCourse = (e) => setCourse(e.target.value);

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const requestBody = { username, password, campus, course };

    authService.signup(requestBody)
      .then((response) => {
        storeToken(response.data.authToken);
        authenticateUser();
      })
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        const errorDescription = error.response?.data?.message || "An error occurred. Please try again.";
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div className="SignupPage">
      <h1>Sign Up</h1>

      <form onSubmit={handleSignupSubmit}>
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={handleUsername}
        />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={handlePassword}
        />

        <label>Campus</label>
        <select name="campus" value={campus} onChange={handleCampus}>
          <option value="">Select Campus</option>
          {["Madrid", "Barcelona", "Miami", "Paris", "Berlin", "Amsterdam", "México", "Sao Paulo", "Lisbon", "Remote"].map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <label>Course</label>
        <select name="course" value={course} onChange={handleCourse}>
          <option value="">Select Course</option>
          {["Web Dev", "UX/UI", "Data Analytics", "Cyber Security"].map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <button type="submit">Sign Up</button>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <p>Already have an account?</p>
      <Link to={"/login"}> Login</Link>
    </div>
  );
}

export default SignupPage;
