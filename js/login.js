document.addEventListener("DOMContentLoaded", function() {
  const form = document.querySelector("form");

  form.addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  

    if (username.trim() === "" || password.trim() === "") {
      alert("Por favor, completa todos los campos.");
    } else {
       localStorage.setItem("username", username);
       localStorage.setItem("isLoggedIn", true);
  

      window.location.href = "index.html"; 
    }
  });
});
  