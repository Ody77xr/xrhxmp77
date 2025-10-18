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
        // Create floating navigation icon with SVG
        const navIconHTML = `
            <div class="floating-nav" id="floatingNav">
                <div class="nav-icon" id="navIcon" title="Open Navigation Menu">
                    <svg class="nav-icon-idle" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#3450ad">
                        <g fill="none" stroke="#3450ad" stroke-width="1.5">
                            <circle cx="12" cy="12" r="2"/>
                            <path stroke-dasharray="2 2" stroke-linecap="round" d="M10.142 10.363C13.688 6.817 21.914 15.61 16.524 21" opacity=".5"/>
                            <path stroke-dasharray="2 2" stroke-linecap="round" d="M13.858 13.637C10.312 17.183 2.086 8.39 7.476 3" opacity=".5"/>
                            <path stroke-dasharray="2 2" stroke-linecap="round" d="M10.363 13.858C6.817 10.312 15.61 2.086 21 7.476" opacity=".5"/>
                            <path stroke-dasharray="2 2" stroke-linecap="round" d="M13.637 10.142C17.183 13.688 8.39 21.914 3 16.524" opacity=".5"/>
                        </g>
                    </svg>
                    <svg class="nav-icon-active" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#0000ff">
                        <g fill="#0000ff">
                            <path d="M12.735 14.654a.75.75 0 0 1-.23-1.44c.224-.094.441-.237.645-.44a.75.75 0 0 1 .996-.058a.751.751 0 0 1 .705.954c-.21.746-.6 1.477-1.105 2.147a.75.75 0 0 1-1.197-.903c.065-.087.127-.173.186-.26Zm-2.248.041a.75.75 0 0 0 .953-.707a.75.75 0 0 0-.058-.994a2.017 2.017 0 0 1-.442-.646a.75.75 0 0 0-1.438.23a6.448 6.448 0 0 1-.26-.186a.75.75 0 0 0-.903 1.198c.67.505 1.4.894 2.148 1.105Zm-3.811-2.749a.75.75 0 0 0 1.18-.925a7.882 7.882 0 0 1-1.01-1.677a.75.75 0 1 0-1.372.604c.317.72.728 1.394 1.202 1.998ZM4.84 7.672a.75.75 0 0 0 1.49-.178a5.115 5.115 0 0 1 .108-1.862a.75.75 0 0 0-1.454-.366a6.615 6.615 0 0 0-.144 2.406ZM6.008 3.08a.75.75 0 1 0 1.218.875c.177-.246.383-.49.62-.727a.75.75 0 0 0-1.06-1.061a7.396 7.396 0 0 0-.778.912Zm5.755 6.006a6.492 6.492 0 0 0-.187.26a.75.75 0 0 1 .23 1.439a2.018 2.018 0 0 0-.645.441a.75.75 0 0 1-.995.058a.752.752 0 0 1-.706-.954c.211-.746.6-1.477 1.105-2.147a.75.75 0 0 1 1.198.903Zm2.062.219a.75.75 0 0 0-.954.707a.75.75 0 0 0 .059.994c.204.204.347.421.441.645a.75.75 0 0 0 1.439-.23c.086.06.173.122.26.187a.75.75 0 0 0 .902-1.198c-.67-.505-1.4-.894-2.147-1.105Zm3.81 2.749a.75.75 0 1 0-1.18.925c.4.511.746 1.079 1.01 1.677a.75.75 0 0 0 1.372-.604a9.379 9.379 0 0 0-1.202-1.998Zm1.836 4.274a.75.75 0 1 0-1.489.178a5.114 5.114 0 0 1-.109 1.862a.75.75 0 0 0 1.455.366a6.612 6.612 0 0 0 .143-2.406Zm-1.168 4.592a.75.75 0 0 0-1.218-.875a5.9 5.9 0 0 1-.62.727a.75.75 0 0 0 1.06 1.06c.294-.292.553-.597.779-.911ZM12.082 7.573a.75.75 0 0 1 .127-1.053a9.384 9.384 0 0 1 1.998-1.202a.75.75 0 0 1 .604 1.373a7.881 7.881 0 0 0-1.677 1.01a.75.75 0 0 1-1.053-.128Zm3.746-2.056a.75.75 0 0 1 .655-.833a6.615 6.615 0 0 1 2.406.143a.75.75 0 1 1-.366 1.455a5.115 5.115 0 0 0-1.862-.109a.75.75 0 0 1-.834-.656Zm4.202.506a.75.75 0 0 1 1.046-.171c.314.226.619.485.912.778a.75.75 0 1 1-1.06 1.06a5.888 5.888 0 0 0-.728-.62a.75.75 0 0 1-.17-1.047ZM12.102 17.48a.75.75 0 0 0-.925-1.18A7.92 7.92 0 0 1 9.5 17.31a.75.75 0 1 0 .604 1.372a9.382 9.382 0 0 0 1.998-1.202Zm-4.274 1.836a.75.75 0 1 0-.178-1.49a5.119 5.119 0 0 1-1.862-.108a.75.75 0 1 0-.366 1.454a6.612 6.612 0 0 0 2.406.144Zm-4.592-1.168a.75.75 0 1 0 .875-1.218a5.9 5.9 0 0 1-.727-.62a.75.75 0 0 0-1.06 1.06c.292.293.597.552.912.778Z" opacity=".5"/>
                            <path d="M8.928 12.453c.406.836 1.016 1.541 1.825 1.942c-.793.183-1.71.22-2.648.087C5.315 14.087 2.75 12.284 2.75 9a.75.75 0 0 0-1.5 0c0 4.316 3.436 6.513 6.645 6.968c1.612.228 3.27.042 4.558-.584c.868-.422 1.596-1.065 1.988-1.921c.142.741.162 1.578.041 2.432c-.395 2.79-2.198 5.355-5.482 5.355a.75.75 0 0 0 0 1.5c4.316 0 6.513-3.436 6.968-6.645c.228-1.612.042-3.27-.584-4.558c-.346-.712-.84-1.33-1.48-1.745a7.677 7.677 0 0 1 1.99.027c2.792.396 5.356 2.198 5.356 5.482a.75.75 0 0 0 1.5 0c0-4.315-3.436-6.512-6.645-6.967c-1.612-.228-3.27-.043-4.558.584c-.692.336-1.294.812-1.709 1.425a7.565 7.565 0 0 1-.009-2.248c.396-2.79 2.198-5.355 5.482-5.355a.75.75 0 0 0 0-1.5c-4.315 0-6.512 3.436-6.967 6.645c-.228 1.612-.043 3.27.584 4.558Z"/>
                        </g>
                    </svg>
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <g fill="none">
                                <path fill="currentColor" d="m19.87 12.388l-.745-.08l.746.08Zm-.183 1.705l.746.08l-.746-.08Zm-15.374 0l-.746.08l.746-.08Zm-.184-1.705l.746-.08l-.746.08Zm4.631-1.454l.655.365l-.655-.365Zm1.79-3.209l-.655-.365l.655.365Zm2.9 0l-.655.366l.655-.366Zm1.79 3.209l.655-.365l-.655.365Zm.764 1.025l-.303.687l.303-.687Zm1.466-.714l-.529-.531l.53.531Zm-1.017.777l-.102-.743l.102.743Zm-9.924-.777L6 11.777l.53-.532Zm1.018.777l.102-.743l-.102.743Zm.45-.063l.301.687l-.302-.687Zm-2.285 8.194l.5-.559l-.5.56Zm12.576 0l-.5-.559l.5.56Zm.576-10.173l.568-.49l-.567.49Zm-5.956-3.197l-.341-.668l.34.668Zm-1.816 0l.341-.668l-.34.668Zm8.033 5.525l-.183 1.705l1.49.16l.184-1.704l-1.491-.16Zm-6.037 7.942h-2.176v1.5h2.176v-1.5Zm-8.03-6.237l-.183-1.705l-1.491.16l.183 1.705l1.492-.16Zm4.357-2.714l1.79-3.208l-1.31-.73l-1.79 3.208l1.31.73Zm3.38-3.208l1.79 3.208l1.31-.73l-1.79-3.209l-1.31.73Zm1.79 3.208c.162.29.31.56.455.765c.149.211.351.445.662.582l.604-1.373c.056.024.046.05-.039-.071a8.22 8.22 0 0 1-.372-.633l-1.31.73Zm2.356-.585c-.258.258-.412.41-.533.507c-.115.093-.117.066-.057.058l.205 1.486c.336-.047.595-.216.796-.378c.195-.158.412-.376.648-.61l-1.059-1.063Zm-1.24 1.932c.269.118.565.159.855.119l-.205-1.486a.083.083 0 0 1-.045-.006l-.605 1.373Zm-9.7-.87c.235.235.452.453.647.61c.201.164.46.332.796.379l.205-1.486c.06.008.058.035-.057-.058a8.265 8.265 0 0 1-.533-.507L6 11.777Zm2.104-1.207a8.23 8.23 0 0 1-.373.633c-.084.12-.094.095-.038.07l.604 1.374c.31-.137.514-.37.662-.582c.144-.206.293-.475.455-.765l-1.31-.73Zm-.661 2.196c.29.04.586-.001.854-.12l-.604-1.372a.083.083 0 0 1-.045.006l-.205 1.486Zm3.468 7.485c-1.438 0-2.445-.001-3.213-.1c-.748-.095-1.17-.273-1.487-.556l-1 1.118c.63.564 1.39.81 2.296.926c.886.113 2.006.112 3.404.112v-1.5Zm-7.345-6.077c.148 1.378.266 2.727.466 3.821c.101.552.229 1.072.405 1.523c.175.448.417.875.774 1.195l1-1.118c-.116-.104-.248-.294-.377-.623a6.926 6.926 0 0 1-.326-1.247c-.188-1.022-.297-2.28-.45-3.711l-1.492.16Zm15.375-.16c-.154 1.431-.264 2.689-.45 3.71c-.093.507-.2.922-.327 1.248c-.129.329-.261.52-.377.623l1 1.118c.357-.32.599-.747.774-1.195c.176-.451.304-.971.405-1.523c.2-1.094.318-2.443.466-3.82l-1.491-.161Zm-5.854 7.737c1.398 0 2.518.001 3.404-.112c.907-.116 1.666-.362 2.296-.926l-1-1.118c-.317.283-.739.46-1.487.556c-.768.099-1.775.1-3.213.1v1.5ZM10.75 5c0-.69.56-1.25 1.25-1.25v-1.5A2.75 2.75 0 0 0 9.25 5h1.5ZM12 3.75c.69 0 1.25.56 1.25 1.25h1.5A2.75 2.75 0 0 0 12 2.25v1.5ZM20.75 9a.75.75 0 0 1-.75.75v1.5A2.25 2.25 0 0 0 22.25 9h-1.5Zm-1.5 0a.75.75 0 0 1 .75-.75v-1.5A2.25 2.25 0 0 0 17.75 9h1.5Zm.75-.75a.75.75 0 0 1 .75.75h1.5A2.25 2.25 0 0 0 20 6.75v1.5ZM4 9.75A.75.75 0 0 1 3.25 9h-1.5A2.25 2.25 0 0 0 4 11.25v-1.5ZM3.25 9A.75.75 0 0 1 4 8.25v-1.5A2.25 2.25 0 0 0 1.75 9h1.5ZM4 8.25a.75.75 0 0 1 .75.75h1.5A2.25 2.25 0 0 0 4 6.75v1.5Zm16 1.5a.9.9 0 0 1-.009 0l-.017 1.5H20v-1.5Zm.616 2.719c.049-.45.091-.843.114-1.171a4.55 4.55 0 0 0-.004-.898l-1.487.2c.015.11.016.29-.005.592c-.02.294-.06.657-.11 1.116l1.492.16Zm-.625-2.719a.747.747 0 0 1-.559-.26l-1.135.98c.406.47 1.006.772 1.677.78l.017-1.5Zm-.559-.26A.744.744 0 0 1 19.25 9h-1.5c0 .561.207 1.076.547 1.47l1.135-.98ZM18 11.777c.677-.675 1.026-1.015 1.258-1.159l-.787-1.276c-.42.26-.924.768-1.53 1.372L18 11.777ZM4.75 9a.744.744 0 0 1-.182.49l1.135.98c.34-.394.547-.909.547-1.47h-1.5Zm2.309 1.714c-.606-.604-1.11-1.113-1.53-1.372l-.787 1.276c.232.144.58.484 1.258 1.159l1.059-1.063ZM4.568 9.49a.747.747 0 0 1-.559.26l.017 1.5a2.25 2.25 0 0 0 1.677-.78l-1.135-.98Zm-.559.26a.91.91 0 0 1-.009 0v1.5h.026l-.017-1.5Zm.866 2.558a32.52 32.52 0 0 1-.109-1.116a3.204 3.204 0 0 1-.005-.592l-1.487-.2a4.556 4.556 0 0 0-.004.898c.023.328.065.72.114 1.17l1.491-.16ZM13.25 5c0 .485-.276.907-.683 1.115l.681 1.336A2.75 2.75 0 0 0 14.75 5h-1.5Zm-.683 1.115c-.17.086-.361.135-.567.135v1.5c.448 0 .873-.108 1.248-.3l-.681-1.335Zm1.538 1.245c-.206-.37-.391-.703-.561-.975l-1.272.795c.146.234.31.53.523.91l1.31-.73ZM12 6.25c-.206 0-.398-.05-.567-.135l-.681 1.336c.375.191.8.299 1.248.299v-1.5Zm-.567-.135A1.25 1.25 0 0 1 10.75 5h-1.5a2.75 2.75 0 0 0 1.502 2.45l.681-1.335Zm-.228 1.976c.212-.382.377-.677.523-.91l-1.272-.796c-.17.272-.355.605-.561.975l1.31.73Z"/>
                                <path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M5 17.5h14" opacity=".5"/>
                            </g>
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