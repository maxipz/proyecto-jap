// Obtener el formulario por su ID
const form = document.getElementById('profile');

// Evento de click en el botón "Guardar Perfil"
document.getElementById('saveProfile').addEventListener('click', (e) => {
    e.preventDefault();

    // Comprobar si el formulario es válido
    if (form.checkValidity()) {
        const formData = {}; // Objeto para almacenar los datos del formulario

        // Recorre los elementos del formulario y guarda los valores en formData
        for (const element of form.elements) {
            if (element.name) { // Verifica si el elemento tiene un nombre (para evitar elementos sin nombre)
                formData[element.name] = element.value;
            }
        }

        // Guardar los datos en localStorage como cadena JSON bajo la clave "profileData"
        localStorage.setItem('profileData', JSON.stringify(formData));

        const alert = document.getElementById('successAlert');
        alert.classList.remove('d-none');
        setTimeout(function() {
          alert.classList.add('d-none');
        }, 3000);
    } else {
        form.classList.add('was-validated'); // Marcar los campos inválidos en el formulario
    }
});

// Función para manejar el cambio de la imagen
function changeImg () {
  const imageInput = document.getElementById("profileImg");
  const imagePreview = document.getElementById("image-preview");

  imageInput.addEventListener("change", () => {
      const file = imageInput.files[0];
      if (file) {
          imagePreview.style.display = "block";
          imagePreview.src = URL.createObjectURL(file);
      } 
  });
}

changeImg();

// Al seleccionar una imagen, agregarla al container y reemplazar el placeholder por la nueva imagen
document.getElementById("profileImgInput").addEventListener("change", function (event) {
  const profileImg = document.getElementById("profileImg"); // Usado para mostrar la vista previa de la imagen

  if (event.target.files.length > 0) {
    const selectedImage = event.target.files[0];    
    const imageURL = URL.createObjectURL(selectedImage); // Crear una URL única que apunta a la imagen seleccionada y almacenarla en la variable imageURL
    
    // Guardar la URL de la imagen en localStorage bajo la clave "profileDataImg"
    localStorage.setItem('profileDataImg', imageURL);

    // Establecer el tamaño máximo de la imagen en la vista previa
    profileImg.style.maxWidth = "150px";
    profileImg.style.maxHeight = "200px";
    profileImg.src = imageURL;

  } else {
    profileImg.src = "img/img_perfil.png";
  }
});

// Función para cargar los datos del formulario
function profileData() {
  // Recuperar datos almacenados en localStorage bajo la clave "profileData"
  const storedData = localStorage.getItem('profileData');
  if (storedData) {
      const parsedData = JSON.parse(storedData);

      // Llenar los campos del formulario con los datos recuperados
      for (const element of form.elements) {
          if (element.name && parsedData[element.name]) {
              element.value = parsedData[element.name];
          }
      }
  }
}

profileData();

// Función para cargar la imagen del almacenamiento local
function loadProfileImage() {
  const profileImg = document.getElementById("profileImg");
  const storedImage = localStorage.getItem('profileDataImg');
  
  if (storedImage) {
      profileImg.style.maxWidth = "150px";
      profileImg.style.maxHeight = "200px";
      profileImg.src = storedImage;
  }
}

loadProfileImage();

    
   
