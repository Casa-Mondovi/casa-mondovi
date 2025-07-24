// DOM Elements
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
const galleryItems = document.querySelectorAll('.gallery-item');

// Global variables
let currentImageIndex = 0;
let allImages = [];
let isLightboxOpen = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollAnimations();
    initializeLightbox();
    initializeSmoothScrolling();
    initializeParallaxEffect();
    initializeGalleryNavigation();
});

// Navigation functionality
function initializeNavigation() {
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation to gallery items
                if (entry.target.classList.contains('gallery-section')) {
                    const items = entry.target.querySelectorAll('.gallery-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe gallery sections
    document.querySelectorAll('.gallery-section').forEach(section => {
        observer.observe(section);
    });

    // Initialize gallery items with opacity 0
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
}

// Lightbox functionality
function initializeLightbox() {
    // Collect all images for lightbox
    galleryItems.forEach((item, index) => {
        const imgSrc = item.getAttribute('data-image');
        if (imgSrc) {
            allImages.push(imgSrc);
        }
        
        item.addEventListener('click', function() {
            openLightbox(imgSrc);
            currentImageIndex = allImages.indexOf(imgSrc);
        });
    });

    // Close lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Navigation in lightbox
    lightboxPrev.addEventListener('click', showPreviousImage);
    lightboxNext.addEventListener('click', showNextImage);

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!isLightboxOpen) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPreviousImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    });
}

function openLightbox(imgSrc) {
    lightboxImg.src = imgSrc;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    isLightboxOpen = true;
    
    // Fade in animation
    setTimeout(() => {
        lightbox.style.opacity = '1';
    }, 10);
}

function closeLightbox() {
    lightbox.style.opacity = '0';
    setTimeout(() => {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
        isLightboxOpen = false;
    }, 300);
}

function showPreviousImage() {
    currentImageIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
    lightboxImg.src = allImages[currentImageIndex];
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % allImages.length;
    lightboxImg.src = allImages[currentImageIndex];
}



// Smooth scrolling
function initializeSmoothScrolling() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Parallax effect for hero section
function initializeParallaxEffect() {
    const heroBackground = document.querySelector('.hero-background');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Progressive image loading
function initializeProgressiveLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
window.addEventListener('scroll', debounce(function() {
    // Scroll-based animations and effects
}, 10));

// Touch support for mobile
function initializeTouchSupport() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    lightbox.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    lightbox.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next image
                showNextImage();
            } else {
                // Swipe right - previous image
                showPreviousImage();
            }
        }
    }
}

// Initialize touch support
initializeTouchSupport();

// Preload critical images
function preloadCriticalImages() {
    const criticalImages = [
        'assets/photos/living_room/IMG_0664.jpeg',
        'assets/photos/bedroom/IMG_0636.jpeg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Call preload function
preloadCriticalImages();

// Add loading states
function addLoadingStates() {
    const ctaButton = document.querySelector('.cta-button');
    
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add loading state
            const originalText = this.textContent;
            this.innerHTML = '<span class="loading"></span> Loading...';
            this.disabled = true;
            
            // Simulate loading (remove in production)
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
                
                // Scroll to gallery
                const gallery = document.querySelector('#gallery');
                if (gallery) {
                    gallery.scrollIntoView({ behavior: 'smooth' });
                }
            }, 1000);
        });
    }
}

// Initialize loading states
addLoadingStates();

// Error handling for images
function handleImageErrors() {
    document.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            e.target.style.display = 'none';
            console.warn('Failed to load image:', e.target.src);
        }
    }, true);
}

// Initialize error handling
handleImageErrors();

// Accessibility improvements
function improveAccessibility() {
    // Add ARIA labels
    lightboxClose.setAttribute('aria-label', 'Close lightbox');
    lightboxPrev.setAttribute('aria-label', 'Previous image');
    lightboxNext.setAttribute('aria-label', 'Next image');
    
    // Add keyboard navigation for gallery items
    galleryItems.forEach(item => {
        item.setAttribute('tabindex', '0');
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Initialize accessibility improvements
improveAccessibility();

// Performance monitoring
function monitorPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }, 0);
        });
    }
}

// Gallery Navigation
function initializeGalleryNavigation() {
    const navButtons = document.querySelectorAll('.gallery-nav-btn');
    const mainHouseGallery = document.getElementById('main-house-gallery');
    const dependenceGallery = document.getElementById('dependence-gallery');
    const outdoorGallery = document.getElementById('outdoor-gallery');

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetGallery = this.getAttribute('data-gallery');
            
            // Update active button
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Hide all galleries first
            mainHouseGallery.style.display = 'none';
            dependenceGallery.style.display = 'none';
            outdoorGallery.style.display = 'none';
            
            mainHouseGallery.classList.add('hidden');
            dependenceGallery.classList.add('hidden');
            outdoorGallery.classList.add('hidden');
            
            // Show selected gallery
            if (targetGallery === 'main-house') {
                mainHouseGallery.style.display = 'block';
                setTimeout(() => {
                    mainHouseGallery.classList.remove('hidden');
                }, 10);
            } else if (targetGallery === 'dependence') {
                dependenceGallery.style.display = 'block';
                setTimeout(() => {
                    dependenceGallery.classList.remove('hidden');
                }, 10);
            } else if (targetGallery === 'outdoor') {
                outdoorGallery.style.display = 'block';
                setTimeout(() => {
                    outdoorGallery.classList.remove('hidden');
                }, 10);
            }
            
            // Reinitialize scroll animations for the new gallery
            setTimeout(() => {
                initializeScrollAnimations();
            }, 100);
        });
    });
}

// Initialize performance monitoring
monitorPerformance(); 