class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        
        // Load rocket image
        this.rocketImg = new Image();
        this.rocketImg.src = 'assets/rocket.png';
        this.gameLoopRunning = false;
        this.isPaused = false;
        
        this.player = {
            x: this.canvas.width / 2,
            y: this.canvas.height - 60,
            width: 50,
            height: 60,
            speed: 6,
            thrust: false,
            velocityX: 0,
            velocityY: 0
        };
        
        // Level goals and settings with increasing difficulty
        this.levelGoals = {
            1: { 
                resourcesNeeded: 50,
                timeLimit: 30,
                debrisSpeed: 3,
                debrisRate: 0.3,
                resourceSpeed: 2
            },
            2: { 
                resourcesNeeded: 80,
                timeLimit: 35,
                debrisSpeed: 4,
                debrisRate: 0.4,
                resourceSpeed: 2.5
            },
            3: { 
                resourcesNeeded: 120,
                timeLimit: 40,
                debrisSpeed: 5,
                debrisRate: 0.5,
                resourceSpeed: 3
            },
            4: { 
                resourcesNeeded: 160,
                timeLimit: 45,
                debrisSpeed: 6,
                debrisRate: 0.6,
                resourceSpeed: 3.5
            },
            5: { 
                resourcesNeeded: 200,
                timeLimit: 50,
                debrisSpeed: 7,
                debrisRate: 0.7,
                resourceSpeed: 4
            }
        };
        
        this.resources = [];
        this.debris = [];
        this.score = 0;
        this.health = 100;
        this.level = 1;
        this.gameOver = false;
        this.levelTimeLeft = this.levelGoals[1].timeLimit;
        
        this.keys = {};
        this.setupEventListeners();
        
        // Wait for rocket image to load before starting the game
        this.rocketImg.onload = () => {
            this.startLevel(1);
        };
    }
    
    setupCanvas() {
        this.canvas.width = 800;
        this.canvas.height = 600;
    }
    
    setupEventListeners() {
        // Keyboard controls
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (e.key === 'ArrowUp') this.player.thrust = true;
            if (e.key.toLowerCase() === 'p') this.togglePause();
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
            if (e.key === 'ArrowUp') this.player.thrust = false;
        });

        // Pause button controls
        const pauseButton = document.getElementById('pause-button');
        const resumeButton = document.getElementById('resume-button');
        const pauseHomeButton = document.getElementById('pause-home-button');

        pauseButton.addEventListener('click', () => this.togglePause());
        resumeButton.addEventListener('click', () => this.togglePause());
        pauseHomeButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseScreen = document.querySelector('.pause-screen');

        if (this.isPaused) {
            clearInterval(this.spawnInterval);
            clearInterval(this.timerInterval);
            pauseScreen.classList.remove('hidden');
        } else {
            this.spawnInterval = setInterval(() => this.spawnObjects(), 1000);
            this.startTimer();
            pauseScreen.classList.add('hidden');
        }
    }

    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        this.timerInterval = setInterval(() => {
            if (!this.gameOver && !this.isPaused) {
                this.levelTimeLeft--;
                document.getElementById('level').textContent = this.level;
                document.getElementById('timer').textContent = this.levelTimeLeft;
                if (this.levelTimeLeft <= 0) {
                    this.checkLevelCompletion();
                }
            }
        }, 1000);
    }
    
    startLevel(level) {
        this.level = level;
        this.score = 0;
        this.levelTimeLeft = this.levelGoals[level].timeLimit;
        this.resources = [];
        this.debris = [];
        this.gameOver = false;
        this.gameLoopRunning = true;
        
        // Reset player position and speed
        this.player = {
            x: this.canvas.width / 2,
            y: this.canvas.height - 60,
            width: 50,
            height: 60,
            speed: 6,
            thrust: false,
            velocityX: 0,
            velocityY: 0
        };
        
        // Clear existing intervals
        if (this.spawnInterval) clearInterval(this.spawnInterval);
        if (this.timerInterval) clearInterval(this.timerInterval);
        
        // Start spawning objects
        this.spawnInterval = setInterval(() => this.spawnObjects(), 1000);
        
        // Start level timer
        this.startTimer();
        
        // Update HUD
        document.getElementById('score').textContent = `0/${this.levelGoals[this.level].resourcesNeeded}`;
        document.getElementById('level').textContent = this.level;
        document.getElementById('health').textContent = this.health;
        
        // Start the game loop if not already running
        this.gameLoop();
    }
    
    showVictoryScreen() {
        this.gameOver = true;
        clearInterval(this.spawnInterval);
        clearInterval(this.timerInterval);
        
        const gameOverScreen = document.querySelector('.game-over');
        gameOverScreen.querySelector('h2').textContent = 'Congratulations! You Won!';
        gameOverScreen.querySelector('p').textContent = 'You have completed all 5 levels!';
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('final-level').textContent = '5 (MAX)';
        gameOverScreen.classList.remove('hidden');
    }
    
    checkLevelCompletion() {
        console.log('Checking level completion:', this.score, 'needed:', this.levelGoals[this.level].resourcesNeeded);
        
        // Only complete level if score exactly matches the requirement
        if (this.score === this.levelGoals[this.level].resourcesNeeded) {
            // Immediately stop all game processes
            this.gameOver = true;
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }
            if (this.spawnInterval) {
                clearInterval(this.spawnInterval);
                this.spawnInterval = null;
            }
            
            // Level completed successfully
            if (this.level === 5) {
                this.showVictoryScreen();
            } else {
                this.showLevelComplete();
                // Automatically move to next level after a short delay
                setTimeout(() => {
                    const levelCompleteScreen = document.querySelector('.level-complete');
                    if (levelCompleteScreen) {
                        levelCompleteScreen.remove();
                    }
                    this.gameOver = false;
                    this.startLevel(this.level + 1);
                }, 2000); // Wait 2 seconds before moving to next level
            }
            return; // Exit to prevent further timer checks
        } 
        
        // Only check timer if level isn't complete
        if (this.levelTimeLeft <= 0 && !this.gameOver) {
            // Level failed due to time running out
            console.log('Level failed - time ran out');
            this.endGame(false);
        }
    }

    showLevelComplete() {
        // Stop the game loop and ensure all intervals are cleared
        this.gameLoopRunning = false;
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
            this.spawnInterval = null;
        }
        
        // Remove any existing level complete screens
        const existingScreens = document.querySelectorAll('.level-complete');
        existingScreens.forEach(screen => screen.remove());
        
        const levelCompleteDiv = document.createElement('div');
        levelCompleteDiv.className = 'level-complete';
        levelCompleteDiv.innerHTML = `
            <h2>Level ${this.level} Complete!</h2>
            <p>Resources Collected: ${this.score}/${this.levelGoals[this.level].resourcesNeeded}</p>
            <p>Moving to Level ${this.level + 1} in 2 seconds...</p>
        `;
        
        document.body.appendChild(levelCompleteDiv);
    }
    
    spawnObjects() {
        if (this.gameOver) return;
        
        const currentLevel = this.levelGoals[this.level];
        
        // Spawn resources (increased with level)
        const resourceChance = Math.min(0.6 + (this.level * 0.05), 0.8);
        if (Math.random() < resourceChance) {
            this.resources.push({
                x: Math.random() * (this.canvas.width - 20),
                y: -20,
                width: 20,
                height: 20,
                speed: currentLevel.resourceSpeed,
                rotation: 0
            });
        }
        
        // Spawn debris (increased with level)
        if (Math.random() < currentLevel.debrisRate) {
            this.debris.push({
                x: Math.random() * (this.canvas.width - 30),
                y: -30,
                width: 30,
                height: 30,
                speed: currentLevel.debrisSpeed,
                rotation: Math.random() * Math.PI * 2
            });
        }
    }
    
    update() {
        // Don't update if game is over or paused
        if (this.gameOver || !this.gameLoopRunning || this.isPaused) {
            return;
        }
        
        // Player movement with smooth acceleration
        const acceleration = 0.5;
        const deceleration = 0.3;
        const maxSpeed = 8;
        
        // Horizontal movement
        if (this.keys['ArrowLeft']) {
            this.player.velocityX = Math.max(-maxSpeed, this.player.velocityX - acceleration);
        } else if (this.keys['ArrowRight']) {
            this.player.velocityX = Math.min(maxSpeed, this.player.velocityX + acceleration);
        } else {
            // Apply deceleration when no keys are pressed
            if (this.player.velocityX > 0) {
                this.player.velocityX = Math.max(0, this.player.velocityX - deceleration);
            } else if (this.player.velocityX < 0) {
                this.player.velocityX = Math.min(0, this.player.velocityX + deceleration);
            }
        }
        
        // Vertical movement
        if (this.keys['ArrowUp']) {
            this.player.velocityY = Math.max(-maxSpeed, this.player.velocityY - acceleration);
            this.player.thrust = true;
        } else if (this.keys['ArrowDown']) {
            this.player.velocityY = Math.min(maxSpeed, this.player.velocityY + acceleration);
            this.player.thrust = false;
        } else {
            // Apply deceleration when no keys are pressed
            if (this.player.velocityY > 0) {
                this.player.velocityY = Math.max(0, this.player.velocityY - deceleration);
            } else if (this.player.velocityY < 0) {
                this.player.velocityY = Math.min(0, this.player.velocityY + deceleration);
            }
            this.player.thrust = false;
        }
        
        // Update position with velocity
        this.player.x += this.player.velocityX;
        this.player.y += this.player.velocityY;
        
        // Keep player within bounds
        this.player.x = Math.max(0, Math.min(this.canvas.width - this.player.width, this.player.x));
        this.player.y = Math.max(0, Math.min(this.canvas.height - this.player.height, this.player.y));
        
        // Update resources with proper collection logic
        const currentGoal = this.levelGoals[this.level].resourcesNeeded;
        
        this.resources.forEach(resource => {
            if (!this.gameOver) {  // Only move resources if game is not over
                resource.y += resource.speed;
                resource.rotation += 0.05;
            }
        });
        
        // Handle resource collection
        this.resources = this.resources.filter(resource => {
            if (this.checkCollision(this.player, resource)) {
                if (!this.gameOver && this.score < currentGoal) {
                    const newScore = this.score + 10;
                    // Only collect if it won't exceed the goal
                    if (newScore <= currentGoal) {
                        this.score = newScore;
                        document.getElementById('score').textContent = `${this.score}/${currentGoal}`;
                        
                        // Check for exact match with goal
                        if (this.score === currentGoal) {
                            this.checkLevelCompletion();
                        }
                    }
                }
                return false; // Remove the resource
            }
            return resource.y < this.canvas.height;
        });
        
        // Update debris with proper collision
        this.debris.forEach(debris => {
            if (!this.gameOver) {  // Only move debris if game is not over
                debris.y += debris.speed;
                debris.rotation += 0.1;
            }
        });
        
        this.debris = this.debris.filter(debris => {
            if (this.checkCollision(this.player, debris)) {
                if (!this.gameOver) {  // Only take damage if game isn't over
                    this.health -= 20;
                    document.getElementById('health').textContent = this.health;
                    
                    if (this.health <= 0) {
                        console.log('Game over due to health');
                        this.endGame(false);
                    }
                }
                return false;
            }
            return debris.y < this.canvas.height;
        });
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw level goal and time
        this.ctx.fillStyle = '#30f3ff';
        this.ctx.font = '20px Orbitron';
        this.ctx.fillText(`Level ${this.level}`, 10, 30);
        this.ctx.fillText(`Time: ${this.levelTimeLeft}s`, this.canvas.width - 150, 30);
        this.ctx.fillText(`Collect ${this.levelGoals[this.level].resourcesNeeded} resources`, 10, 60);
        
        // Draw player (rocket)
        this.ctx.save();
        this.ctx.translate(this.player.x + this.player.width/2, this.player.y + this.player.height/2);
        this.ctx.drawImage(
            this.rocketImg,
            -this.player.width/2,
            -this.player.height/2,
            this.player.width,
            this.player.height
        );
        
        // Draw rocket thrust
        if (this.player.thrust) {
            this.ctx.beginPath();
            this.ctx.moveTo(-10, this.player.height/2);
            this.ctx.lineTo(10, this.player.height/2);
            this.ctx.lineTo(0, this.player.height/2 + 20);
            this.ctx.fillStyle = '#30f3ff';
            this.ctx.fill();
        }
        this.ctx.restore();
        
        // Draw resources with level-based glow intensity
        this.resources.forEach(resource => {
            this.ctx.save();
            this.ctx.translate(resource.x + resource.width/2, resource.y + resource.height/2);
            this.ctx.rotate(resource.rotation);
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, -resource.height/2);
            this.ctx.lineTo(resource.width/2, 0);
            this.ctx.lineTo(0, resource.height/2);
            this.ctx.lineTo(-resource.width/2, 0);
            this.ctx.closePath();
            
            this.ctx.fillStyle = '#00ff00';
            this.ctx.shadowColor = '#00ff00';
            this.ctx.shadowBlur = 10 + (this.level * 2); // Increased glow with level
            this.ctx.fill();
            this.ctx.restore();
        });
        
        // Draw debris with level-based glow intensity
        this.debris.forEach(debris => {
            this.ctx.save();
            this.ctx.translate(debris.x + debris.width/2, debris.y + debris.height/2);
            this.ctx.rotate(debris.rotation);
            
            this.ctx.beginPath();
            const points = 6;
            for (let i = 0; i < points * 2; i++) {
                const radius = i % 2 === 0 ? debris.width/2 : debris.width/4;
                const angle = (i * Math.PI) / points;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                if (i === 0) this.ctx.moveTo(x, y);
                else this.ctx.lineTo(x, y);
            }
            this.ctx.closePath();
            
            this.ctx.fillStyle = '#ff0000';
            this.ctx.shadowColor = '#ff0000';
            this.ctx.shadowBlur = 10 + (this.level * 3); // Increased glow with level
            this.ctx.fill();
            this.ctx.restore();
        });
    }
    
    checkCollision(rect1, rect2) {
        const dx = (rect1.x + rect1.width/2) - (rect2.x + rect2.width/2);
        const dy = (rect1.y + rect1.height/2) - (rect2.y + rect2.height/2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (rect1.width + rect2.width) / 2;
    }
    
    gameLoop() {
        if (!this.gameLoopRunning || this.isPaused) return;
        
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    endGame(completed) {
        // Only end the game if it hasn't already ended
        if (!this.gameOver) {
            console.log('Game over triggered');
            
            // Set game over first to stop all updates
            this.gameOver = true;
            this.gameLoopRunning = false;
            
            // Clear all intervals
            clearInterval(this.spawnInterval);
            clearInterval(this.timerInterval);
            
            // Show game over screen
            const gameOverScreen = document.querySelector('.game-over');
            const gameOverMessage = gameOverScreen.querySelector('.game-over-message');
            
            if (completed) {
                gameOverScreen.querySelector('h2').textContent = 'Level Complete!';
                gameOverMessage.textContent = `Great job! You collected all ${this.levelGoals[this.level].resourcesNeeded} resources!`;
                document.getElementById('restart-button').textContent = 'Next Level →';
            } else {
                gameOverScreen.querySelector('h2').textContent = 'Level Failed!';
                gameOverMessage.textContent = `You collected ${this.score}/${this.levelGoals[this.level].resourcesNeeded} resources. Try again!`;
                document.getElementById('restart-button').textContent = '🔄 Try Again';
            }
            
            document.getElementById('final-score').textContent = this.score;
            document.getElementById('final-level').textContent = this.level;
            gameOverScreen.classList.remove('hidden');
            
            // Set up button listeners
            document.getElementById('restart-button').onclick = () => {
                gameOverScreen.classList.add('hidden');
                if (completed) {
                    this.startLevel(this.level + 1);
                } else {
                    this.startLevel(this.level); // Restart same level
                }
            };
            
            document.getElementById('home-button').onclick = () => {
                window.location.href = 'index.html';
            };
        }
    }

    restart() {
        console.log('Game restart initiated');
        
        // Hide game over screen
        const gameOverScreen = document.querySelector('.game-over');
        if (gameOverScreen) {
            gameOverScreen.classList.add('hidden');
        }
        
        // Clear any existing intervals
        if (this.spawnInterval) clearInterval(this.spawnInterval);
        if (this.timerInterval) clearInterval(this.timerInterval);
        
        // Reset game state
        this.resources = [];
        this.debris = [];
        this.score = 0;
        this.health = 100;
        this.level = 1;
        this.gameOver = false;
        this.levelTimeLeft = this.levelGoals[1].timeLimit;
        this.gameLoopRunning = false;
        
        // Reset player position
        this.player = {
            x: this.canvas.width / 2,
            y: this.canvas.height - 60,
            width: 50,
            height: 60,
            speed: 6,
            thrust: false,
            velocityX: 0,
            velocityY: 0
        };
        
        // Update HUD
        document.getElementById('score').textContent = '0';
        document.getElementById('health').textContent = '100';
        document.getElementById('level').textContent = '1';
        
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        console.log('Starting new game');
        // Start the first level
        this.startLevel(1);
    }

    setupButtonListeners() {
        // Setup restart button
        const restartButton = document.getElementById('restart-button');
        if (restartButton) {
            restartButton.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Restart button clicked'); // Debug log
                this.restart();
            });
        } else {
            console.warn('Restart button not found'); // Debug log
        }
    }
}

// Start the game when the page loads
window.addEventListener('load', () => new Game());
