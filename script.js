// --- Configuration ---
const SECRET_CODE = "3599";
const STORAGE_KEY = "sijan_parsha_memories";
const START_DATE = "2023-10-10"; // Set your relationship start date here

// --- Initial Data (Hardcoded Memories) ---
const defaultMemories = [
    {
        title: "The Spider-Verse Duo",
        date: "2026-01-15",
        image: "https://i.imgur.com/BhVBlZR.jpeg", 
        caption: "Wearing our matching Spidey hoodies. You are my Mary Jane. ❤️"
    },
     {
    title: "Fields of Gold",
    // Make sure to set the REAL date of this photo
    date: "2025-12-26", 
    // Use the direct link where you uploaded this image
    image: "https://i.imgur.com/UrldJzJ.jpeg", 
    caption: "Surrounded by a million flowers, but you are still the brightest thing here. A perfect winter day."
},
     {
        title: "The Way You Look at Me",
        // IMPORTANT: Change this to the REAL date of the photo like "2024-03-10"
        date: "2025-12-05", 
        // Paste your new image URL between the quotes below
        image: "https://i.imgur.com/j2vRbvK.jpeg",
        caption: "Just sitting together, enjoying the evening sun. I love catching you smiling at me like this."
    },
    {
        title: "The Beginning",
        date: "2023-10-10", 
        image: "https://i.imgur.com/6IfpGqg.jpeg",
        caption: "The day our journey officially started."
    }
];

// --- DOM Elements ---
const timeline = document.getElementById('timeline');
const modal = document.getElementById('modal');
const fab = document.getElementById('fab');
const closeModal = document.getElementById('close-modal');
const authBtn = document.getElementById('auth-btn');
const passInput = document.getElementById('pass-input');
const securityStep = document.getElementById('security-step');
const uploadStep = document.getElementById('upload-step');
const memoryForm = document.getElementById('memory-form');
const errorMsg = document.getElementById('error-msg');
const daysCounter = document.getElementById('days-counter');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    loadMemories();
    setupIntersectionObserver();
    startLiveTimer();
});

// --- Feature 1: Live Relationship Timer ---
function startLiveTimer() {
    const start = new Date(START_DATE).getTime();

    setInterval(() => {
        const now = new Date().getTime();
        const difference = now - start;

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        daysCounter.innerHTML = `Together for ${days} Days, ${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
}

// --- Feature 2: Memory Management ---
function loadMemories() {
    const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const allMemories = [...defaultMemories, ...storedData];
    // Sort Newest First
    allMemories.sort((a, b) => new Date(b.date) - new Date(a.date));
    renderTimeline(allMemories);
}

function renderTimeline(memories) {
    timeline.innerHTML = ''; 
    
    memories.forEach((mem, index) => {
        const side = index % 2 === 0 ? 'left' : 'right';
        
        const html = `
            <div class="memory-container ${side}">
                <div class="content-card">
                    <img src="${mem.image}" alt="${mem.title}" loading="lazy">
                    <span class="date-tag">${formatDate(mem.date)}</span>
                    <h2>${mem.title}</h2>
                    <p>${mem.caption}</p>
                </div>
            </div>
        `;
        timeline.insertAdjacentHTML('beforeend', html);
    });
    
    setupIntersectionObserver();
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// --- Feature 3: Popup System Logic ---

// Open Popup
fab.addEventListener('click', () => {
    passInput.value = '';
    errorMsg.classList.add('hidden');
    securityStep.classList.remove('hidden');
    uploadStep.classList.add('hidden');
    
    // Smooth Open
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
});

// Close Popup
function closePopup() {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

closeModal.addEventListener('click', closePopup);
window.addEventListener('click', (e) => {
    if (e.target === modal) closePopup();
});

// Password Check
authBtn.addEventListener('click', () => {
    if (passInput.value === SECRET_CODE) {
        securityStep.classList.add('hidden');
        uploadStep.classList.remove('hidden');
    } else {
        errorMsg.classList.remove('hidden');
        passInput.style.borderColor = 'var(--accent-red)';
        setTimeout(() => passInput.style.borderColor = '#333', 1000);
    }
});

// Handle Form Submit
memoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newMemory = {
        image: document.getElementById('img-url').value,
        date: document.getElementById('mem-date').value,
        title: document.getElementById('mem-title').value,
        caption: document.getElementById('mem-caption').value
    };
    
    const currentData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    currentData.push(newMemory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
    
    loadMemories();
    closePopup();
    memoryForm.reset();
});

// --- Feature 4: Scroll Animations ---
function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.memory-container').forEach(el => observer.observe(el));

}


