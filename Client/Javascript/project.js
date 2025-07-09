document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("project-grid");
  const projects = JSON.parse(localStorage.getItem("projects")) || [];

  if (!projects.length) {
    grid.innerHTML = `<p style="text-align:center">No projects found.</p>`;
    return;
  }

  projects.forEach((project, index) => {
    const projectId = project.id;
    const images = project.gallery || [];

    const swiperSlides = images
      .map(
        (img) =>
          `<div class="swiper-slide"><img src="${img}" alt="Project Image"></div>`
      )
      .join("");

    const projectItem = document.createElement("div");
    projectItem.classList.add("project-item");
    projectItem.innerHTML = `
      <div class="swiper project-carousel" id="project-carousel-${index}">
        <div class="swiper-wrapper">${swiperSlides}</div>
        <div class="swiper-button-next" id="next-${index}">❯</div>
        <div class="swiper-button-prev" id="prev-${index}">❮</div>
      </div>
      <div class="project-info">
        <h3>${project.title}</h3>
        <p>${project.description.slice(0, 100)}...</p>
        <a href="projectDetail.html?id=${projectId}" class="btn">View Details</a>
      </div>
    `;

    grid.appendChild(projectItem);
    initSimpleCarousel(
      `project-carousel-${index}`,
      `next-${index}`,
      `prev-${index}`
    );
  });
});

// ✅ Minimal JS Carousel Logic (no external Swiper)
function initSimpleCarousel(wrapperId, nextBtnId, prevBtnId) {
  const wrapper = document.querySelector(`#${wrapperId} .swiper-wrapper`);
  const slides = wrapper.querySelectorAll(".swiper-slide");
  const nextBtn = document.getElementById(nextBtnId);
  const prevBtn = document.getElementById(prevBtnId);

  let index = 0;
  const total = slides.length;

  function update() {
    wrapper.style.transform = `translateX(-${index * 100}%)`;
  }

  nextBtn.addEventListener("click", () => {
    index = (index + 1) % total;
    update();
  });

  prevBtn.addEventListener("click", () => {
    index = (index - 1 + total) % total;
    update();
  });

  setInterval(() => {
    index = (index + 1) % total;
    update();
  }, 5000);
}
