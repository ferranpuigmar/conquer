class DragAndDrop{
    
   
    init(){
        let avatarMobile = document.querySelector('#avatarMobile');
        avatarMobile.addEventListener('dragstart', dragIniciado, false);
        avatarMobile-item.addEventListener('dragend', dragFinalizado, false);
        avatarMobile-item.addEventListener('drag', drageando, false);
        
        document.querySelectorAll('.m-room-drop-item__image').forEach((el)=>{
            el.addEventListener('dragenter', dragEntraContenedor,false);
            el.addEventListener('dragover', dragSobreContenedor,false);
            el.addEventListener('dragleave', dragFueraContenedor,false);
            el.addEventListener('drop', controlDrop,false);            
         });
        
    }

    drageando(ev){
      ev.dataTransfer.setData("text", ev.target.id);
    }

    dragIniciado(e){
      this.style.opacity=0.25;
      let padre = document.createElement('p');
      let clon = this.cloneNode(true);
      padre.appendChild(clon);
      e.dataTransfer.setData('text',padre.innerHTML);
    } 
       
    dragFinalizado(e){
      this.style.opacity=0.25;
    }

    dragEntraContenedor(e){
      //e.preventDefault();
    }

    dragSobreContenedor(e){
      e.preventDefault();
      this.classList.add('over');
      return false;
    }

    dragFueraContenedor(e){
      this.classList.remove('over');
    }

    controlDrop(e){
      //recuperar datos usuario de sesionStorage
      contenedor.appendChild(avatarMobile);
      let datos = e.dataTransfer.getData('text');
      this.innerHTML += datos;
    }
}

export default DragAndDrop;