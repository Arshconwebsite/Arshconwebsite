document
  .getElementById("contactForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    let form = event.target;
    let formData = new FormData(form);

    let response = await fetch(form.action, {
      method: form.method,
      body: formData,
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      document.getElementById("statusMessage").style.display = "block";
      form.reset();
    } else {
      alert("Something went wrong. Please try again.");
    }
  });
