document.addEventListener('DOMContentLoaded', () => {
    // Check if there's saved data in local storage
    const savedData = JSON.parse(localStorage.getItem('contactFormData'));

    // If data exists, populate the form fields
    if (savedData) {
        document.getElementById('name').value = savedData.name || '';
        document.getElementById('email').value = savedData.email || '';
        document.getElementById('message').value = savedData.message || '';
    }

    document.getElementById('contact-form').addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the default form submission

        // Capture form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Create an object to store the data
        const formData = {
            name: name,
            email: email,
            message: message
        };

        // Update or create new entry in local storage
        localStorage.setItem('contactFormData', JSON.stringify(formData));

        // Notify the user
        alert('Thank you for your message! Your details have been saved.');

        // Reset the form
        document.getElementById('contact-form').reset();
    });
});
