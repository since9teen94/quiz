import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./UserForm.module.css";
const UserForm = (props) => {
  const { type } = props;
  const login = [
    {
      name: "username",
      type: "text",
      text: "Username",
    },
    {
      name: "password",
      type: "password",
      text: "Password",
    },
  ];
  const register = [
    ...login,
    {
      name: "confirmPassword",
      type: "password",
      text: "Confirm Password",
    },
  ];
  const formFields = type === "login" ? login : register;
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = {
      username: e.target.username.value,
      password: e.target.password.value,
    };
    if (type === "register") {
      data.confirmPassword =
        e.target.confirmPassword.value === undefined ||
        e.target.confirmPassword.value === null
          ? ""
          : e.target.confirmPassword.value;
      if (
        e.target.password.value &&
        e.target.confirmPassword.value &&
        e.target.password.value !== e.target.confirmPassword.value
      ) {
        e.target.password.value = "";
        e.target.confirmPassword.value = "";
        return setFormError("Passwords must match");
      }
    }
    if (Object.values(data).some((val) => val.length === 0)) {
      document.getElementById("userForm").reset();
      setFormError("All Fields Required");
      return;
    }

    const submit = async (body) => {
      const req = await fetch(
        `/users/${type === "login" ? "login" : "register"}`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      const res = await req.json();
      return res;
    };
    try {
      const res = await submit(data);
      if (res.error) {
        document.getElementById("userForm").reset();
        setFormError("Invalid Credentials");
      }
      if (res.session) {
        localStorage.setItem("session", JSON.stringify(res.session));
        navigate("/records");
      }
    } catch (error) {
      console.log({ error: "Invalid Credentials" });
    }
  };
  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      method="post"
      id="userForm"
      className={styles.form}
    >
      <h2>{type === "login" ? "Log In" : "Register"}</h2>
      {type === "login" && (
        <a href="/register" className={styles.link}>
          {"Don't have an account?"}
        </a>
      )}
      {type === "register" && (
        <a href="/login" className={styles.link}>
          {"Already have an account?"}
        </a>
      )}
      {formFields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name}>{field.text}</label>
          <input
            name={field.name}
            type={field.type}
            id={field.name}
            placeholder={`${field.text}...`}
          ></input>
        </div>
      ))}
      <button type="submit">{type === "login" ? "Log In" : "Register"}</button>
      {formError && <p className={styles.error}>{formError}</p>}
    </form>
  );
};

export default UserForm;
