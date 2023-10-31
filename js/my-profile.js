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