// Initialize Supabase
const { createClient } = supabase;
const supabaseClient = createClient(supabaseConfig.url, supabaseConfig.anonKey);

let currentUser = null;

// Check authentication on load
async function init() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    if (!session) {
        window.location.href = 'auth-gateway.html';
        return;
    }
    
    currentUser = session.user;
    await loadUserProfile();
    setupEventListeners();
}

// Load user profile data
async function loadUserProfile() {
    try {
        const { data: profile, error } = await supabaseClient
            .from('users')
            .select('*')
            .eq('id', currentUser.id)
            .single();
        
        if (error) throw error;
        
        // Update UI with profile data
        document.getElementById('displayName').textContent = profile.display_name || profile.username;
        document.getElementById('username').textContent = `@${profile.username}`;
        document.getElementById('displayNameInput').value = profile.display_name || '';
        document.getElementById('bioInput').value = profile.bio || '';
        
        // Avatar
        if (profile.avatar_url) {
            document.getElementById('avatarImg').src = profile.avatar_url;
        }
        
        // Tier badge
        const tierBadge = document.getElementById('tierBadge');
        tierBadge.textContent = profile.subscription_tier.toUpperCase();
        tierBadge.className = `px-3 py-1 rounded-full text-sm ${
            profile.subscription_tier === 'vip' ? 'bg-purple-600' : 'bg-gray-700'
        }`;
        
        // Role badge
        const roleBadge = document.getElementById('roleBadge');
        roleBadge.textContent = profile.role.toUpperCase();
        
        // Member since
        const memberDate = new Date(profile.created_at);
        document.getElementById('memberSince').textContent = memberDate.toLocaleDateString();
        
        // Subscription status
        document.getElementById('subscriptionStatus').textContent = 
            profile.subscription_tier === 'vip' ? 'Active' : 'Free';
        
        // Watch time
        const watchMinutes = Math.floor(profile.watch_time_used_today / 60);
        document.getElementById('watchTime').textContent = `${watchMinutes} min`;
        
        // Load transactions
        await loadTransactions();
        
    } catch (error) {
        console.error('Error loading profile:', error);
        alert('Failed to load profile');
    }
}

// Load transaction history
async function loadTransactions() {
    try {
        const { data: purchases, error } = await supabaseClient
            .from('purchases')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false })
            .limit(10);
        
        if (error) throw error;
        
        const transactionsList = document.getElementById('transactionsList');
        
        if (!purchases || purchases.length === 0) {
            transactionsList.innerHTML = '<p class="text-gray-400">No transactions yet</p>';
            return;
        }
        
        transactionsList.innerHTML = purchases.map(purchase => `
            <div class="bg-gray-700/50 rounded-lg p-4 flex justify-between items-center">
                <div>
                    <div class="font-bold">${purchase.amount} ${purchase.currency}</div>
                    <div class="text-sm text-gray-400">${new Date(purchase.created_at).toLocaleDateString()}</div>
                </div>
                <span class="px-3 py-1 rounded-full text-sm ${
                    purchase.status === 'completed' ? 'bg-green-600' : 'bg-yellow-600'
                }">${purchase.status}</span>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading transactions:', error);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            
            // Update active tab
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.add('hidden');
            });
            document.getElementById(`tab-${tabName}`).classList.remove('hidden');
        });
    });
    
    // Profile form submission
    document.getElementById('profileForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await updateProfile();
    });
    
    // Avatar upload
    document.getElementById('uploadAvatarBtn').addEventListener('click', () => {
        document.getElementById('avatarInput').click();
    });
    
    document.getElementById('avatarInput').addEventListener('change', async (e) => {
        await uploadAvatar(e.target.files[0]);
    });
    
    // Sign out
    document.getElementById('signOutBtn').addEventListener('click', async () => {
        await supabaseClient.auth.signOut();
        localStorage.removeItem('userLoggedIn');
        window.location.href = 'auth-gateway.html';
    });
}

// Update profile
async function updateProfile() {
    try {
        const displayName = document.getElementById('displayNameInput').value;
        const bio = document.getElementById('bioInput').value;
        
        const { error } = await supabaseClient
            .from('users')
            .update({
                display_name: displayName,
                bio: bio,
                updated_at: new Date().toISOString()
            })
            .eq('id', currentUser.id);
        
        if (error) throw error;
        
        alert('Profile updated successfully!');
        await loadUserProfile();
        
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile');
    }
}

// Upload avatar
async function uploadAvatar(file) {
    if (!file) return;
    
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${currentUser.id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabaseClient.storage
            .from('avatars')
            .upload(fileName, file);
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabaseClient.storage
            .from('avatars')
            .getPublicUrl(fileName);
        
        const { error: updateError } = await supabaseClient
            .from('users')
            .update({ avatar_url: publicUrl })
            .eq('id', currentUser.id);
        
        if (updateError) throw updateError;
        
        document.getElementById('avatarImg').src = publicUrl;
        alert('Avatar updated successfully!');
        
    } catch (error) {
        console.error('Error uploading avatar:', error);
        alert('Failed to upload avatar');
    }
}

// Add CSS for active tab
const style = document.createElement('style');
style.textContent = `
    .tab-btn {
        transition: all 0.3s ease;
        border-bottom: 3px solid transparent;
    }
    .tab-btn.active {
        color: #00FFFF;
        border-bottom-color: #00FFFF;
    }
    .tab-btn:hover {
        background: rgba(255, 255, 255, 0.05);
    }
`;
document.head.appendChild(style);

// Initialize on load
init();
