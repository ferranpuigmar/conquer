export default class LocalStorage {
  localStorage = window.localStorage;

  setLocalStorage(key, data, type){
    const dataToLocaltorage = JSON.stringify(data);
    this.localStorage.setItem(key, dataToLocaltorage)
  }

  getLocalStorage(key){
    const data = this.localStorage.getItem(key);
    return JSON.parse(data);
  }
}