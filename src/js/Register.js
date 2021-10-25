class Register {

  fields = {}
  errors = {}

  constructor(registerFields){
    this.form = document.getElementById(registerFields.formId)
    this.emailInput = document.getElementById(registerFields.emailId);
    this.passwordInput = document.getElementById(registerFields.passwordId);
    this.favouriteRoom = document.getElementById(registerFields.favouriteRoomId);
    this.avatarWrapper = document.getElementById(registerFields.avatarWrapperId);
    this.registerSubmitBtn = document.getElementById(registerFields.submtBtn);
  }

  onSelectAvatar(e){
    const avatarMod = e.target.dataset.mod;
    const avatarId = e.target.id;
    const avatarDiv = document.getElementById(avatarId);

    const avatars = this.avatarWrapper.querySelectorAll('.a-avatar');
    avatars.forEach(avatar => {
      avatar.classList.remove('active')
    })

    avatarDiv.classList.add('active');
  }

  assignListeners(){
    const avatars = this.avatarWrapper.querySelectorAll('.a-avatar');
    avatars.forEach(avatar => {
      avatar.addEventListener('click', this.onSelectAvatar.bind(this));
    })

    this.form.addEventListener('submit', this.send.bind(this));
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

  validateFavouriteRoom(name, element, value){
    const isValid = value !== "0";
    const message = isValid ? '' : "Debes seleccionar una sala";

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

  registerFields(){
    const requiredFields = [
      {name: 'emailInput', element: this.emailInput, validate: this.validateEmail.bind(this)},
      {name: 'passwordInput', element: this.passwordInput, validate: this.validatePassword.bind(this)},
      {name: 'favouriteRoom', element: this.favouriteRoom, validate: this.validateFavouriteRoom.bind(this)}
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

  init(){
    this.assignListeners();
    this.registerFields();
  }

  send(e){
    e.preventDefault();
    const fields = this.fields;

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
      avatar: `mod${this.avatarWrapper.querySelector('.active').dataset.mod}`,
      favouriteRoom: this.fields.favouriteRoom.value
    };

    // Evento para enviar la información al localStorage, al apartado de usuaros registrados

  }

}

export default Register;