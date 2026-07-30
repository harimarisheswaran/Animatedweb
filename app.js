/**
 * AURELIA - LUXURY RESTAURANT CANVAS SCROLL ANIMATION & INTERACTIVE LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------------------------------
    // 1. CANVAS FRAME-BY-FRAME SCROLL ANIMATION
    // ------------------------------------------------------------------
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');
    const heroScrollContainer = document.getElementById('hero-scroll-container');

    const totalFrames = 272;
    const images = [];
    let imagesLoaded = 0;
    
    // Smooth scrolling current frame interpolation state
    let targetFrameIndex = 0;
    let currentFrameIndex = 0;

    // Helper to construct frame path
    const getFramePath = (index) => {
        const frameNum = String(index + 1).padStart(3, '0');
        return `ezgif-530af9c690139c29-jpg/ezgif-frame-${frameNum}.jpg`;
    };

    // Responsive Canvas Resize logic
    function setCanvasDimensions() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        renderFrame(Math.round(currentFrameIndex));
    }

    // Draw frame on Canvas maintaining cover aspect ratio (Cropping bottom watermark)
    function renderFrame(index) {
        const img = images[index];
        if (!img || !img.complete) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Crop bottom 20% and right 12% to completely eliminate the ezgif star watermark in bottom right
        const srcX = 0;
        const srcY = 0;
        const srcW = img.width * 0.88;
        const srcH = img.height * 0.80;

        const canvasAspect = canvas.width / canvas.height;
        const imgAspect = srcW / srcH;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasAspect > imgAspect) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgAspect;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        } else {
            drawWidth = canvas.height * imgAspect;
            drawHeight = canvas.height;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
        }

        ctx.drawImage(img, srcX, srcY, srcW, srcH, offsetX, offsetY, drawWidth, drawHeight);
    }

    // Preload sequence images
    function preloadFrames() {
        for (let i = 0; i < totalFrames; i++) {
            const img = new Image();
            img.src = getFramePath(i);
            img.onload = () => {
                imagesLoaded++;
                if (i === 0) {
                    // Render first frame immediately as soon as frame 1 arrives
                    renderFrame(0);
                }
            };
            images.push(img);
        }
    }

    // Update target frame index based on scroll position within the container
    function updateFrameOnScroll() {
        const containerRect = heroScrollContainer.getBoundingClientRect();
        const containerHeight = heroScrollContainer.offsetHeight - window.innerHeight;
        
        // Calculate scroll fraction clamped between 0 and 1
        let scrollFraction = -containerRect.top / containerHeight;
        scrollFraction = Math.max(0, Math.min(1, scrollFraction));

        targetFrameIndex = Math.floor(scrollFraction * (totalFrames - 1));
    }

    // Animation Loop for buttery smooth frame-by-frame interpolation
    function animationLoop() {
        // Smoothly interpolate current frame index towards target frame index
        const easeFactor = 0.15;
        currentFrameIndex += (targetFrameIndex - currentFrameIndex) * easeFactor;

        const roundedFrame = Math.round(currentFrameIndex);
        if (images[roundedFrame] && images[roundedFrame].complete) {
            renderFrame(roundedFrame);
        }

        requestAnimationFrame(animationLoop);
    }

    // Initialize Canvas & Preloader
    window.addEventListener('resize', setCanvasDimensions);
    window.addEventListener('scroll', updateFrameOnScroll);
    setCanvasDimensions();
    preloadFrames();
    animationLoop();


    // ------------------------------------------------------------------
    // 2. HEADER STICKY & ACTIVE NAV LINK ON SCROLL
    // ------------------------------------------------------------------
    const header = document.getElementById('main-header');
    const sections = document.querySelectorAll('section, div#hero-scroll-container');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Sticky Header effect
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Nav Link highlighting
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });


    // ------------------------------------------------------------------
    // 3. MOBILE MENU TOGGLE
    // ------------------------------------------------------------------
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu on clicking nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    });


    // ------------------------------------------------------------------
    // 4. SIGNATURE MENU TABS FILTERING
    // ------------------------------------------------------------------
    const menuTabs = document.querySelectorAll('.menu-tab-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    menuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            menuTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const category = tab.getAttribute('data-category');

            menuCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });


    // ------------------------------------------------------------------
    // 5. MASONRY GALLERY LIGHTBOX
    // ------------------------------------------------------------------
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const fullSrc = item.getAttribute('data-src');
            const title = item.getAttribute('data-title');

            lightboxImg.src = fullSrc;
            lightboxCaption.textContent = title;
            lightboxModal.classList.add('active');
        });
    });

    lightboxClose.addEventListener('click', () => {
        lightboxModal.classList.remove('active');
    });

    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            lightboxModal.classList.remove('active');
        }
    });


    // ------------------------------------------------------------------
    // 6. TESTIMONIAL SLIDER
    // ------------------------------------------------------------------
    const track = document.getElementById('testimonial-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('prev-review');
    const nextBtn = document.getElementById('next-review');
    const dotsContainer = document.getElementById('slider-dots');

    let currentSlide = 0;

    // Build Dots dynamically
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function goToSlide(index) {
        currentSlide = index;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(currentSlide);
    });

    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        goToSlide(currentSlide);
    });

    // Auto-advance testimonials every 6 seconds
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        goToSlide(currentSlide);
    }, 6000);


    // ------------------------------------------------------------------
    // 7. RESERVATION FORM SUBMISSION
    // ------------------------------------------------------------------
    const resForm = document.getElementById('res-form');
    resForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('res-name').value;
        const date = document.getElementById('res-date').value;
        const time = document.getElementById('res-time').value;
        const guests = document.getElementById('res-guests').value;

        alert(`Thank you, ${name}! Your table for ${guests} guests on ${date} at ${time} has been reserved. A confirmation email has been sent.`);
        resForm.reset();
    });
});
