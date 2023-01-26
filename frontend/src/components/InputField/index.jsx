/* eslint-disable react/forbid-prop-types */
import { useState, useEffect, useRef } from "react";
import { FaCheck, FaInfoCircle, FaTimes } from "react-icons/fa";
import PropTypes from "prop-types";

function InputField({
  type,
  name,
  label,
  placeholder,
  regExp,
  inputDescription,
  inputs,
  setInputs,
  validInputs,
  setValidInputs,
}) {
  const focusRef = useRef();
  const [inputFocus, setInputFocus] = useState(false);

  useEffect(() => {
    if (name === "firstname") {
      focusRef.current.focus();
    }
  }, [name]);

  const handleChange = (e) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [e.target.name]: e.target.value,
    }));
    setValidInputs((prevValidInputs) => ({
      ...prevValidInputs,
      [e.target.name]: regExp.test(e.target.value),
    }));
  };

  return (
    <>
      <div className="labelAndInputContainer">
        <label htmlFor={name}>
          {label}
          <span className={validInputs[name] ? "valid" : "hide"}>
            <FaCheck />
          </span>
          <span
            className={validInputs[name] || !inputs[name] ? "hide" : "invalid"}
          >
            <FaTimes />
          </span>
        </label>
        <input
          type={type}
          name={name}
          id={name} // has to match the htmlfor in label
          ref={focusRef} // to set focus on the input (with useRef we created and condition if input = firstname)
          autoComplete="off" // don't want autocomplete on a registration / signup form
          value={inputs[name]} // makes it a controlled input -> necessary to empty out in handleSubmit (setFirstname(""))
          onChange={handleChange} // ties the input to the state
          placeholder={placeholder}
          aria-invalid={validInputs[name] ? "false" : "true"} // accessibility , lets a screenreader announce if the input needs to be adjusted => if validInput is false and there is an error to fix
          aria-describedby={`${name}idnote`} // lets us provide another element that describes the input field, so a screenreader will read the requirements our form needs
          onFocus={() => setInputFocus(true)} // simply setting if the field has focus & set it to true
          onBlur={() => setInputFocus(false)} // when you leave input field -> set the focus to false
        />
      </div>
      <p
        id={`${name}idnote`}
        className={
          inputFocus && inputs[name] && !validInputs[name] // focus is on input & input is not empty NOR valid
            ? "instructions" // then show instructions with css styling
            : "offscreen" // or dont show it with css styling
        }
      >
        <FaInfoCircle /> {inputDescription}
      </p>
    </>
  );
}

InputField.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.oneOf(["firstname", "lastname", "email", "password"])
    .isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  regExp: PropTypes.any,
  inputDescription: PropTypes.string,
  inputs: PropTypes.objectOf(PropTypes.string).isRequired,
  validInputs: PropTypes.objectOf(PropTypes.bool).isRequired,
  setInputs: PropTypes.any.isRequired,
  setValidInputs: PropTypes.any.isRequired,
};

InputField.defaultProps = {
  label: "",
  regExp: null,
  inputDescription: null,
};

export default InputField;
