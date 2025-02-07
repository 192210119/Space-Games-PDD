document.addEventListener('DOMContentLoaded', () => {
    // Add interactive hover effects to the Let's Go button
    const button = document.querySelector('.lets-go-btn');
    
    button.addEventListener('mouseover', () => {
        const rocket = document.querySelector('.rocket');
        rocket.style.animation = 'hover 0.5s ease-in-out infinite';
    });
    
    button.addEventListener('mouseout', () => {
        const rocket = document.querySelector('.rocket');
        rocket.style.animation = 'hover 2s ease-in-out infinite';
    });
    
    // Add click animation and transition effect
    button.addEventListener('click', () => {
        // Add transition effect here when you're ready to link to the game page
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);
    });
    
    // Create dynamic stars in the background
    function createStars() {
        const spaceBackground = document.querySelector('.space-background');
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 2}s`;
            spaceBackground.appendChild(star);
        }
    }
    
    createStars();
});
