// Guest Mode Timer Handler
class GuestTimer {
    constructor() {
        this.checkInterval = null;
        this.timerDisplay = null;
        this.init();
    }

    init() {
        // Check if in guest mode
        const guestMode = localStorage.getItem('guestMode');
        
        if (guestMode === 'true') {
            this.startTimer();
            this.createTimerDisplay();
        }
    }

    createTimerDisplay() {
        // Create floating timer display
        const timerDiv = document.createElement('div');
        timerDiv.id = 'guestTimer';
        timerDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 12px 20px;
            border-radius: 10px;
            font-family: 'Orbitron', monospace;
            font-weight: bold;
            z-index: 9999;
            box-shadow: 0 4px 20px rgba(255, 0, 0, 0.5);
            backdrop-filter: blur(10px);
        `;
        document.body.appendChild(timerDiv);
        this.timerDisplay = timerDiv;
    }

    startTimer() {
        this.updateDisplay();
        
        // Update every second
        this.checkInterval = setInterval(() => {
            this.updateDisplay();
            this.checkExpiry();
        }, 1000);
    }

    updateDisplay() {
        const remaining = this.getRemainingTime();
        
        if (this.timerDisplay) {
            const minutes = Math.floor(remaining / 60);
            const seconds = remaining % 60;
            this.timerDisplay.textContent = `⏱️ Guest: ${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // Change color when time is running out
            if (remaining < 300) { // Less than 5 minutes
                this.timerDisplay.style.background = 'rgba(255, 100, 0, 0.9)';
            }
            if (remaining < 60) { // Less than 1 minute
                this.timerDisplay.style.background = 'rgba(255, 0, 0, 0.9)';
                this.timerDisplay.style.animation = 'pulse 1s infinite';
            }
        }
    }

    getRemainingTime() {
        const guestExpiry = parseInt(localStorage.getItem('guestExpiry'));
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((guestExpiry - now) / 1000));
        return remaining;
    }

    checkExpiry() {
        const remaining = this.getRemainingTime();
        
        if (remaining <= 0) {
            this.handleExpiry();
        }
    }

    handleExpiry() {
        clearInterval(this.checkInterval);
        
        // Show expiry modal
        this.showExpiryModal();
    }

    showExpiryModal() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            font-family: 'Orbitron', monospace;
        `;
        
        modal.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #1A1A2E 0%, #0A0A0F 100%);
                padding: 40px;
                border-radius: 20px;
                border: 2px solid rgba(0, 255, 255, 0.5);
                text-align: center;
                max-width: 500px;
                box-shadow: 0 0 50px rgba(0, 255, 255, 0.3);
            ">
                <h2 style="
                    font-size: 32px;
                    margin-bottom: 20px;
                    background: linear-gradient(45deg, #FF00FF, #00FFFF);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                ">⏰ Time's Up!</h2>
                <p style="color: #fff; margin-bottom: 30px; line-height: 1.6;">
                    Your 30-minute guest browsing session has expired.
                    <br><br>
                    Sign up now to continue enjoying unlimited content!
                </p>
                <button onclick="window.location.href='auth-signup.html'" style="
                    background: linear-gradient(45deg, #FF00FF, #00FFFF);
                    color: white;
                    padding: 15px 40px;
                    border: none;
                    border-radius: 10px;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    font-family: 'Orbitron', monospace;
                    margin-right: 10px;
                ">Sign Up Now</button>
                <button onclick="window.location.href='auth-login.html'" style="
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    padding: 15px 40px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 10px;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    font-family: 'Orbitron', monospace;
                ">Login</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Clear guest mode
        localStorage.removeItem('guestMode');
        localStorage.removeItem('guestStartTime');
        localStorage.removeItem('guestExpiry');
        
        // Disable browsing
        localStorage.setItem('guestExpired', 'true');
    }
}

// Add pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(style);

// Initialize guest timer
const guestTimer = new GuestTimer();
