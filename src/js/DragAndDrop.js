import LocalStorage from "./utils";

class DragAndDrop {
  localStorage = new LocalStorage();

  drageando(ev) {
    // Comportamiento del resto de elementos cuando empieza el drag
  }

  dragIniciado(e) {
    // this.style.opacity = 0.25;
    // let padre = document.createElement("p");
    // let clon = this.cloneNode(true);
    // padre.appendChild(clon);
    // e.dataTransfer.setData("userInfo", padre.innerHTML);
  }

  dragFinalizado(e) {
    // this.style.opacity = 0.25;
  }

  dragEntraContenedor(e) {
    // console.log("dragEntraContenedor id: ", e.dataTransfer.id);
    //e.preventDefault();
  }

  dragSobreContenedor(e) {
    // console.log("dragSobreContenedor e: ", e);
    e.preventDefault();
    //this.classList.add("over");
    return false;
  }

  dragFueraContenedor(e) {
    //this.classList.remove("over");
  }

  controlDrop(e) {
    let datos = e.dataTransfer.getData("userInfo");
    console.log("e: ", e);
    const currentDragUser = this.localStorage.getLocalStorage("me", "session");
    console.log("userInfo: ", currentDragUser);
    this.innerHTML += datos;
  }

  init() {
    let avatarMobile = document.querySelector("#avatarMobile");
    avatarMobile.addEventListener(
      "dragstart",
      this.dragIniciado.bind(this),
      false
    );
    avatarMobile.addEventListener(
      "dragend",
      this.dragFinalizado.bind(this),
      false
    );
    // avatarMobile.addEventListener("drag", this.drageando, false);

    document.querySelectorAll(".m-room-drop-item__image").forEach((el) => {
      el.addEventListener(
        "dragenter",
        this.dragEntraContenedor.bind(this),
        false
      );
      el.addEventListener(
        "dragover",
        this.dragSobreContenedor.bind(this),
        false
      );
      // el.addEventListener("dragleave", this.dragFueraContenedor, false);
      el.addEventListener("drop", this.controlDrop.bind(this), false);
    });
  }
}

export default DragAndDrop;
