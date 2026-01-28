const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (
      !entry.isIntersecting &&
      !entry.target.classList.contains("standby") &&
      entry.target.classList.contains("hidden-article")
    ) {
      console.log(entry.target);
      entry.target.classList.add("standby");
      entry.target.classList.remove("view");
    } else if (
      entry.isIntersecting &&
      !entry.target.classList.contains("view") &&
      !entry.target.classList.contains("standby") &&
      entry.target.classList.contains("hidden-article")
    ) {
      console.log(entry.target);
      entry.target.classList.add("standby");
      setTimeout(() => {
        entry.target.classList.remove("standby");
        entry.target.classList.add("view");
      }, 250);
    } else if (
      !entry.isIntersecting &&
      entry.target.classList.contains("view") &&
      entry.target.classList.contains("hidden-article")
    ) {
      console.log(entry.target);
      entry.target.classList.remove("view");
      entry.target.classList.add("standby");
    } else if (
      entry.isIntersecting &&
      entry.target.classList.contains("standby") &&
      entry.target.classList.contains("hidden-article")
    ) {
      console.log(entry.target);
      entry.target.classList.remove("standby");
      entry.target.classList.add("view");
    } else {
      //do nothing
    }
    if (
      !entry.isIntersecting &&
      !entry.target.classList.contains("standby") &&
      entry.target.classList.contains("hidden-list")
    ) {
      console.log(entry.target);
      entry.target.classList.add("standby");
      entry.target.classList.remove("view");
    } else if (
      entry.isIntersecting &&
      !entry.target.classList.contains("view") &&
      !entry.target.classList.contains("standby") &&
      entry.target.classList.contains("hidden-list")
    ) {
      console.log(entry.target);
      entry.target.classList.add("standby");
      setTimeout(() => {
        entry.target.classList.remove("standby");
        entry.target.classList.add("view");
      }, 250);
    } else if (
      !entry.isIntersecting &&
      entry.target.classList.contains("view") &&
      entry.target.classList.contains("hidden-list")
    ) {
      console.log(entry.target);
      entry.target.classList.remove("view");
      entry.target.classList.add("standby");
    } else if (
      entry.isIntersecting &&
      entry.target.classList.contains("standby") &&
      entry.target.classList.contains("hidden-list")
    ) {
      console.log(entry.target);
      entry.target.classList.remove("standby");
      entry.target.classList.add("view");
    } else {
      //do nothing
    }
  });
}, {});
const hiddenarticleElements = document.querySelectorAll(".hidden-article");
hiddenarticleElements.forEach((el) => observer.observe(el));

const hiddenlisteElements = document.querySelectorAll(".hidden-list");
hiddenlisteElements.forEach((el) => observer.observe(el));

const form = document.getElementById("form");
const submitButton = document.getElementById("submit-button");
const fileInput = document.getElementById("fileInput");
const fileNameDisplay = document.getElementById("fileNameDisplay");

// Update displayed filename on file selection
fileInput.addEventListener("change", function () {
  if (this.files && this.files.length > 0) {
    fileNameDisplay.textContent = this.files[0].name;
  } else {
    fileNameDisplay.textContent = "No file selected";
  }
});

// Function to handle file upload
async function uploadFile(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = (e) => {
      const data = e.target.result.split(",");
      const obj = {
        fileName: file.name,
        mimeType: data[0].match(/:(\w.+);/)[1],
        data: data[1],
      };
      resolve(obj);
    };
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  submitButton.textContent = "Submitting...";
  submitButton.style.display = "block";
  submitButton.style.backgroundColor = "beige";
  submitButton.style.borderColor = "rgb(193, 193, 154)";
  submitButton.style.color = "black";
  submitButton.disabled = true;
  submitButton.classList.add("is-loading");

  try {
    const formData = new FormData(this);
    const formDataObj = {};

    // Convert FormData to object
    for (let [key, value] of formData.entries()) {
      formDataObj[key] = value;
    }

    // Handle file upload if a file is selected
    if (fileInput.files.length > 0) {
      const fileObj = await uploadFile(fileInput.files[0]);
      formDataObj.fileData = fileObj; // Add file data to form data
    }

    // Submit form data
    const scriptURL =
      "https://script.google.com/macros/s/AKfycbyjhAuJga8TdoWUApHtjgNarg9hGq9MyRMOM7gHCV4IbdvdA2d_BFU0CjS-fxuJ7sLQzQ/exec";

    const response = await fetch(scriptURL, {
      redirect: "follow",
      method: "POST",
      body: JSON.stringify(formDataObj),
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
    });

    const data = await response.json();

    if (data.status === "success") {
      submitButton.textContent = data.message || "Data submitted successfully!";
      submitButton.style.borderWidth = "0.2rem";
      submitButton.style.fontWeight = "800";
      submitButton.style.backgroundColor = "#18721d";
      submitButton.style.borderColor = "#0f5214";
      submitButton.style.color = "white";
      form.reset();
      fileNameDisplay.textContent = "No file selected";
    } else {
      throw new Error(data.message || "Submission failed");
    }
  } catch (error) {
    console.error("Error:", error);
    submitButton.textContent = "Error: " + error.message;
    submitButton.style.fontWeight = "800";
    submitButton.style.backgroundColor = "#f14668";
    submitButton.style.color = "white";
  } finally {
    submitButton.disabled = false;
    submitButton.classList.remove("is-loading");

    setTimeout(() => {
      submitButton.textContent = "Submit Answer Sheet";
      submitButton.style.display = "block";
      submitButton.style.fontWeight = "400";
      submitButton.style.backgroundColor = "#f0f0f0";
      submitButton.style.borderColor = "#dbdbdb";
      submitButton.style.color = "black";
    }, 4000);
  }
});

// Enhance cancel button to reset file input display
const cancelButton = form.querySelector("button.is-danger");
cancelButton.addEventListener("click", function () {
  form.reset();
  fileNameDisplay.textContent = "No file selected";
  messageDiv.style.display = "none";
});
