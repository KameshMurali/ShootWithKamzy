// Function to save form data to local storage
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('contact-form'); // Assuming there's only one form on the page

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Get form values
        const name = document.querySelector('input[name="name"]').value; // Adjust selector if needed
        const email = document.querySelector('input[name="email"]').value; // Adjust selector if needed
        const message = document.querySelector('textarea[name="message"]').value; // Adjust selector if needed

        // Create a new entry
        const entry = { name, email, message };

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
