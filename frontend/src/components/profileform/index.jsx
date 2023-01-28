/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaInfoCircle, FaTimes, FaEyeSlash, FaEye } from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";
import InputField from "../InputField";
import useAxiosFetchFunction from "../../hooks/useAxiosFetchFunction";
import useWindowSize from "../../hooks/useWindowSize";
import { getOneUser, updateUser, deleteUser, deactivateUser } from "../../api/calls/usercalls";
import useAuth from "../../hooks/useAuth";
import "../signupform/forms.scss";
import "./profileform.scss";

export default function ProfileForm() {
  const { auth } = useAuth();
  const { width } = useWindowSize();
  const navigate = useNavigate();
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [showOldPwd, setShowOldPwd] = useState(false);

  const [inputs, setInputs] = useState({ firstname: "", lastname: "", password: "", confirmPwd: "", oldPassword: "" });
  const [validInputs, setValidInputs] = useState({ firstname: true, lastname: true, password: false });

  const { firstname, lastname, password, confirmPwd, oldPassword } = inputs;
  const validPassword = validInputs.password;

  // eslint-disable-next-line no-unused-vars
  const [oldPwdFocus, setOldPwdFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [confirmPwdFocus, setConfirmPwdFocus] = useState(false);

  const nameRegExp = /^[a-zA-Zçéèêëàâîïôùû' -]{2,25}$/;
  const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;

  const [response, fetchError, loading, axiosFetch] = useAxiosFetchFunction();
  const [updateRes, updateErr, updateload, updateAxiosFetch] = useAxiosFetchFunction();
  const [deleteRes, deleteErr, deleteload, deleteAxiosFetch] = useAxiosFetchFunction();
  const [deactivateRes, deactivateErr, deactivateload, deactivateAxiosFetch] = useAxiosFetchFunction();

  useEffect(() => {
    setErrMsg("");
  }, [firstname, lastname, password, confirmPwd]);

  useEffect(() => {
    if (updateRes) {
      setInputs({ firstname, lastname, password: "", confirmPwd: "", oldPassword: "" });
      setValidInputs({ firstname: true, lastname: true, password: false, confirmpwd: false });
      toast.success("Profil modifié !");
    }
  }, [updateRes]);

  useEffect(() => {
    if (deleteRes) {
      toast.success("Profil supprimé !");
      setInputs({ firstname: "", lastname: "", password: "", confirmPwd: "", oldPassword: "" });
      setTimeout(() => { navigate("/signup") }, 1000);
    }
  }, [deleteRes]);

  useEffect(() => {
    if (deactivateRes) {
      toast.success("Profil désactivé !");
      setInputs({ firstname: "", lastname: "", password: "", confirmPwd: "", oldPassword: "" });
      setTimeout(() => { navigate("/signup") }, 1000);
    }
  }, [deactivateRes]);

  useEffect(() => {
    if (response ) {
      setInputs({ firstname: response.firstname, lastname: response.lastname, password: "", confirmPwd: "", oldPassword: "" });
      setValidInputs({ firstname: true, lastname: true, password: false, confirmpwd: false });
    } 
  }, [response]);

  useEffect(() => {
    let ignore = false;
    if (fetchError && !ignore) {
      setErrMsg(fetchError);
    } else if (updateErr && !ignore) {
      setErrMsg(updateErr);
    } else if (deleteErr && !ignore) {
      setErrMsg(deleteErr);
    } else if (deactivateErr && !ignore) {
      setErrMsg(deactivateErr);
    }
    errRef.current.focus();
    return () => { ignore = true };
  }, [fetchError, updateErr, deleteErr]);

  useEffect(() => {
    getOneUser(axiosFetch);
  }, []);

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    updateUser(updateAxiosFetch, firstname, lastname, oldPassword, password);
    setShowConfirmPwd(false);
    setShowOldPwd(false);
    setShowPwd(false);
  };

  const handleDelete = async () => {
    deleteUser(deleteAxiosFetch);
  };

  const confirmDelete = () => {
    confirmAlert({
      title: "Confirmation :",
      message:
        "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et toutes les données liées à ce compte seront perdues",
      buttons: [
        { label: "Confirmer", onClick: () => handleDelete() },
        { label: "Annuler" },
      ],
    });
  };

  const handleDeactivate = async () => {
    if (auth.token || auth.isAdmin) {
      deactivateUser(deactivateAxiosFetch);
    }
  };

  const confirmDeactivate = () => {
    confirmAlert({
      title: "Confirmation :",
      message:
        "Votre profil et messages ne seront plus visibles, mais pourront être réactivés par votre administrateur. Êtes-vous sûr de vouloir désactiver votre compte ?",
      buttons: [
        { label: "Confirmer", onClick: () => handleDeactivate() },
        { label: "Annuler" },
      ],
    });
  };

  return (
    <article className="formContainer">
      <form className="formItems" onSubmit={handleSubmitUpdate}>
        <p ref={errRef} className={errMsg ? "errMsg" : "offscreen"} aria-live="assertive">
          {errMsg}
        </p>
        {loading || updateload || deleteload || deactivateload && <p>Chargement en cours ...</p>}
        
        <InputField
          type="text"
          name="firstname"
          label="Prénom :"
          placeholder="Votre prénom"
          regExp={nameRegExp}
          inputDescription="2 à 25 caractères (sans chiffres ni caractères spéciaux"
          inputs={inputs}
          setInputs={setInputs}
          validInputs={validInputs}
          setValidInputs={setValidInputs}
        />

        <InputField
          type="text"
          name="lastname"
          label="Nom :"
          placeholder="Votre nom"
          regExp={nameRegExp}
          inputDescription="2 à 25 caractères (sans chiffres ni caractères spéciaux"
          inputs={inputs}
          setInputs={setInputs}
          validInputs={validInputs}
          setValidInputs={setValidInputs}
        />

        <h2>Changer mon mot de passe :</h2>

        <div className="labelAndInputContainer passwordLabelAndInput">
          <label htmlFor="oldPassword"> Ancien mot de passe :</label>
          <div className="pwdContainer">
          <input
            type={showOldPwd ? "text" : "password"}
            id="oldPassword"
            value={oldPassword}
            autoComplete="off"
            onChange={(e) => {
              setInputs((prevInputs) => ({...prevInputs, oldPassword: e.target.value}));
            }}
            placeholder="Votre mot de passe actuel"
            onFocus={() => setOldPwdFocus(true)}
            onBlur={() => setOldPwdFocus(false)}
            />
            <button type="button" className="showPwd" onClick={() => setShowOldPwd(!showOldPwd)}>
              {!showOldPwd ? <FaEye /> : <FaEyeSlash />}
            </button>
            </div>
          </div>
        
          <div className="labelAndInputContainer passwordLabelAndInput">
          <label htmlFor="password">
            Mot de passe :
            <span className={validPassword ? "valid" : "hide"}>
              <FaCheck />
            </span>
            <span className={validPassword || !password ? "hide" : "invalid"}>
              <FaTimes />
              </span>
          </label>
          <div className="pwdContainer">
            <input
              type={showPwd ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              autoComplete="off"
              onChange={(e) => {
                setInputs((prevInputs) => ({
                  ...prevInputs,
                  [e.target.name]: e.target.value,
                }));
                setValidInputs((prevValidInputs) => ({
                  ...prevValidInputs,
                  [e.target.name]: passwordRegExp.test(e.target.value),
                }));
              }}
              placeholder="Votre mot de passe"
              aria-invalid={validPassword ? "false" : "true"}
              aria-describedby="passwordidnote"
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
            />
            <button type="button" className="showPwd" onClick={() => setShowPwd(!showPwd)}>
              {!showPwd ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>
        <p
          id="passwordidnote"
          className={
            passwordFocus && password  && !validPassword// focus is on input & input is not valid , here we want the instructions even if input is empty (if focused)
              ? "instructions" // then show instructions with css styling
              : "offscreen" // or dont show it with css styling
          }
        >
          <FaInfoCircle /> 8 à 24 caractères, incluant un chiffre, une lettre minuscule et majuscule
        </p>

        <div className="labelAndInputContainer passwordLabelAndInput">
          <label htmlFor="confirmPassword">
            Confirmez le
            {width > 992 ? <br /> : " "}
            nouveau mot de passe :
            <span className={confirmPwd === password && validPassword ? "valid" : "hide"}>
              <FaCheck />
            </span>
            <span className={(confirmPwd === password && validPassword) || !confirmPwd ? "hide" : "invalid"}>
              <FaTimes />
            </span>
          </label>
          <div className="pwdContainer">
            <input
              type={showConfirmPwd ? "text" : "password"}
              id="confirmPassword"
              value={confirmPwd}
              autoComplete="off"
              onChange={(e) => {
                setInputs((prevInputs) => ({...prevInputs, confirmPwd: e.target.value}));
              }}
              placeholder="Confirmez le mot de passe"
              aria-invalid={confirmPwd === password ? "false" : "true"}
              aria-describedby="confirmpwidnote"
              onFocus={() => setConfirmPwdFocus(true)}
              onBlur={() => setConfirmPwdFocus(false)}
            />
            <button type="button" className="showPwd" onClick={() => setShowConfirmPwd(!showConfirmPwd)}>
              {!showConfirmPwd ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>
        <p
          id="confirmpwidnote"
          className={confirmPwdFocus && confirmPwd !== password ? "instructions" : "offscreen"}>
          <FaInfoCircle /> Doit être identique au mot de passe saisi ci-dessus
        </p>

        <button
          type="submit"
          disabled={!firstname && !lastname && !password && confirmPwd !== password}
          className={!firstname && !lastname && !password && confirmPwd !== password ? "disabled" : "notDisabled"}>
          Enregistrer mes modifications
        </button>
        <button type="button" className="deleteBtn" onClick={confirmDelete}>
          Supprimer mon compte
        </button>
        <button type="button" className="deactivateBtn deleteBtn" onClick={confirmDeactivate}>
          Désactiver mon compte
        </button>
      </form>
    </article>
  );
}

