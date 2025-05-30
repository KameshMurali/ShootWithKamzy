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
/*document.addEventListener('DOMContentLoaded', function () {
            // Prevent default behavior on long press for images
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                img.addEventListener('touchstart', function (event) {
                    event.preventDefault(); // Prevent long press context menu
                });
            });
        });*/
//mouse event
addEventListener('mousedown', function(event) {
    // Start a timer for the long press
    pressTimer = setTimeout(() => {
        // Prevent the default action for long press
        event.preventDefault();
        console.log('Long press prevented');
    }, 500); // Adjust the time as needed
});

element.addEventListener('mouseup', function(event) {
    // Clear the timer if mouse is released before long press
    clearTimeout(pressTimer);
    console.log('Single click action');
});

element.addEventListener('mouseleave', function() {
    // Clear the timer if mouse leaves the element
    clearTimeout(pressTimer);
});
//touch event
// Touch events
element.addEventListener('touchstart', startPressTimer);
element.addEventListener('touchend', () => {
    clearPressTimer();
    console.log('Single click action');
});
element.addEventListener('touchmove', clearPressTimer); // Clear on touch move to avoid unintended actions
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });

  // Prevent long-press on mobile
  document.addEventListener('touchstart', function(e) {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });

  let pressTimer;
  document.addEventListener('touchstart', function(e) {
    pressTimer = setTimeout(() => e.preventDefault(), 500);
  });
  document.addEventListener('touchend', function(e) {
    clearTimeout(pressTimer);
  });
</script>

