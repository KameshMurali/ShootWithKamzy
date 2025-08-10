// Simple carousel logic
const slidesContainer = document.querySelector('.slides');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let currentIndex = 0;

function showSlide(index) {
  // ensure the index wraps around
  currentIndex = (index + slides.length) % slides.length;
  const offset = -currentIndex * 100;
  slidesContainer.style.transform = `translateX(${offset}%)`;
}

// Button event listeners
prevBtn.addEventListener('click', () => {
  showSlide(currentIndex - 1);
});

nextBtn.addEventListener('click', () => {
  showSlide(currentIndex + 1);
});

// Automatically cycle through slides every 5 seconds
setInterval(() => {
  showSlide(currentIndex + 1);
}, 5000);