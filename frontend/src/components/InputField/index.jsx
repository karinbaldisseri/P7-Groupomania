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
  setFormInputs,
  setValidFormInputs,
}) {
  // to put focus on input when page loads
  // const focusRef = useRef();

  // ??? Comment vider à l'envoi du formulaire dans composant parent?
  const [inputValue, setInputvalue] = useState("");
  const [validInput, setValidInput] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);

  /* useEffect(() => {
    if (name === "firstname") {
      focusRef.current.focus();
    }
  }, [name]); */

  const handleChange = (e) => {
    setInputvalue(e.target.value);
    setFormInputs((prevFormInputs) => ({
      ...prevFormInputs,
      [e.target.name]: e.target.value,
    }));
    setValidInput(regExp.test(e.target.value));
    setValidFormInputs((prevValidFormInputs) => ({
      ...prevValidFormInputs,
      [e.target.name]: regExp.test(e.target.value),
    }));
  };

  return (
    <>
      <label htmlFor={name}>
        {label}
        <span className={validInput ? "valid" : "hide"}>
          <FaCheck />
        </span>
        <span className={validInput || !inputValue ? "hide" : "invalid"}>
          <FaTimes />
        </span>
        <input
          type={type}
          name={name}
          id={name} // has to match the htmlfor in label
          // ref={focusRef} // to set focus on the input (with useRef we created and condition if input = firstname)
          autoComplete="off" // don't want autocomplete on a registration / signup form
          value={inputValue} // makes it a controlled input -> necessary to empty out in handleSubmit (setFirstname(""))
          onChange={handleChange} // ties the input to the state
          placeholder={placeholder}
          // required
          aria-invalid={validInput ? "false" : "true"} // accessibility , lets a screenreader announce if the input needs to be adjusted => if validInput is false and there is an error to fix
          aria-describedby={`${name}idnote`} // lets us provide another element that describes the input field, so a screenreader will read the requirements our form needs
          onFocus={() => setInputFocus(true)} // simply setting if the field has focus & set it to true
          onBlur={() => setInputFocus(false)} // when you leave input field -> set the focus to false
        />
      </label>
      <p
        id={`${name}idnote`}
        className={
          inputFocus && inputValue && !validInput // focus is on input & input is not empty NOR valid
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
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  regExp: PropTypes.any,
  inputDescription: PropTypes.string,
  setFormInputs: PropTypes.any,
  setValidFormInputs: PropTypes.any,
};

InputField.defaultProps = {
  regExp: null,
  inputDescription: null,
  setFormInputs: {},
  setValidFormInputs: {},
};

export default InputField;
