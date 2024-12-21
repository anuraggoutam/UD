import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "/register";

export const Signup = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({ user, pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response?.data);
      console.log(response?.accessToken);
      setSuccess(true);
      //clear state and controlled inputs
      setUser("");
      setPwd("");
      setMatchPwd("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg("Username Taken");
      } else {
        setErrMsg("Registration Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        <section className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Success!</h1>
          <p>
            <a href="#" className="text-blue-500">
              Sign In
            </a>
          </p>
        </section>
      ) : (
        <section className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
          <p
            ref={errRef}
            className={
              errMsg ? "errmsg text-red-500 text-center mb-4" : "offscreen"
            }
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1 className="text-2xl font-bold text-black mb-6">Register</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  ref={userRef}
                  autoComplete="off"
                  onChange={(e) => setUser(e.target.value)}
                  value={user}
                  required
                  aria-invalid={validName ? "false" : "true"}
                  aria-describedby="uidnote"
                  onFocus={() => setUserFocus(true)}
                  onBlur={() => setUserFocus(false)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FontAwesomeIcon
                  icon={faCheck}
                  className={
                    validName
                      ? "valid absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500"
                      : "hide"
                  }
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={
                    validName || !user
                      ? "hide"
                      : "invalid absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500"
                  }
                />
              </div>
              <p
                id="uidnote"
                className={
                  userFocus && user && !validName
                    ? "instructions text-sm text-gray-500 mt-1"
                    : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} /> 4 to 24 characters. Must
                begin with a letter. Letters, numbers, underscores, hyphens
                allowed.
              </p>
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  required
                  aria-invalid={validPwd ? "false" : "true"}
                  aria-describedby="pwdnote"
                  onFocus={() => setPwdFocus(true)}
                  onBlur={() => setPwdFocus(false)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FontAwesomeIcon
                  icon={faCheck}
                  className={
                    validPwd
                      ? "valid absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500"
                      : "hide"
                  }
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={
                    validPwd || !pwd
                      ? "hide"
                      : "invalid absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500"
                  }
                />
              </div>
              <p
                id="pwdnote"
                className={
                  pwdFocus && !validPwd
                    ? "instructions text-sm text-gray-500 mt-1"
                    : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} /> 8 to 24 characters. Must
                include uppercase and lowercase letters, a number, and a special
                character.
              </p>
            </div>

            <div className="mb-6">
              <label htmlFor="confirm_pwd" className="block text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="confirm_pwd"
                  onChange={(e) => setMatchPwd(e.target.value)}
                  value={matchPwd}
                  required
                  aria-invalid={validMatch ? "false" : "true"}
                  aria-describedby="confirmnote"
                  onFocus={() => setMatchFocus(true)}
                  onBlur={() => setMatchFocus(false)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FontAwesomeIcon
                  icon={faCheck}
                  className={
                    validMatch && matchPwd
                      ? "valid absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500"
                      : "hide"
                  }
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={
                    validMatch || !matchPwd
                      ? "hide"
                      : "invalid absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500"
                  }
                />
              </div>
              <p
                id="confirmnote"
                className={
                  matchFocus && !validMatch
                    ? "instructions text-sm text-gray-500 mt-1"
                    : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} /> Must match the first
                password input field.
              </p>
            </div>

            <button
              disabled={!validName || !validPwd || !validMatch}
              className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center mt-4">
            Already registered?{" "}
            <a href="#" className="text-blue-500">
              Sign In
            </a>
          </p>
        </section>
      )}
    </>
  );
};
