// Fetching navigation document

fetch("./includes/navigation.html") 
  .then((response) => response.text()) 
  .then((html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const nav = doc.querySelector("nav"); // Get the <nav> element
    if (nav) {
      document.querySelector("#nav-insert").appendChild(nav);
    }
    navToggler(); //Call toggler logic after injection
  })
  .catch((error) => console.error("Error fetching navigation:", error));

fetch("./includes/footer.html")
  .then((response) => response.text())
  .then((html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const footer = doc.querySelector("footer");
    if (footer) {
      document.querySelector("#footer").appendChild(footer);
    }
  })
  .catch((error) => console.error("Error fetching footer:", error));

function navToggler() {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-container");

  menuToggle.addEventListener("click", function () {
    nav.classList.toggle("collapse");
  });
}
