document.addEventListener('DOMContentLoaded', () => {
    // Add interactive hover effects to the Let's Go button
    const button = document.querySelector('.cta-button');
    
    if (button) {
        button.addEventListener('mouseover', () => {
            const rocket = document.querySelector('.rocket');
            if (rocket) {
                rocket.style.animation = 'hover 0.5s ease-in-out infinite';
            }
        });
        
        button.addEventListener('mouseout', () => {
            const rocket = document.querySelector('.rocket');
            if (rocket) {
                rocket.style.animation = 'hover 2s ease-in-out infinite';
            }
        });
        
        // Add click handler for navigation with rocket animation
        button.addEventListener('click', function() {
            const rocket = document.querySelector('.rocket');
            const rocketImage = document.querySelector('.rocket-image');
            const content = document.querySelector('.content');
            
            if (rocket && rocketImage && content) {
                // Add takeoff animations
                rocket.classList.add('takeoff');
                rocketImage.classList.add('takeoff');
                content.classList.add('fade-out');
                
                // Navigate to journey page after animation
                setTimeout(() => {
                    window.location.href = 'journey.html';
                }, 2000); // Match the animation duration
            }
        });
    }
    
    // Create dynamic stars in the background
    function createStars() {
        const spaceBackground = document.querySelector('.space-background');
        if (spaceBackground) {
            for (let i = 0; i < 50; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.left = `${Math.random() * 100}%`;
                star.style.top = `${Math.random() * 100}%`;
                star.style.animationDelay = `${Math.random() * 2}s`;
                spaceBackground.appendChild(star);
            }
        }
    }
    
    createStars();
});
