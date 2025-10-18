// Authentication Check and Session Management - Enhanced
class AuthManager {
    constructor() {
        this.supabaseClient = null;
        this.currentUser = null;
        this.currentProfile = null;
        this.init();
    }

    async init() {
        // Initialize Supabase
        const { createClient } = supabase;
        this.supabaseClient = createClient(supabaseConfig.url, supabaseConfig.anonKey);
        
        // Listen for auth state changes
        this.supabaseClient.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                this.currentUser = null;
                this.currentProfile = null;
            }
        });
        
        // Check authentication status
        await this.checkAuth();
    }

    async checkAuth() {
        // Check if guest expired
        if (localStorage.getItem('guestExpired') === 'true') {
            this.redirectToAuth();
            return false;
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
                return true;
            } else {
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
        const currentPage = window.location.pathname.split('/').pop();
        const authPages = ['auth-gateway.html', 'auth-login.html', 'auth-signup.html', 'index.html'];
        
        if (!authPages.includes(currentPage)) {
            window.location.href = 'auth-gateway.html';
        }
    }

    // Get current user
    async getCurrentUser() {
        if (this.currentUser) return this.currentUser;

        const { data: { user }, error } = await this.supabaseClient.auth.getUser();
        if (error || !user) return null;

        this.currentUser = user;
        return user;
    }

    // Get user profile with caching
    async getUserProfile(userId = null) {
        if (!userId) {
            const user = await this.getCurrentUser();
            if (!user) return null;
            userId = user.id;
        }

        if (this.currentProfile && this.currentProfile.id === userId) {
            return this.currentProfile;
        }

        try {
            const { data, error } = await this.supabaseClient
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            this.currentProfile = data;
            return data;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    }

    // Check if user has specific role
    async hasRole(role) {
        const profile = await this.getUserProfile();
        return profile && profile.role === role;
    }

    // Check if user is admin
    async isAdmin() {
        return await this.hasRole('admin');
    }

    // Check if user is creator
    async isCreator() {
        const profile = await this.getUserProfile();
        return profile && profile.is_creator === true;
    }

    // Check if user is VIP
    async isVIP() {
        const profile = await this.getUserProfile();
        if (!profile) return false;
        
        const tier = profile.subscription_tier;
        if (tier === 'lifetime') return true;
        if (tier === 'vip') {
            const expiresAt = new Date(profile.subscription_expires_at);
            return expiresAt > new Date();
        }
        return false;
    }

    // Check if user is free tier
    async isFreeTier() {
        const profile = await this.getUserProfile();
        return profile && profile.subscription_tier === 'free';
    }

    // Require authentication (redirect if not logged in)
    async requireAuth(message = 'Please log in to continue') {
        const isAuth = await this.isAuthenticated();
        if (!isAuth) {
            if (confirm(message + '\n\nWould you like to log in now?')) {
                window.location.href = 'auth-login.html';
            }
            return false;
        }
        return true;
    }

    // Require admin role
    async requireAdmin() {
        const isAuth = await this.requireAuth('Admin access required');
        if (!isAuth) return false;

        const isAdminUser = await this.isAdmin();
        if (!isAdminUser) {
            alert('You do not have admin privileges');
            window.location.href = 'xrhome.html';
            return false;
        }
        return true;
    }

    // Require VIP subscription
    async requireVIP(message = 'VIP membership required to access this feature') {
        const isAuth = await this.requireAuth();
        if (!isAuth) return false;

        const isVipUser = await this.isVIP();
        if (!isVipUser) {
            if (confirm(message + '\n\nWould you like to upgrade to VIP?')) {
                window.location.href = 'xrmembership.html';
            }
            return false;
        }
        return true;
    }

    // Check if authenticated
    async isAuthenticated() {
        const { data: { session } } = await this.supabaseClient.auth.getSession();
        return !!session;
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
        this.currentUser = null;
        this.currentProfile = null;
        window.location.href = 'auth-gateway.html';
    }

    // Update user profile
    async updateProfile(updates) {
        const user = await this.getCurrentUser();
        if (!user) return { error: 'Not authenticated' };

        const { data, error } = await this.supabaseClient
            .from('users')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single();

        if (!error) {
            this.currentProfile = data;
        }

        return { data, error };
    }
}

// Create global auth manager instance
const authManager = new AuthManager();

// Export for use in other scripts
window.authManager = authManager;

// Helper functions for backward compatibility
async function requireAuth(message) {
    return await authManager.requireAuth(message);
}

async function requireAdmin() {
    return await authManager.requireAdmin();
}

async function requireVIP(message) {
    return await authManager.requireVIP(message);
}

async function getCurrentUser() {
    return await authManager.getCurrentUser();
}

async function getUserProfile() {
    return await authManager.getUserProfile();
}

async function isAdmin() {
    return await authManager.isAdmin();
}

async function isVIP() {
    return await authManager.isVIP();
}

async function signOut() {
    return await authManager.signOut();
}
