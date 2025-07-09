document.addEventListener("DOMContentLoaded", () => {
  const options = {
    strings: [
      "Welcome to Arshcon and Form Limited!",
      "Explore Our Services.",
      "Contact Us for More Info.",
    ],
    typeSpeed: 50,
    backSpeed: 30,
    loop: true,
    smartBackspace: true,
  };

  new Typed("#typed", options);
});

// Lightbox Functionality
function openLightbox(img) {
  document.getElementById("lightbox").style.display = "flex";
  document.getElementById("lightboxImg").src = img.src;
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}

// Scroll Animation Activation
document.addEventListener("DOMContentLoaded", function () {
  const elements = document.querySelectorAll("[data-aos]");
  function handleScroll() {
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        el.classList.add("aos-animate");
      }
    });
  }
  window.addEventListener("scroll", handleScroll);
  handleScroll();
});

const testimonials = document.querySelectorAll(".testimonial-card");
let currentIndex = 0;

function showTestimonial(index) {
  testimonials.forEach((testimonial, i) => {
    testimonial.classList.remove("active");
    if (i === index) {
      testimonial.classList.add("active");
    }
  });
}

document.querySelector(".prev-btn").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
  showTestimonial(currentIndex);
});

document.querySelector(".next-btn").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % testimonials.length;
  showTestimonial(currentIndex);
});

// Auto-play slider every 5 seconds
setInterval(() => {
  currentIndex = (currentIndex + 1) % testimonials.length;
  showTestimonial(currentIndex);
}, 5000);
