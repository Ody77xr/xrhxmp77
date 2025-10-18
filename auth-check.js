// Authentication Check and Session Management
class AuthManager {
    constructor() {
        this.supabaseClient = null;
        this.currentUser = null;
        this.init();
    }

    async init() {
        // Initialize Supabase
        const { createClient } = supabase;
        this.supabaseClient = createClient(supabaseConfig.url, supabaseConfig.anonKey);
        
        // Check authentication status
        await this.checkAuth();
    }

    async checkAuth() {
        // Check if guest expired
        if (localStorage.getItem('guestExpired') === 'true') {
            this.redirectToAuth();
            return;
        }

        // Check for active session
        const { data: { session } } = await this.supabaseClient.auth.getSession();
        
        if (session) {
            // User is logged in
            this.currentUser = session.user;
            localStorage.setItem('userLoggedIn', 'true');
            
            // Clear guest mode if exists
            localStorage.removeItem('guestMode');
            localStorage.removeItem('guestStartTime');
            localStorage.removeItem('guestExpiry');
            
            await this.updateUserActivity();
            return true;
        }

        // Check guest mode
        const guestMode = localStorage.getItem('guestMode');
        const guestExpiry = parseInt(localStorage.getItem('guestExpiry'));
        
        if (guestMode === 'true' && guestExpiry) {
            const now = Date.now();
            
            if (now < guestExpiry) {
                // Guest mode still valid
                return true;
            } else {
                // Guest mode expired
                localStorage.setItem('guestExpired', 'true');
                this.redirectToAuth();
                return false;
            }
        }

        // No authentication, redirect to gateway
        this.redirectToAuth();
        return false;
    }

    async updateUserActivity() {
        if (!this.currentUser) return;

        try {
            await this.supabaseClient
                .from('users')
                .update({ 
                    last_login: new Date().toISOString() 
                })
                .eq('id', this.currentUser.id);
        } catch (error) {
            console.error('Error updating user activity:', error);
        }
    }

    redirectToAuth() {
        // Don't redirect if already on auth pages
        const currentPage = window.location.pathname.split('/').pop();
        const authPages = ['auth-gateway.html', 'auth-login.html', 'auth-signup.html', 'index.html'];
        
        if (!authPages.includes(currentPage)) {
            window.location.href = 'auth-gateway.html';
        }
    }

    async getUserProfile() {
        if (!this.currentUser) return null;

        try {
            const { data, error } = await this.supabaseClient
                .from('users')
                .select('*')
                .eq('id', this.currentUser.id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    }

    isGuest() {
        return localStorage.getItem('guestMode') === 'true';
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    async signOut() {
        await this.supabaseClient.auth.signOut();
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('guestMode');
        localStorage.removeItem('guestStartTime');
        localStorage.removeItem('guestExpiry');
        window.location.href = 'auth-gateway.html';
    }
}

// Create global auth manager instance
const authManager = new AuthManager();

// Export for use in other scripts
window.authManager = authManager;
