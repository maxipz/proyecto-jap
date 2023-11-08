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

