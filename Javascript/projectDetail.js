document.addEventListener("DOMContentLoaded", async () => {
  try {
    const projectId = getProjectId();
    if (!projectId) return;

    const project = await fetchProjectData(projectId);
    if (!project) return;

    populateProjectDetails(project);
    initializeCarousel();
  } catch (error) {
    console.error("Error:", error);
  }
});

// ✅ Get project ID from URL
function getProjectId() {
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get("id");
  if (!projectId) console.error("No project ID found in URL");
  return projectId;
}

// ✅ Fetch project data from JSON
async function fetchProjectData(projectId) {
  try {
    // Check localStorage first
    const localProjects = JSON.parse(localStorage.getItem("projects"));
    if (localProjects && localProjects.length) {
      const project = localProjects.find((p) => p.id == projectId);
      if (project) return project;
    }

    // Otherwise fetch from JSON
    const response = await fetch("../data/projects.json");
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const projects = await response.json();
    const project = projects.find((p) => p.id == projectId);

    if (!project) {
      console.error("Project not found");
      return null;
    }

    return project;
  } catch (error) {
    console.error("Error loading project data:", error);
    return null;
  }
}


// ✅ Populate UI with project details
function populateProjectDetails(project) {
  document.querySelector(".project-hero img").src = project.banner || "";
  document.querySelector(".hero-overlay h1").textContent =
    project.title || "Untitled";
  document.querySelector(".hero-overlay p").textContent =
    project.category || "Unknown Category";

  // Populate metadata
  document.querySelector(".project-meta").innerHTML = `
    <div><strong>📍 Location:</strong> ${project.location || "N/A"}</div>
    <div><strong>📅 Completion Date:</strong> ${
      project.completionDate || "N/A"
    }</div>
    <div><strong>🔨 Status:</strong> ${project.status || "N/A"}</div>
    <div><strong>🏗️ Category:</strong> ${project.category || "N/A"}</div>
  `;

  // Populate description
  document.querySelector("#project-description").textContent =
    project.description || "No description available.";

  // Populate milestones
  const milestonesContainer = document.querySelector(".project-milestones");
  milestonesContainer.innerHTML = ""; // Clear existing
  project.milestones?.forEach((milestone) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${milestone.year}:</strong> ${milestone.event}`;
    milestonesContainer.appendChild(li);
  });

  // Populate image gallery
  const galleryContainer = document.querySelector(".carousel-wrapper");
  galleryContainer.innerHTML = ""; // Clear existing
  project.gallery?.forEach((image) => {
    const div = document.createElement("div");
    div.classList.add("carousel-slide");
    div.innerHTML = `<img src="${image}" alt="Project Image">`;
    galleryContainer.appendChild(div);
  });

  // Populate testimonial
  document.querySelector(".testimonial p").textContent =
    project.testimonial?.text || "No testimonial available.";
  document.querySelector(".testimonial strong").textContent =
    project.testimonial?.author || "";
}

// ✅ Initialize image carousel
function initializeCarousel() {
  const wrapper = document.querySelector(".carousel-wrapper");
  const slides = document.querySelectorAll(".carousel-slide");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  if (!wrapper || slides.length === 0) {
    console.error("Carousel not found or empty");
    return;
  }

  let currentIndex = 0;
  const totalSlides = slides.length;

  function updateCarousel() {
    wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  nextBtn?.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
  });

  prevBtn?.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
  });

  // Auto-play every 3 seconds
  setInterval(() => {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
  }, 3000);
}
