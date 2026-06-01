// import React, { useState, useEffect, useContext, useRef } from "react";
// import "./LoginPopup.css";
// import { assets } from "../../assets/assets";
// import { StoreContext } from "../../context/StoreContext";
// import axios from "axios";
// import { successToast, errorToast } from "../../utils/toast";

// const LoginPopup = ({ setShowLogin }) => {
//   const { url, setToken } = useContext(StoreContext);

//   const [currentState, setCurrentState] = useState("Sign Up");
//   const [data, setData] = useState({ name: "", email: "", password: "" });
//   const [otpSent, setOtpSent] = useState(false);
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const inputRefs = useRef([]);

//   // ⏳ new states for resend timer
//   const [timer, setTimer] = useState(30);
//   const [canResend, setCanResend] = useState(false);

//   const closePopup = () => {
//     if (setShowLogin) {
//       setShowLogin(false);
//     } else {
//       // fallback when opened from /login route
//       window.history.back(); // go back to previous page
//     }
//   };
//   const onChangeHandler = (e) => {
//     const { name, value } = e.target;
//     setData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleOtpChange = (e, index) => {
//     const value = e.target.value.replace(/\D/g, ""); // digits only
//     const newOtp = [...otp];
//     newOtp[index] = value;

//     setOtp(newOtp);

//     // Move to next box if a digit is entered
//     if (value && index < 5) {
//       inputRefs.current[index + 1].focus();
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace") {
//       if (otp[index]) {
//         // clear current box
//         const newOtp = [...otp];
//         newOtp[index] = "";
//         setOtp(newOtp);
//       } else if (index > 0) {
//         // move focus back
//         inputRefs.current[index - 1].focus();
//       }
//     }
//   };

//   // 📨 Step 1: Send OTP
//   const onLogin = async (e) => {
//     e.preventDefault();

//     if (currentState === "Login") {
//       const res = await axios.post(`${url}/api/user/login`, data);
//       if (res.data.success) {
//         setToken(res.data.token);
//         localStorage.setItem("token", res.data.token);
//         successToast("Login successful!");
//         setShowLogin(false);
//       } else {
//         errorToast(res.data.message);
//       }
//     } else {
//       const res = await axios.post(`${url}/api/user/register`, data);
//       if (res.data.success) {
//         setOtpSent(true);
//         successToast("OTP sent to your email.");

//         // reset timer
//         setTimer(30);
//         setCanResend(false);
//       } else {
//         errorToast(res.data.message);
//       }
//     }
//   };

//   // 🔁 resend OTP
//   const resendOtp = async () => {
//     try {
//       const res = await axios.post(`${url}/api/user/register`, data);
//       if (res.data.success) {
//         successToast("OTP resent to your email.");

//         // reset timer & OTP boxes
//         setTimer(30);
//         setCanResend(false);
//         setOtp(["", "", "", "", "", ""]);

//         // focus back to the first input
//         if (inputRefs.current[0]) {
//           inputRefs.current[0].focus();
//         }
//       } else {
//         errorToast(res.data.message);
//       }
//     } catch (err) {
//       errorToast("Failed to resend OTP");
//     }
//   };

//   // ⏲️ countdown effect
//   useEffect(() => {
//     if (!otpSent) return;

//     if (timer > 0) {
//       const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
//       return () => clearInterval(interval);
//     } else {
//       setCanResend(true);
//     }
//   }, [otpSent, timer]);

//   // ✅ Verify OTP
//   const verifyOtp = async (e) => {
//     e.preventDefault();
//     const fullOtp = otp.join("");
//     const res = await axios.post(`${url}/api/user/verify`, {
//       ...data,
//       otp: fullOtp,
//     });

//     if (res.data.success) {
//       setToken(res.data.token);
//       localStorage.setItem("token", res.data.token);
//       successToast("Account verified & created!");
//       setShowLogin(false);
//     } else {
//       errorToast(res.data.message);
//     }
//   };

//   return (
//     <div className="login-popup" id="login-popup">
//       <form
//         onSubmit={otpSent ? verifyOtp : onLogin}
//         className="login-container"
//       >
//         <img
//           src={assets.login_form_img}
//           alt="Login Poster"
//           className="login-popup-poster"
//         />

//         <div className="login-main-container">
//           <div className="login-popup-title">
//             <h2>
//               {otpSent
//                 ? "Verify Email"
//                 : currentState === "Login"
//                 ? "Login"
//                 : "Sign Up"}
//             </h2>
//             <div onClick={closePopup}> ✖ </div>
//           </div>

//           {!otpSent ? (
//             <div className="login-popup-inputs">
//               {currentState === "Login" ? null : (
//                 <input
//                   name="name"
//                   onChange={onChangeHandler}
//                   value={data.name}
//                   type="text"
//                   placeholder="Your Username"
//                   required
//                 />
//               )}
//               <input
//                 name="email"
//                 onChange={onChangeHandler}
//                 value={data.email}
//                 type="email"
//                 placeholder="Your email"
//                 required
//               />
//               <input
//                 name="password"
//                 onChange={onChangeHandler}
//                 value={data.password}
//                 type="password"
//                 placeholder="Your Password"
//                 required
//               />
//             </div>
//           ) : (
//             <div className="login-popup-inputs otp-boxes">
//               {otp.map((digit, i) => (
//                 <input
//                   key={i}
//                   type="text"
//                   maxLength="1"
//                   value={digit}
//                   onChange={(e) => handleOtpChange(e, i)}
//                   onKeyDown={(e) => handleKeyDown(e, i)}
//                   ref={(el) => (inputRefs.current[i] = el)}
//                   className="otp-input"
//                   required
//                 />
//               ))}
//             </div>
//           )}

//           <button type="submit">
//             {otpSent
//               ? "Verify Code"
//               : currentState === "Sign Up"
//               ? "Send Verification Code"
//               : "Login"}
//           </button>

//           {/* 🔁 Resend OTP timer & button */}
//           {otpSent && (
//             <div style={{ textAlign: "center", marginTop: "10px" }}>
//               {canResend ? (
//                 <p className="resend-otp" onClick={resendOtp}>
//                   Didn’t get the code? <span>Resend OTP</span>
//                 </p>
//               ) : (
//                 <p style={{ color: "#888" }}>Resend OTP in {timer}s</p>
//               )}
//             </div>
//           )}

//           {!otpSent && (
//             <>
//               <div className="login-popup-condition">
//                 <input type="checkbox" required />
//                 <p>
//                   By continuing, I agree to the terms of use & privacy policy.
//                 </p>
//               </div>
//               {currentState === "Login" ? (
//                 <p>
//                   Create a new account?{" "}
//                   <span onClick={() => setCurrentState("Sign Up")}>
//                     Click here
//                   </span>
//                 </p>
//               ) : (
//                 <p>
//                   Already have an account?{" "}
//                   <span onClick={() => setCurrentState("Login")}>
//                     Login here
//                   </span>
//                 </p>
//               )}
//             </>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// };

// export default LoginPopup;







// import React, { useState, useEffect, useContext, useRef } from "react";
// import "./LoginPopup.css";
// import { assets } from "../../assets/assets";
// import { StoreContext } from "../../context/StoreContext";
// import axios from "axios";
// import { successToast, errorToast } from "../../utils/toast";

// const LoginPopup = ({ setShowLogin }) => {
//   const { url, setToken } = useContext(StoreContext);

//   const [currentState, setCurrentState] = useState("Sign Up");
//   const [data, setData] = useState({ name: "", email: "", password: "" });
//   const [otpSent, setOtpSent] = useState(false);
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const inputRefs = useRef([]);

//   // ⏳ new states for resend timer
//   const [timer, setTimer] = useState(30);
//   const [canResend, setCanResend] = useState(false);

//   const [sendingCode, setSendingCode] = useState(false);
//   const [loggingIn, setLoggingIn] = useState(false);

//   const closePopup = () => {
//     if (setShowLogin) {
//       setShowLogin(false);
//     } else {
//       // fallback when opened from /login route
//       window.history.back(); // go back to previous page
//     }
//   };
//   const onChangeHandler = (e) => {
//     const { name, value } = e.target;
//     setData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleOtpChange = (e, index) => {
//     const value = e.target.value.replace(/\D/g, ""); // digits only
//     const newOtp = [...otp];
//     newOtp[index] = value;

//     setOtp(newOtp);

//     // Move to next box if a digit is entered
//     if (value && index < 5) {
//       inputRefs.current[index + 1].focus();
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace") {
//       if (otp[index]) {
//         // clear current box
//         const newOtp = [...otp];
//         newOtp[index] = "";
//         setOtp(newOtp);
//       } else if (index > 0) {
//         // move focus back
//         inputRefs.current[index - 1].focus();
//       }
//     }
//   };

//   // 📨 Step 1: Send OTP
//   const onLogin = async (e) => {
//     e.preventDefault();

//     if (currentState === "Login") {
//       setLoggingIn(true);
//       try {
//         const res = await axios.post(`${url}/api/user/login`, data);
//         if (res.data.success) {
//           setToken(res.data.token);
//           localStorage.setItem("token", res.data.token);
//           successToast("Login successful!");
//           setShowLogin(false);
//         } else {
//           errorToast(res.data.message);
//         }
//       } catch (err) {
//         errorToast("Login failed");
//       } finally {
//         setLoggingIn(false);
//       }
//     } else {
//       setSendingCode(true);
//       try {
//         const res = await axios.post(`${url}/api/user/register`, data);
//         if (res.data.success) {
//           setOtpSent(true);
//           successToast("OTP sent to your email.");
//           setTimer(30);
//           setCanResend(false);
//         } else {
//           errorToast(res.data.message);
//         }
//       } catch (err) {
//         errorToast("Failed to send OTP");
//       } finally {
//         setSendingCode(false);
//       }
//     }
//   };

//   // 🔁 resend OTP
//   const resendOtp = async () => {
//     try {
//       const res = await axios.post(`${url}/api/user/register`, data);
//       if (res.data.success) {
//         successToast("OTP resent to your email.");

//         // reset timer & OTP boxes
//         setTimer(30);
//         setCanResend(false);
//         setOtp(["", "", "", "", "", ""]);

//         // focus back to the first input
//         if (inputRefs.current[0]) {
//           inputRefs.current[0].focus();
//         }
//       } else {
//         errorToast(res.data.message);
//       }
//     } catch (err) {
//       errorToast("Failed to resend OTP");
//     }
//   };

//   // ⏲️ countdown effect
//   useEffect(() => {
//     if (!otpSent) return;

//     if (timer > 0) {
//       const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
//       return () => clearInterval(interval);
//     } else {
//       setCanResend(true);
//     }
//   }, [otpSent, timer]);

//   // ✅ Verify OTP
//   const verifyOtp = async (e) => {
//     e.preventDefault();
//     const fullOtp = otp.join("");
//     const res = await axios.post(`${url}/api/user/verify`, {
//       ...data,
//       otp: fullOtp,
//     });

//     if (res.data.success) {
//       setToken(res.data.token);
//       localStorage.setItem("token", res.data.token);
//       successToast("Account verified & created!");
//       setShowLogin(false);
//     } else {
//       errorToast(res.data.message);
//     }
//   };

//   return (
//     <div className="login-popup" id="login-popup">
//       <form
//         onSubmit={otpSent ? verifyOtp : onLogin}
//         className="login-container"
//       >
//         <img
//           src={assets.login_form_img}
//           alt="Login Poster"
//           className="login-popup-poster"
//         />

//         <div className="login-main-container">
//           <div className="login-popup-title">
//             <h2>
//               {otpSent
//                 ? "Verify Email"
//                 : currentState === "Login"
//                 ? "Login"
//                 : "Sign Up"}
//             </h2>
//             <div onClick={closePopup}> ✖ </div>
//           </div>

//           {!otpSent ? (
//             <div className="login-popup-inputs">
//               {currentState === "Login" ? null : (
//                 <input
//                   name="name"
//                   onChange={onChangeHandler}
//                   value={data.name}
//                   type="text"
//                   placeholder="Your Username"
//                   required
//                 />
//               )}
//               <input
//                 name="email"
//                 onChange={onChangeHandler}
//                 value={data.email}
//                 type="email"
//                 placeholder="Your email"
//                 required
//               />
//               <input
//                 name="password"
//                 onChange={onChangeHandler}
//                 value={data.password}
//                 type="password"
//                 placeholder="Your Password"
//                 required
//               />
//             </div>
//           ) : (
//             <div className="login-popup-inputs otp-boxes">
//               {otp.map((digit, i) => (
//                 <input
//                   key={i}
//                   type="text"
//                   maxLength="1"
//                   value={digit}
//                   onChange={(e) => handleOtpChange(e, i)}
//                   onKeyDown={(e) => handleKeyDown(e, i)}
//                   ref={(el) => (inputRefs.current[i] = el)}
//                   className="otp-input"
//                   required
//                 />
//               ))}
//             </div>
//           )}

//           <button type="submit" disabled={sendingCode || loggingIn}>
//             {otpSent ? (
//               "Verify Code"
//             ) : currentState === "Sign Up" ? (
//               sendingCode ? (
//                 <>
//                   <span className="spinner"></span> Sending...
//                 </>
//               ) : (
//                 "Send Verification Code"
//               )
//             ) : loggingIn ? (
//               <>
//                 <span className="spinner"></span> Logging in...
//               </>
//             ) : (
//               "Login"
//             )}
//           </button>

//           {/* 🔁 Resend OTP timer & button */}
//           {otpSent && (
//             <div style={{ textAlign: "center", marginTop: "10px" }}>
//               {canResend ? (
//                 <p className="resend-otp" onClick={resendOtp}>
//                   Didn’t get the code? <span>Resend OTP</span>
//                 </p>
//               ) : (
//                 <p style={{ color: "#888" }}>Resend OTP in {timer}s</p>
//               )}
//             </div>
//           )}

//           {!otpSent && (
//             <>
//               <div className="login-popup-condition">
//                 <input type="checkbox" required />
//                 <p>
//                   By continuing, I agree to the terms of use & privacy policy.
//                 </p>
//               </div>
//               {currentState === "Login" ? (
//                 <p>
//                   Create a new account?{" "}
//                   <span onClick={() => setCurrentState("Sign Up")}>
//                     Click here
//                   </span>
//                 </p>
//               ) : (
//                 <p>
//                   Already have an account?{" "}
//                   <span onClick={() => setCurrentState("Login")}>
//                     Login here
//                   </span>
//                 </p>
//               )}
//             </>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// };

// export default LoginPopup;



















import React, { useState, useEffect, useContext, useRef } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { successToast, errorToast } from "../../utils/toast";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);

  const [currentState, setCurrentState] = useState("Sign Up");
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  // ⏳ new states for resend timer
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const [sendingCode, setSendingCode] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [resending, setResending] = useState(false);

  const closePopup = () => {
    if (setShowLogin) {
      setShowLogin(false);
    } else {
      // fallback when opened from /login route
      window.history.back(); // go back to previous page
    }
  };
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, ""); // digits only
    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    // Move to next box if a digit is entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        // clear current box
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // move focus back
        inputRefs.current[index - 1].focus();
      }
    }
  };

  // 📨 Step 1: Send OTP
  const onLogin = async (e) => {
    e.preventDefault();

    if (currentState === "Login") {
      setLoggingIn(true);
      try {
        const res = await axios.post(`${url}/api/user/login`, data);
        if (res.data.success) {
          setToken(res.data.token);
          localStorage.setItem("token", res.data.token);
          successToast("Login successful!");
          setShowLogin(false);
        } else {
          errorToast(res.data.message);
        }
      } catch (err) {
        errorToast("Login failed");
      } finally {
        setLoggingIn(false);
      }
    } else {
      setSendingCode(true);
      try {
        const res = await axios.post(`${url}/api/user/register`, data);
        if (res.data.success) {
          setOtpSent(true);
          successToast("OTP sent to your email.");
          setTimer(30);
          setCanResend(false);
        } else {
          errorToast(res.data.message);
        }
      } catch (err) {
        errorToast("Failed to send OTP");
      } finally {
        setSendingCode(false);
      }
    }
  };

  // 🔁 resend OTP
  const resendOtp = async () => {
    setResending(true);
    try {
      const res = await axios.post(`${url}/api/user/register`, data);
      if (res.data.success) {
        successToast("OTP resent to your email.");

        // reset timer & OTP boxes
        setTimer(30);
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]);

        // focus back to the first input
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      } else {
        errorToast(res.data.message);
      }
    } catch (err) {
      errorToast("Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  // ⏲️ countdown effect
  useEffect(() => {
    if (!otpSent) return;

    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [otpSent, timer]);

  // ✅ Verify OTP
  const verifyOtp = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    const res = await axios.post(`${url}/api/user/verify`, {
      ...data,
      otp: fullOtp,
    });

    if (res.data.success) {
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      successToast("Account verified & created!");
      setShowLogin(false);
    } else {
      errorToast(res.data.message);
    }
  };

  return (
    <div className="login-popup" id="login-popup">
      <form
        onSubmit={otpSent ? verifyOtp : onLogin}
        className="login-container"
      >
        <img
          src={assets.login_form_img}
          alt="Login Poster"
          className="login-popup-poster"
        />

        <div className="login-main-container">
          <div className="login-popup-title">
            <h2>
              {otpSent
                ? "Verify Email"
                : currentState === "Login"
                ? "Login"
                : "Sign Up"}
            </h2>
            <div onClick={closePopup}> ✖ </div>
          </div>

          {!otpSent ? (
            <div className="login-popup-inputs">
              {currentState === "Login" ? null : (
                <input
                  name="name"
                  onChange={onChangeHandler}
                  value={data.name}
                  type="text"
                  placeholder="Your Username"
                  required
                />
              )}
              <input
                name="email"
                onChange={onChangeHandler}
                value={data.email}
                type="email"
                placeholder="Your email"
                required
              />
              <input
                name="password"
                onChange={onChangeHandler}
                value={data.password}
                type="password"
                placeholder="Your Password"
                required
              />
            </div>
          ) : (
            <div className="login-popup-inputs otp-boxes">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  ref={(el) => (inputRefs.current[i] = el)}
                  className="otp-input"
                  required
                />
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={sendingCode || loggingIn || resending}
          >
            {otpSent ? (
              resending ? (
                <>
                  <span className="spinner"></span> Resending...
                </>
              ) : (
                "Verify Code"
              )
            ) : currentState === "Sign Up" ? (
              sendingCode ? (
                <>
                  <span className="spinner"></span> Sending...
                </>
              ) : (
                "Send Verification Code"
              )
            ) : loggingIn ? (
              <>
                <span className="spinner"></span> Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>

          {/* 🔁 Resend OTP timer & button */}
          {otpSent && (
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              {canResend ? (
                <p className="resend-otp" onClick={resendOtp}>
                  Didn’t get the code? <span>Resend OTP</span>
                </p>
              ) : (
                <p style={{ color: "#888" }}>Resend OTP in {timer}s</p>
              )}
            </div>
          )}

          {!otpSent && (
            <>
              <div className="login-popup-condition">
                <input type="checkbox" required />
                <p>
                  By continuing, I agree to the terms of use & privacy policy.
                </p>
              </div>
              {currentState === "Login" ? (
                <p>
                  Create a new account?{" "}
                  <span onClick={() => setCurrentState("Sign Up")}>
                    Click here
                  </span>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <span onClick={() => setCurrentState("Login")}>
                    Login here
                  </span>
                </p>
              )}
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPopup;
