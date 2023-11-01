// validacion formulario 
const form = document.getElementById('profile');

document.getElementById('saveProfile').addEventListener('click', (e) => {
    e.preventDefault()
    let valid = true;
      if (!form.checkValidity()) {
        valid = false;
      }
      form.classList.add('was-validated');
    if (valid) {
      alert.classList.remove('d-none');
    }
  });


  document.addEventListener("DOMContentLoaded", function () {
    const imageInput = document.getElementById("profileImg");
    const imagePreview = document.getElementById("image-preview");

    imageInput.addEventListener("change", () => {
        const file = imageInput.files[0];
        if (file) {
            imagePreview.style.display = "block";
            imagePreview.src = URL.createObjectURL(file);
        } 
    });
});

// Al seleccionar una imagen que se agregue a un container y remplaze el placeholder por la nueva imagen
document.getElementById("profileImgInput").addEventListener("change", function (event) {
  const selectImg = document.querySelector("selectImg");    // lo utilizaremos para mostrar el nombre del archivo seleccionado
  const profileImg = document.getElementById("profileImg");  // lo usamos para mostrar la vista previa de la imagen

  if (event.target.files.length > 0) {
    const selectedImage = event.target.files[0];    
    const imageURL = URL.createObjectURL(selectedImage); // Crear una URL única que apunta a la imagen seleccionada y almacenarla en la variable imageURL

    // Establecer el tamaño máximo de la imagen en la vista previa
    profileImg.style.maxWidth = "150px";
    profileImg.style.maxHeight = "200px";
    
    profileImg.src = imageURL;
    selectImg.innerText = selectedImage.name;
  } else {
    profileImg.src = "img/img_perfil.png";
    
  }
});
