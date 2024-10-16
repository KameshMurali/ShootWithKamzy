// Function to save form data to local storage
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('contact-form');

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Get form values
        const name = document.querySelector('input[name="name"]').value; 
        const email = document.querySelector('input[name="email"]').value; 
        const contactNumber = document.querySelector('input[name="contactNumber"]').value;
        const message = document.querySelector('textarea[name="message"]').value; 

        // Create a new entry
        const entry = { name, email, contactNumber,message };

        // Get existing data from local storage
        const existingEntries = JSON.parse(localStorage.getItem('formEntries')) || [];

        // Add the new entry to existing data
        existingEntries.push(entry);

        // Save updated data back to local storage
        localStorage.setItem('formEntries', JSON.stringify(existingEntries));

        // Reset form fields
        contactForm.reset();

        // Optional: Display success message
        alert('Your message has been saved!');
    });
});

 // Disable right-click context menu
        document.addEventListener('contextmenu', function (event) {
            event.preventDefault();
        });
function openLightbox(image) {
            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightbox-img');
            lightboxImg.src = image.src;
            lightbox.style.display = 'flex';
        }
function closeLightbox() {
            const lightbox = document.getElementById('lightbox');
            lightbox.style.display = 'none';
        }
document.addEventListener('DOMContentLoaded', function () {
            // Prevent default behavior on long press for images
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                img.addEventListener('touchstart', function (event) {
                    event.preventDefault(); // Prevent long press context menu
                });
            });
        });
