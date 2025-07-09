// 🛡️ Redirect if not logged in as admin
if (localStorage.getItem("isAdmin") !== "true") {
  window.location.href = "adminLogin.html";
}

// 🔒 Logout Function
function logout() {
  localStorage.removeItem("isAdmin");
  window.location.href = "adminLogin.html";
}

// 📦 Elements
const bannerInput = document.getElementById("banner");
const galleryInput = document.getElementById("gallery");
const bannerPreview = document.getElementById("bannerPreview");
const galleryPreview = document.getElementById("galleryPreview");
const projectForm = document.getElementById("add-project-form");
const milestoneContainer = document.getElementById("milestones");
const projectList = document.getElementById("project-list");
const successMsg = document.getElementById("success-msg");

// 🧹 Clear previews
function resetPreviews() {
  bannerPreview.innerHTML = "";
  galleryPreview.innerHTML = "";
  milestoneContainer.innerHTML = `
    <div class="milestone-group">
      <input type="text" class="milestone-year" placeholder="Year" />
      <input type="text" class="milestone-event" placeholder="Event" />
    </div>`;
}

// 🔁 Load all projects
function loadProjects() {
  const projects = JSON.parse(localStorage.getItem("projects")) || [];
  projectList.innerHTML = "";

  if (!projects.length) {
    projectList.innerHTML = "<p>No projects yet.</p>";
    return;
  }

  projects.forEach((p) => {
    const div = document.createElement("div");
    div.className = "project-list-item";
    div.innerHTML = `
      <strong>${p.title}</strong> (${p.category}) - ${p.status} <br/>
      <button onclick="editProject(${p.id})">✏️ Edit</button>
      <button onclick="deleteProject(${p.id})">🗑️ Delete</button>
    `;
    projectList.appendChild(div);
  });
}

// ✏️ Edit Mode
window.editProject = function (id) {
  const projects = JSON.parse(localStorage.getItem("projects")) || [];
  const project = projects.find((p) => p.id === id);
  if (!project) return;

  document.getElementById("form-title").textContent = "✏️ Edit Project";
  document.getElementById("editMode").value = "true";
  document.getElementById("editProjectId").value = project.id;

  document.getElementById("title").value = project.title;
  document.getElementById("location").value = project.location;
  document.getElementById("status").value = project.status;
  document.getElementById("completionDate").value = project.completionDate;
  document.getElementById("category").value = project.category;
  document.getElementById("description").value = project.description;

  // Show banner preview with delete
  bannerPreview.innerHTML = `
    <div>
      <img src="${project.banner}" class="image-thumb" />
      <button onclick="removeBanner()">❌</button>
    </div>
  `;

  // Show gallery previews with delete
  galleryPreview.innerHTML = project.gallery
    .map(
      (img, i) => `
      <div class="gallery-thumb">
        <img src="${img}" class="image-thumb" />
        <button onclick="removeGallery(${i})">❌</button>
      </div>
    `
    )
    .join("");

  // Show milestones
  milestoneContainer.innerHTML = "";
  project.milestones.forEach((ms) => {
    const group = document.createElement("div");
    group.className = "milestone-group";
    group.innerHTML = `
      <input type="text" class="milestone-year" value="${ms.year}" placeholder="Year" />
      <input type="text" class="milestone-event" value="${ms.event}" placeholder="Event" />
    `;
    milestoneContainer.appendChild(group);
  });

  // Save temp gallery for deletion
  window.editingGallery = [...project.gallery];
  window.editingBanner = project.banner;
};

// ❌ Delete gallery image (on edit)
window.removeGallery = function (index) {
  window.editingGallery.splice(index, 1);
  const imgElements = document.querySelectorAll(".gallery-thumb");
  imgElements[index].remove();
};

// ❌ Delete banner image (on edit)
window.removeBanner = function () {
  window.editingBanner = "";
  bannerPreview.innerHTML = "";
};

// 🗑️ Delete Project
window.deleteProject = function (id) {
  let projects = JSON.parse(localStorage.getItem("projects")) || [];
  projects = projects.filter((p) => p.id !== id);
  localStorage.setItem("projects", JSON.stringify(projects));
  loadProjects();
  alert("Project deleted.");
};

// ➕ Add Milestone Field
window.addMilestone = function () {
  const group = document.createElement("div");
  group.className = "milestone-group";
  group.innerHTML = `
    <input type="text" class="milestone-year" placeholder="Year" />
    <input type="text" class="milestone-event" placeholder="Event" />
  `;
  milestoneContainer.appendChild(group);
};

// 📸 Preview Banner
bannerInput.addEventListener("change", () => {
  bannerPreview.innerHTML = "";
  const file = bannerInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const img = document.createElement("img");
      img.src = reader.result;
      img.classList.add("image-thumb");
      bannerPreview.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
});

// 🖼️ Preview Gallery
galleryInput.addEventListener("change", () => {
  galleryPreview.innerHTML = "";
  Array.from(galleryInput.files).forEach((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = document.createElement("img");
      img.src = reader.result;
      img.classList.add("image-thumb");
      galleryPreview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
});

// ✅ Save Project
projectForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const isEdit = document.getElementById("editMode").value === "true";
  const id = isEdit
    ? Number(document.getElementById("editProjectId").value)
    : Date.now();

  const title = document.getElementById("title").value;
  const location = document.getElementById("location").value;
  const status = document.getElementById("status").value;
  const completionDate = document.getElementById("completionDate").value;
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;

  const milestoneInputs = document.querySelectorAll(".milestone-group");
  const milestones = Array.from(milestoneInputs).map((group) => ({
    year: group.querySelector(".milestone-year").value,
    event: group.querySelector(".milestone-event").value,
  }));

  const galleryFiles = Array.from(galleryInput.files);
  const bannerFile = bannerInput.files[0];

  const projects = JSON.parse(localStorage.getItem("projects")) || [];

  const handleSave = (bannerURL, galleryImages) => {
    const projectData = {
      id,
      title,
      location,
      status,
      completionDate,
      category,
      banner: bannerURL,
      gallery: galleryImages,
      description,
      milestones,
      testimonial: { text: "", author: "" },
    };

    if (isEdit) {
      const index = projects.findIndex((p) => p.id === id);
      if (index !== -1) projects[index] = projectData;
    } else {
      projects.push(projectData);
    }

    localStorage.setItem("projects", JSON.stringify(projects));
    successMsg.textContent = isEdit ? "Project updated!" : "Project added!";
    projectForm.reset();
    resetPreviews();
    loadProjects();

    document.getElementById("form-title").textContent = "📤 Upload New Project";
    document.getElementById("editMode").value = "false";
  };

  // 🔄 Handle images
  const processImages = () => {
    const galleryImages = isEdit ? [...(window.editingGallery || [])] : [];
    let loadedCount = 0;

    const handleGallery = (bannerURL) => {
      if (!galleryFiles.length) return handleSave(bannerURL, galleryImages);

      galleryFiles.forEach((file, i) => {
        const readerG = new FileReader();
        readerG.onload = () => {
          galleryImages.push(readerG.result);
          loadedCount++;
          if (loadedCount === galleryFiles.length) {
            handleSave(bannerURL, galleryImages);
          }
        };
        readerG.readAsDataURL(file);
      });
    };

    if (bannerFile) {
      const reader = new FileReader();
      reader.onload = () => handleGallery(reader.result);
      reader.readAsDataURL(bannerFile);
    } else {
      const fallbackBanner = window.editingBanner || "";
      handleGallery(fallbackBanner);
    }
  };

  processImages();
});

// 👤 Admin Info
const adminInfoForm = document.getElementById("admin-info-form");
const adminName = document.getElementById("adminName");
const adminEmail = document.getElementById("adminEmail");
const adminPassword = document.getElementById("adminPassword");

const storedAdmin = JSON.parse(localStorage.getItem("admin")) || {
  name: "Admin",
  email: "admin@example.com",
  password: "123456",
};

adminName.value = storedAdmin.name;
adminEmail.value = storedAdmin.email;
adminPassword.value = storedAdmin.password;

adminInfoForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const adminData = {
    name: adminName.value,
    email: adminEmail.value,
    password: adminPassword.value,
  };
  localStorage.setItem("admin", JSON.stringify(adminData));
  document.getElementById("admin-update-msg").textContent =
    "Admin info updated!";
});

// 🚀 Initial Load
loadProjects();
