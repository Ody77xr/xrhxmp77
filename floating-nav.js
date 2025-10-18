// Floating Navigation JavaScript - Standalone Menu Component
class FloatingNav {
    constructor() {
        this.isMenuOpen = false;
        this.isAdmin = false;
        this.userTier = 'free';
        this.init();
    }

    async init() {
        await this.checkAdminStatus();
        this.createNavigation();
        this.bindEvents();
    }

    async checkAdminStatus() {
        try {
            // Check if Supabase is available
            if (typeof supabase !== 'undefined' && supabaseConfig) {
                const { createClient } = supabase;
                const supabaseClient = createClient(supabaseConfig.url, supabaseConfig.anonKey, supabaseConfig.options);
                
                const { data: { user }, error } = await supabaseClient.auth.getUser();
                
                if (user) {
                    const { data: userData, error: userError } = await supabaseClient
                        .from('users')
                        .select('role, subscription_tier')
                        .eq('id', user.id)
                        .single();
                    
                    if (!userError && userData) {
                        if (userData.role === 'admin') {
                            this.isAdmin = true;
                        }
                        this.userTier = userData.subscription_tier;
                    }
                }
            }
        } catch (error) {
            console.log('Admin check failed:', error);
        }
    }

    createNavigation() {
        // Create floating navigation icon
        const navIconHTML = `
            <div class="floating-nav" id="floatingNav">
                <div class="nav-icon" id="navIcon" title="Open Navigation Menu">
                    <img src="xr1.png" alt="Navigation" />
                </div>
            </div>
        `;

        // Create backdrop overlay
        const backdropHTML = `
            <div class="nav-backdrop" id="navBackdrop"></div>
        `;

        // Create standalone menu component (separate from icon)
        const navMenuHTML = `
            <div class="nav-menu" id="navMenu" role="menu" aria-hidden="true" aria-label="Site navigation">
                <div id="nav-title" class="sr-only">Navigation Menu</div>
                <a href="xrhome.html" class="nav-item" role="menuitem">
                    <span class="nav-item-icon"> 
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9,22 9,12 15,12 15,22"></polyline>
                        </svg>
                    </span>
                    <span class="nav-item-text">HOME</span>
                </a>
                <a href="xrgallery-entrance.html" class="nav-item" role="menuitem">
                    <span class="nav-item-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21,15 16,10 5,21"></polyline>
                        </svg>
                    </span>
                    <span class="nav-item-text">GALLERY</span>
                </a>
                <a href="xrmyhxmps.html" class="nav-item" role="menuitem">
                    <span class="nav-item-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14,2 14,8 20,8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10,9 9,9 8,9"></polyline>
                        </svg>
                    </span>
                    <span class="nav-item-text">STASH</span>
                </a>
                <a href="xrmembership.html" class="nav-item" role="menuitem">
                    <span class="nav-item-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
                        </svg>
                    </span>
                    <span class="nav-item-text">VIP PORTAL</span>
                </a>
                <a href="xrmessaging.html" class="nav-item" role="menuitem">
                    <span class="nav-item-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                    </span>
                    <span class="nav-item-text">MESSAGES</span>
                </a>
                <a href="xrhxmpa-wallet.html" class="nav-item nav-wallet" role="menuitem" data-vip-only="true">
                    <span class="nav-item-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                            <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                            <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
                        </svg>
                    </span>
                    <span class="nav-item-text">HXMPA' WALLET</span>
                </a>
                <a href="xrdocs.html" class="nav-item" role="menuitem">
                    <span class="nav-item-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14,2 14,8 20,8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <line x1="10" y1="9" x2="8" y2="9"></line>
                        </svg>
                    </span>
                    <span class="nav-item-text">HXMP DOCS</span>
                </a>
                <a href="xrabout.html" class="nav-item" role="menuitem">
                    <span class="nav-item-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    </span>
                    <span class="nav-item-text">ABOUT</span>
                </a>
                <div class="nav-divider"></div>
                <a href="profile.html" class="nav-item" role="menuitem" id="profileLink">
                    <span class="nav-item-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </span>
                    <span class="nav-item-text">MY PROFILE</span>
                </a>
                <a href="#" class="nav-item nav-signout" role="menuitem" id="signOutLink">
                    <span class="nav-item-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                    </span>
                    <span class="nav-item-text">SIGN OUT</span>
                </a>
                ${this.isAdmin ? `
                <a href="xradmin-dashboard.html" class="nav-item admin-portal" role="menuitem">
                    <span class="nav-item-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </span>
                    <span class="nav-item-text">ADMIN</span>
                </a>
                ` : ''}
            </div>
        `;

        // Insert navigation icon, backdrop, and standalone menu into body
        document.body.insertAdjacentHTML('beforeend', navIconHTML);
        document.body.insertAdjacentHTML('beforeend', backdropHTML);
        document.body.insertAdjacentHTML('beforeend', navMenuHTML);
    }

    bindEvents() {
        const navIcon = document.getElementById('navIcon');
        const navMenu = document.getElementById('navMenu');
        const navBackdrop = document.getElementById('navBackdrop');

        // Hide VIP-only items for non-VIP users
        this.applyVIPGating();

        // Toggle menu on icon click
        navIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        // Ensure ARIA attributes and tabindex
        navIcon.setAttribute('aria-haspopup', 'true');
        navIcon.setAttribute('aria-expanded', 'false');
        navIcon.setAttribute('role', 'button');
        navIcon.tabIndex = 0;

        // Keyboard activation for accessibility
        navIcon.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleMenu();
            }
        });

        // Close menu when clicking backdrop
        navBackdrop.addEventListener('click', () => {
            this.closeMenu();
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });

        // Add hover effects to icon
        navIcon.addEventListener('mouseenter', () => {
            if (!this.isMenuOpen) {
                navIcon.style.transform = 'scale(1.1)';
            }
        });

        navIcon.addEventListener('mouseleave', () => {
            if (!this.isMenuOpen) {
                navIcon.style.transform = 'scale(1)';
            }
        });

        // Prevent menu clicks from closing the menu
        navMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Handle sign out
        const signOutLink = document.getElementById('signOutLink');
        if (signOutLink) {
            signOutLink.addEventListener('click', async (e) => {
                e.preventDefault();
                await this.handleSignOut();
            });
        }

        // Hide profile/signout for guests
        this.updateAuthUI();
    }

    async handleSignOut() {
        if (confirm('Are you sure you want to sign out?')) {
            try {
                if (typeof supabase !== 'undefined' && supabaseConfig) {
                    const { createClient } = supabase;
                    const supabaseClient = createClient(supabaseConfig.url, supabaseConfig.anonKey);
                    await supabaseClient.auth.signOut();
                }
                
                localStorage.removeItem('userLoggedIn');
                localStorage.removeItem('guestMode');
                localStorage.removeItem('guestStartTime');
                localStorage.removeItem('guestExpiry');
                
                window.location.href = 'auth-gateway.html';
            } catch (error) {
                console.error('Sign out error:', error);
                alert('Failed to sign out');
            }
        }
    }

    updateAuthUI() {
        const isGuest = localStorage.getItem('guestMode') === 'true';
        const profileLink = document.getElementById('profileLink');
        const signOutLink = document.getElementById('signOutLink');
        
        if (isGuest) {
            // Hide profile and sign out for guests
            if (profileLink) profileLink.style.display = 'none';
            if (signOutLink) signOutLink.style.display = 'none';
        }
    }

    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        const navIcon = document.getElementById('navIcon');
        const navMenu = document.getElementById('navMenu');
        const navBackdrop = document.getElementById('navBackdrop');

        this.isMenuOpen = true;
        navIcon.classList.add('active');
        navIcon.setAttribute('aria-expanded', 'true');
        
        // Show backdrop first
        navBackdrop.classList.add('active');
        
        // Then show standalone menu component
        setTimeout(() => {
            navMenu.classList.add('active');
            navMenu.setAttribute('aria-hidden', 'false');
        }, 50);

        // Lock body scroll
        document.body.classList.add('nav-open');

        // Add subtle vibration effect if supported
        if (navigator.vibrate) {
            navigator.vibrate([50, 30, 50]);
        }

        // Add focus trap for accessibility
        this.trapFocus(navMenu);
    }

    closeMenu() {
        const navIcon = document.getElementById('navIcon');
        const navMenu = document.getElementById('navMenu');
        const navBackdrop = document.getElementById('navBackdrop');

        this.isMenuOpen = false;
        navIcon.classList.remove('active');
        navIcon.setAttribute('aria-expanded', 'false');
        
        // Hide standalone menu component
        navMenu.classList.remove('active');
        navMenu.setAttribute('aria-hidden', 'true');
        
        // Hide backdrop
        setTimeout(() => {
            navBackdrop.classList.remove('active');
        }, 200);

        // Unlock body scroll
        document.body.classList.remove('nav-open');

        // Return focus to nav icon
        navIcon.focus();
    }

    // Method to highlight current page
    highlightCurrentPage() {
        const currentPage = window.location.pathname.split('/').pop();
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href === currentPage) {
                item.style.background = 'linear-gradient(135deg, rgba(255, 215, 0, 0.4), rgba(0, 255, 255, 0.3))';
                item.style.border = '2px solid rgba(255, 215, 0, 0.7)';
                item.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.5)';
            }
        });
    }

    // Apply VIP gating to menu items
    applyVIPGating() {
        const vipOnlyItems = document.querySelectorAll('[data-vip-only="true"]');
        const isVIP = this.userTier === 'vip' || this.userTier === 'lifetime' || this.isAdmin;
        
        vipOnlyItems.forEach(item => {
            if (!isVIP) {
                // Hide for non-VIP users or add lock icon
                item.style.opacity = '0.5';
                item.style.pointerEvents = 'none';
                item.style.position = 'relative';
                
                // Add VIP badge
                const badge = document.createElement('span');
                badge.className = 'vip-badge';
                badge.innerHTML = '🔒 VIP';
                badge.style.cssText = `
                    position: absolute;
                    top: 4px;
                    right: 4px;
                    background: linear-gradient(45deg, #FFD700, #FFA500);
                    color: #000;
                    font-size: 8px;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-weight: bold;
                `;
                item.appendChild(badge);
            }
        });
    }

    // Focus trap for accessibility
    trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });

        // Focus first element
        if (firstFocusableElement) {
            firstFocusableElement.focus();
        }
    }
}

// Initialize floating navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Remove any duplicate navigation elements first
    document.querySelectorAll('.hx-bottom-nav, .floating-nav').forEach(el => el.remove());
    
    const floatingNav = new FloatingNav();
    
    // Highlight current page after a short delay
    setTimeout(() => {
        floatingNav.highlightCurrentPage();
    }, 100);
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FloatingNav;
}