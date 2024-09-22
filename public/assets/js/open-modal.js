// Get the modal
const modal = document.getElementById("myModal");

// Get the button that opens the modal
const openModalBtn = document.querySelector(".open-modal-btn"); // Assuming you have a button with this class to open the modal

// Get the <span> element that closes the modal
const closeBtn = document.querySelector(".close");

// Open the modal
openModalBtn.addEventListener("click", () => {
  modal.style.display = "block";
  document.body.style.overflow = "hidden"; // Disable scrolling on the body
});

// Close the modal when the user clicks on <span> (x)
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
  document.body.style.overflow = "auto"; // Re-enable scrolling on the body
});

// Close the modal when the user clicks anywhere outside of the modal
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // Re-enable scrolling on the body
  }
});

// Form submission handling
document.getElementById("contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  // Implement form submission logic here
  alert("Form submitted!");
  modal.style.display = "none";
  document.body.style.overflow = "auto"; // Re-enable scrolling on the body
});
