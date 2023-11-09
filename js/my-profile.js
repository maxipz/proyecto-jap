//Carga el email del localstorage y lo agrega al input Email
const email = localStorage.getItem("username")
const emailInput = document.getElementById('email')
emailInput.value = email

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
          alert.classList.add('d-none');    // Despues de 3 segundos le agrega el d-none para ocultar el alert
        }, 3000);
    } else {
        form.classList.add('was-validated'); // Marcar los campos inválidos en el formulario
    }
});

//////////////////////////////////////////////
///////////// IMAGEN DE PERFIL////////////////
//////////////////////////////////////////////

const profileImg = document.getElementById("profileImg");
const storedImage = localStorage.getItem('profileDataImg');

if (storedImage) {  //Si hay una imagen en localstorage muestra esa, si no muestra el placeholder
  profileImg.src = storedImage;
} else {
  profileImg.src = "img/img_perfil.png";
}

document.getElementById("profileImgInput").addEventListener("change", function(event) {
  const selectedImage = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function(event) { //convierte la imagen en bits
    const imageInBits = event.target.result;
    localStorage.setItem('profileDataImg', imageInBits);
    profileImg.src = imageInBits;
  };

  if (selectedImage) {
    reader.readAsDataURL(selectedImage);
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

    
