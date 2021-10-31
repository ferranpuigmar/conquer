import LocalStorage from "./utils";
import { v4 as uuidv4 } from 'uuid';

class Login {

  fields = {}
  errors = {}
  local = new LocalStorage();

  constructor(loginFields){
    this.form = document.getElementById(loginFields.formId)
    this.emailInput = document.getElementById(loginFields.emailId);
    this.passwordInput = document.getElementById(loginFields.passwordId);
    this.registerSubmitBtn = document.getElementById(loginFields.submtBtn);
  }

  validateEmail(name, element, value){
    let message, isValid;

    if(value === ""){
      message = "El email no puede estar vacío"
      isValid = false;
    }

    if(value !== ""){
      const regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      isValid = regex.test(value);
      message = isValid ? "" : "El email no es válido"
    }

    if(isValid) {
      delete this.errors[name];
      element.classList.remove('is-invalid')
      document.getElementById(`${element.id}_error`).innerHTML = "";
      this.fields[name].value = value;
      return;
    } else {
      this.fields[name].value = '';
    }

    this.errors[name] = {
      element: element,
      message
    }
  }

  validatePassword(name, element, value){

    const isValid = value !== "";
    const message = isValid ? '' : "El password no puede estar vacío";

    if(isValid) {
      delete this.errors[name];
      element.classList.remove('is-invalid')
      document.getElementById(`${element.id}_error`).innerHTML = "";
      this.fields[name].value = value
      return;
    } else {
      this.fields[name].value = '';
    }

    this.errors[name] = {
      element: element,
      message
    }
  }

  registerLoginFields(){
    const requiredFields = [
      {name: 'emailInput', element: this.emailInput, validate: this.validateEmail.bind(this)},
      {name: 'passwordInput', element: this.passwordInput, validate: this.validatePassword.bind(this)}
    ]
    requiredFields.forEach(field => {
      this.fields[field.name] = {
        name: field.name,
        validate: field.validate,
        element: field.element,
        value: ''
      }
    })
  }

  assignListeners(){
    this.form.addEventListener('submit', this.send.bind(this));
  }

  init(){
    this.registerLoginFields();
    this.assignListeners();
  }

  loginUser(data){
    const allUSers = this.local.getLocalStorage('users');

    const user = allUSers.find(user => user.email === newUser.email);
    if(!user){
      this.showErrorMessage("No existe nadie con este email")
      return;
    }
    const passWordIsValid = allUSers.find(user => user.password === newUser.password);
    if(!passWordIsValid){
      this.showErrorMessage("La contraseña no es válida")
      return;
    }

    // Aqui va la lógica para poner al "user" (línea 95) dentro de los usuarios conectados
    this.local.setLocalStorage('me', user, 'sessionStorage');
    // También se tiene que redirigir al usuario a la ruta /rooms
    window.location.href = '/rooms';
  }

  showErrorMessage(message){
    const messageElement = document.getElementById('errorMessage');
    messageElement.innerHTML = message;
    messageElement.classList.remove('d-none');
  }

  send(e){
    e.preventDefault();
    const fields = this.fields;

    const errorMessageElement = document.getElementById('errorMessage');
    errorMessageElement.classList.add('d-none');

    Object.keys(fields).forEach(field => {
      this.fields[field].validate(fields[field].name, fields[field].element, fields[field].element.value)
    })

    const existErrors = Object.keys(this.errors).length !== 0;

    if(existErrors){
      Object.keys(this.errors).forEach(error => {
        const inputElement = this.errors[error].element;
        const msgErrorElement = `${inputElement.id}_error`;
        inputElement.classList.add('is-invalid');
        document.getElementById(msgErrorElement).innerHTML = this.errors[error].message;
      })
      return;
    }

    const data  = {
      email: this.fields.emailInput.value,
      password: this.fields.passwordInput.value,
    };

    // Método para enviar la información al localStorage, al apartado de usuaros conectados
    this.loginUser(data);
  }

}

export default Login;