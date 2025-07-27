document.addEventListener('DOMContentLoaded', () => {
    // --- Unsplash API Setup ---
    const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY'; // <--- GET YOUR KEY HERE!
    const JUMBOTRON_ELEMENT = document.querySelector('.jumbotron');

    async function setDynamicHeaderBackground() {
        if (JUMBOTRON_ELEMENT) { // Only run if a jumbotron exists on the page (i.e., index.html)
            if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === 'YOUR_UNSPLASH_ACCESS_KEY') {
                console.warn('Unsplash API Key is not set. Using fallback background.');
                return;
            }

            try {
                const collectionId = '325695';
                const response = await fetch(`https://api.unsplash.com/photos/random?client_id=${UNSPLASH_ACCESS_KEY}&query=nature,calm,meditation,peace&orientation=landscape&collections=${collectionId}`);
                const data = await response.json();

                if (data && data.urls && data.urls.regular) {
                    const img = new Image();
                    img.src = data.urls.regular;
                    img.onload = () => {
                        JUMBOTRON_ELEMENT.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${data.urls.regular}')`;
                    };
                } else {
                    console.warn('No image found from Unsplash, or API response was unexpected.');
                }
            } catch (error) {
                console.error('Error fetching Unsplash image:', error);
            }
        }
    }

    setDynamicHeaderBackground(); // Call this when the page loads (it will check if jumbotron exists)

    // --- Quote Generator Logic ---
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteBtn = document.getElementById('newQuoteBtn');

    if (quoteDisplay && newQuoteBtn) { // Only run if these elements exist (i.e., on index.html)
        async function getRandomQuote() {
            try {
                const response = await fetch('https://api.zenquotes.io/v2/random');
                const data = await response.json();

                if (data && data.length > 0) {
                    const quote = data[0].q;
                    const author = data[0].a;
                    quoteDisplay.textContent = `"${quote}" - ${author}`;
                } else {
                    quoteDisplay.textContent = "Couldn't fetch a new quote. Try again!";
                }
            } catch (error) {
                console.error('Error fetching quote:', error);
                quoteDisplay.textContent = "Failed to load quote. Please check your internet connection.";
            }
        }
        getRandomQuote();
        newQuoteBtn.addEventListener('click', getRandomQuote);
    }


    // --- Share Your Moment Form Logic ---
    const shareMomentForm = document.getElementById('shareMomentForm');
    const shareMomentFeedback = document.getElementById('shareMomentFeedback');

    if (shareMomentForm) { // Only run if this form exists on the page (i.e., share.html)
        shareMomentForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const momentTitle = document.getElementById('momentTitle').value;
            const momentDescription = document.getElementById('momentDescription').value;

            if (momentTitle.trim() === '' || momentDescription.trim() === '') {
                shareMomentFeedback.textContent = 'Please fill out both fields before celebrating your moment!';
                shareMomentFeedback.className = 'mt-3 text-center alert alert-danger';
                shareMomentFeedback.classList.remove('d-none');
                return;
            }

            shareMomentFeedback.textContent = `Awesome! You just celebrated "${momentTitle}". Remember this feeling!`;
            shareMomentFeedback.className = 'mt-3 text-center alert alert-success';
            shareMomentFeedback.classList.remove('d-none');

            shareMomentForm.reset();

            setTimeout(() => {
                shareMomentFeedback.classList.add('d-none');
            }, 5000);
        });
    }

    // --- Daily Reflection Quiz Logic ---
    const reflectionQuizForm = document.getElementById('reflectionQuizForm');
    const quizResult = document.getElementById('quizResult');

    if (reflectionQuizForm) { // Only run if this form exists on the page (i.e., reflect.html)
        reflectionQuizForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const q1 = document.getElementById('q1').value;
            const q2 = document.getElementById('q2').value;

            if (q1 === '' || q2 === '') {
                quizResult.textContent = 'Please answer both questions to see your reflection!';
                quizResult.className = 'mt-3 text-center alert alert-danger';
                quizResult.classList.remove('d-none');
                return;
            }

            let message = '';
            let alertClass = 'alert-info';

            if (q1 === 'yes' && q2 === 'yes') {
                message = 'Fantastic! You are truly cultivating your own awesome. Keep up the great work!';
                alertClass = 'alert-success';
            } else if (q1 === 'somewhat' && q2 === 'somewhat') {
                message = 'You\'re on the right track! Small steps lead to big changes. Keep focusing on your unique journey.';
                alertClass = 'alert-warning';
            } else if (q1 === 'yes' || q2 === 'yes') {
                message = 'Great start! Focus on both appreciating simple moments and feeling content with your path.';
                alertClass = 'alert-info';
            } else {
                message = 'It sounds like you might need to refocus on your own moments. Take a deep breath and find joy in your unique journey!';
                alertClass = 'alert-primary';
            }

            quizResult.textContent = message;
            quizResult.className = `mt-3 text-center alert ${alertClass}`;
            quizResult.classList.remove('d-none');

            setTimeout(() => {
                quizResult.classList.add('d-none');
            }, 7000);
        });
    }

    // --- Contact Form (Mailto) Logic ---
    const contactFormMailto = document.getElementById('contactFormMailto');
    const contactFeedback = document.getElementById('contactFeedback');
    // REMEMBER TO REPLACE THIS WITH YOUR OWN EMAIL ADDRESS!
    const YOUR_EMAIL_ADDRESS = 'your-email@example.com'; // <--- Set your email here

    if (contactFormMailto) { // Only run if this form exists on the page (i.e., contact.html)
        contactFormMailto.addEventListener('submit', (event) => {
            event.preventDefault();

            const name = document.getElementById('contactName').value;
            const subject = document.getElementById('contactSubject').value;
            const message = document.getElementById('contactMessage').value;

            if (name.trim() === '' || subject.trim() === '' || message.trim() === '') {
                contactFeedback.textContent = 'Please fill in all fields.';
                contactFeedback.className = 'mt-3 text-center alert alert-danger';
                contactFeedback.classList.remove('d-none');
                return;
            }

            // Encode values for URL to handle spaces and special characters
            const encodedSubject = encodeURIComponent(`Message from Your Moment Website: ${subject}`);
            const encodedBody = encodeURIComponent(`Name: ${name}\n\nMessage:\n${message}`);

            // Construct the mailto link
            const mailtoLink = `mailto:${YOUR_EMAIL_ADDRESS}?subject=${encodedSubject}&body=${encodedBody}`;

            // Open the user's default email client
            window.location.href = mailtoLink;

            contactFeedback.textContent = 'Your email client should open shortly with a pre-filled message.';
            contactFeedback.className = 'mt-3 text-center alert alert-success';
            contactFeedback.classList.remove('d-none');

            contactFormMailto.reset(); // Clear the form

            setTimeout(() => {
                contactFeedback.classList.add('d-none');
            }, 7000);
        });
    }

    // --- Navbar Active Link Logic (applies to all pages) ---
    const currentPath = window.location.pathname.split('/').pop(); // Gets 'index.html', 'activities.html', etc.
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach(link => {
        // Handle empty path for root index.html (if accessing via http://localhost or similar)
        const linkHref = link.getAttribute('href');
        if (currentPath === linkHref || (currentPath === '' && linkHref === 'index.html')) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
});