
// --- OBSŁUGA FORMULARZA KONTAKTOWEGO ---
const contactForm = document.querySelector('.contact-form');
const submitBtn = contactForm.querySelector('button[type="submit"]');
const successOverlay = document.getElementById('successOverlay');
const mainSidebar = document.getElementById('mainSidebar'); // Pobieramy główny sidebar, żeby go zwinąć

// TUTAJ WKLEJ LINK ZE SWOJEGO GOOGLE APPS SCRIPT:
const GAS_URL = 'https://script.google.com/macros/s/AKfycbxuknkCYfFr1euwu1sdW-BIDeDLPmGAD6sM2b6eQZOYUOO6VMYgtLhDn4BgujhoPfZS/exec';

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    // Zabezpieczenie przycisku i stan ładowania
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = '_wysyłanie...';
    submitBtn.style.pointerEvents = 'none';
    submitBtn.style.opacity = '0.7';

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value,
        privacy: document.getElementById('privacy').checked
    };

    try {
        const response = await fetch(GAS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8', 
            },
            body: JSON.stringify(formData)
        });

        // SUKCES
        successOverlay.classList.add('active'); // Wyświetlamy okrąg i podziękowanie
        contactForm.reset(); // Czyścimy pola w tle

        // Czekamy 3 sekundy i...
        setTimeout(() => {
            // Zwijamy sidebar, odsłaniając wizytówkę!
            mainSidebar.classList.add('collapsed');
            
            // Dajemy czas (0.6s) na płynne zsunięcie się formularza,
            // po czym w tle resetujemy overlay, żeby po ewentualnym ponownym 
            // kliknięciu w strzałkę przez użytkownika, formularz znów był czysty i gotowy.
            setTimeout(() => {
                successOverlay.classList.remove('active');
                submitBtn.innerText = originalBtnText;
                submitBtn.style.pointerEvents = 'auto';
                submitBtn.style.opacity = '1';
            }, 600); 

        }, 3000);

    } catch (error) {
        console.error('Błąd wysyłania:', error);
        submitBtn.innerText = '_błąd_spróbuj_ponownie';
        submitBtn.style.borderColor = 'red';
        
        setTimeout(() => {
            submitBtn.innerText = originalBtnText;
            submitBtn.style.pointerEvents = 'auto';
            submitBtn.style.opacity = '1';
            submitBtn.style.borderColor = 'var(--accent-bordeaux)';
        }, 3000);
    }
});