
import React, { useState } from 'react';
import './LoginForm.css'
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerError, setRegisterError] = useState("");
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState("");

  const handleSignUpClick = () => {
    setActive(true);
  };

  const handleSignInClick = () => {
    setActive(false);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleGoogleSignIn = async () => {
    try {
      const response = await fetch(`/api/users/check-registration/${email}`);
      const data = await response.json();
      
      if (!data.isRegistered) {
        // User needs to complete registration
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
      } else {
        // User is already registered, proceed with Google OAuth
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
      }
    } catch (error) {
      console.error('Error:', error);
      window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();

      if (data.exists) {
        // Proceed with login logic
        console.log("User exists. Proceed with login.");
      } else {
        setEmail(email);
        setPassword(password);
        setRegisterError("This email is not registered. Please create an account.");
        setActive(true);
      }
  
      if (response.ok) {
        if (data.isRegistered) {
          navigate("/dashboard", { state: { user: data.userData } });
        } 
      } else if (response.status === 401) {
        setError(data.message || "Invalid credentials"); // Set error message
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred during login");
    }
  };


  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    console.log("handleEmailSignUp is called");

    try {
        const response = await fetch("http://localhost:8080/api/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, name }),
            credentials: "include",
        });

        console.log("The response is:", response);

        if (response.ok) {
            const data = await response.json();
            navigate("/register", { state: { email, name } });
        } else {
            const errorData = await response.json();
            setError(errorData.message || "Registration failed");

            // Check if error is related to email already registered
            if (errorData.message.includes("Email already registered")) {
                setEmailError(errorData.message);
            }
        }
    } catch (error) {
        console.error("Error:", error);
        setError("An error occurred during registration");
    }
};

  return (
    <div className='my-[100px] LoginForm'>
          <div className={`container ${active ? 'active' : ''}`} id="container">
            <div className="form-container sign-in ">
              <form onSubmit={handleEmailSignIn}>
                <h1 style={{ marginBottom: '20px' }}>Sign in</h1>

                <button
                  type="button"
                  className="login-with-google-btn"
                  onClick={handleGoogleSignIn}
                  style={{
                    transition: 'background-color .3s, box-shadow .3s',
                    padding: '12px 16px 12px 42px',
                    border: 'none',
                    borderRadius: '3px',
                    boxShadow: '0 -1px 0 rgba(0, 0, 0, .04), 0 1px 1px rgba(0, 0, 0, .25)',
                    color: '#757575',
                    fontSize: '14px',
                    fontWeight: '500',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
                    backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=)',
                    backgroundColor: 'white',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: '12px 11px',
                    cursor: 'pointer',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.boxShadow = '0 -1px 0 rgba(0, 0, 0, .04), 0 2px 4px rgba(0, 0, 0, .25)')}
                  onMouseOut={(e) => (e.currentTarget.style.boxShadow = '0 -1px 0 rgba(0, 0, 0, .04), 0 1px 1px rgba(0, 0, 0, .25)')}
                  onMouseDown={(e) => (e.currentTarget.style.backgroundColor = '#eeeeee')}
                  onMouseUp={(e) => (e.currentTarget.style.backgroundColor = 'white')}
                  onFocus={(e) => (e.currentTarget.style.boxShadow = '0 -1px 0 rgba(0, 0, 0, .04), 0 2px 4px rgba(0, 0, 0, .25), 0 0 0 3px #c8dafc')}
                  onBlur={(e) => (e.currentTarget.style.boxShadow = '0 -1px 0 rgba(0, 0, 0, .04), 0 1px 1px rgba(0, 0, 0, .25)')}
                >
                  Sign in with Google
                </button>
                <div className="social-icons"></div>

                <input type="email" name="email" placeholder="Email" value={email}onChange={handleEmailChange}required />
                <input type="password" name="password" placeholder="Password" value={password} onChange={handlePasswordChange} required />
                
                {error && <p style={{ color: 'red', fontSize: '0.875rem', marginTop: '5px' }}>{error}</p>} {/* Display error message */}
                
                <button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Sign In
                </button>
              </form>
            </div>
            <div className="form-container sign-up sign-up-form">
              <form onSubmit={handleEmailSignUp} >
                <h1 >Create Account</h1>
                {registerError && (
                  <p className="text-red-500 text-sm">{registerError}</p>
                )}

                <button
                  type="button"
                  className="login-with-google-btn"
                  onClick={handleGoogleSignIn}
                  style={{
                    transition: 'background-color .3s, box-shadow .3s',
                    padding: '12px 16px 12px 42px',
                    border: 'none',
                    borderRadius: '3px',
                    boxShadow: '0 -1px 0 rgba(0, 0, 0, .04), 0 1px 1px rgba(0, 0, 0, .25)',
                    color: '#757575',
                    fontSize: '14px',
                    fontWeight: '500',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
                    backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=)',
                    backgroundColor: 'white',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: '12px 11px',
                    cursor: 'pointer',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.boxShadow = '0 -1px 0 rgba(0, 0, 0, .04), 0 2px 4px rgba(0, 0, 0, .25)')}
                  onMouseOut={(e) => (e.currentTarget.style.boxShadow = '0 -1px 0 rgba(0, 0, 0, .04), 0 1px 1px rgba(0, 0, 0, .25)')}
                  onMouseDown={(e) => (e.currentTarget.style.backgroundColor = '#eeeeee')}
                  onMouseUp={(e) => (e.currentTarget.style.backgroundColor = 'white')}
                  onFocus={(e) => (e.currentTarget.style.boxShadow = '0 -1px 0 rgba(0, 0, 0, .04), 0 2px 4px rgba(0, 0, 0, .25), 0 0 0 3px #c8dafc')}
                  onBlur={(e) => (e.currentTarget.style.boxShadow = '0 -1px 0 rgba(0, 0, 0, .04), 0 1px 1px rgba(0, 0, 0, .25)')}
                >
                  Sign in with Google
                </button>
                <div className="containertext mb-2 mt-[40px]">
                  <span className="text-wrapper text-gray-500">Use your email for registration</span>
                </div>
                <input type="text" name="name" placeholder="Name" required />
                <input type="email" name="email" placeholder="Email" value={email}
                    onChange={(e) => { handleEmailChange(e); setEmailError(""); }}
                        required className={`border ${emailError ? "border-red-500" : "border-gray-300"} p-2 rounded-md`}
                    />
                    {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                <input type="password" name="password" placeholder="Password" value={password} onChange={handlePasswordChange} required />
                <input type="password" name="password_confirmation" placeholder="Confirm Password" required />
                <button type="submit" className=" bg-blue-600 hover:bg-blue-700">Sign Up</button>
              </form>
            </div>
            <div className="toggle-container">
              <div className="toggle">
                <div className="toggle-panel toggle-left">
                  <h1>Welcome Back!</h1>
                  <p>To keep connected with us please login with your personal info</p>
                  <button id="signIn" onClick={handleSignInClick} className=" bg-blue-600 hover:bg-blue-700">Sign In</button>
                </div>
                <div className="toggle-panel toggle-right">
                  <h1>Hello, Friend!</h1>
                  <p>Enter your personal details and start journey with us</p>
                  <button id="signUp" onClick={handleSignUpClick} className=" bg-blue-600 hover:bg-blue-700">Sign Up</button>
                </div>
              </div>
            </div>
          </div>
    </div>
  );
}

export default LoginForm;
