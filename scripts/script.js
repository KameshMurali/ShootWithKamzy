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

// Form handling
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    form.reset();
    
    // Phone number validation
    const phoneInput = document.getElementById('contactNumber');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value;
        
        // Allow only '+' at start and numbers
        value = value.replace(/[^\d+]/g, '');
        
        // Ensure '+' is only at the beginning
        if (value.length > 0 && value[0] !== '+') {
            value = '+' + value;
        }
        
        // Remove any additional '+' symbols
        value = '+' + value.replace(/\+/g, '');
        
        // Limit length to 15 digits (including country code)
        if (value.length > 15) {
            value = value.slice(0, 15);
        }
        
        e.target.value = value;
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate phone number format
        const phoneNumber = phoneInput.value;
        const phoneRegex = /^\+[1-9]\d{1,14}$/;
        
        if (!phoneRegex.test(phoneNumber)) {
            alert('Please enter a valid international phone number with country code');
            return;
        }

        try {
            const response = await fetch(this.action, {
                method: 'POST',
                body: new FormData(this),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                this.reset();
                window.history.replaceState({}, document.title, window.location.pathname);
                alert('Thank you for your message!');
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            alert('Sorry, there was an error sending your message. Please try again.');
        }
    });
});

// Clear form on back navigation
window.onpageshow = function(event) {
    if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
        document.getElementById('contactForm').reset();
    }
};