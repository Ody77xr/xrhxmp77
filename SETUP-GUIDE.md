# Hxmp Space - Complete Setup Guide

## 🚀 **Quick Start - Database Setup**

### **Step 1: Create Database Tables**

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project: `iqyauoezuuuohwhmxnkh`
3. Click on "SQL Editor" in the left sidebar
4. Click "New Query"
5. Copy the entire contents of `database-schema-final.sql`
6. Paste into the SQL editor
7. Click "Run" (or press Ctrl+Enter)
8. Wait for completion message: ✅ Database schema created successfully!

### **Step 2: Set Up Security Policies**

1. Still in SQL Editor, click "New Query"
2. Copy the entire contents of `database-rls-policies.sql`
3. Paste into the SQL editor
4. Click "Run"
5. Wait for completion message: ✅ RLS policies created successfully!

### **Step 3: Create Admin User**

1. In SQL Editor, run this query (replace with your email):

```sql
-- Create admin user
INSERT INTO auth.users (
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  'your-admin-email@example.com',
  crypt('your-secure-password', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
) RETURNING id;

-- Note the returned ID, then insert into users table:
INSERT INTO users (
  id,
  email,
  username,
  display_name,
  role,
  subscription_tier
) VALUES (
  'PASTE-THE-ID-FROM-ABOVE',
  'your-admin-email@example.com',
  'admin',
  'Administrator',
  'admin',
  'lifetime'
);
```

---

## 📊 **Database Structure Overview**

### **24 Tables Created:**

1. **users** - User accounts & profiles
2. **categories** - Content categories
3. **content** - Videos & photos
4. **galleries** - Content collections
5. **gallery_items** - Items in galleries
6. **watch_sessions** - Viewing time tracking
7. **ad_views** - Ad watch tracking
8. **video_unlocks** - Unlocked content
9. **gallery_unlocks** - Unlocked galleries
10. **purchases** - All transactions
11. **subscriptions** - VIP memberships
12. **comments** - Video comments
13. **comment_likes** - Comment likes
14. **content_likes** - Content likes
15. **saved_videos** - User favorites
16. **creator_wallets** - Creator earnings
17. **wallet_transactions** - Wallet activity
18. **payout_requests** - Creator payouts
19. **messages** - User messaging
20. **conversations** - Message threads
21. **support_tickets** - Support system
22. **admin_actions** - Audit log
23. **notifications** - User notifications
24. **analytics** - Site analytics

### **Key Features Implemented:**

✅ User authentication & roles (user, creator, admin)
✅ Tiered memberships (free, VIP, lifetime)
✅ Watch time tracking & limits
✅ Ad-based time unlocks
✅ Video/gallery unlocks
✅ Creator monetization system
✅ Comments & social features
✅ Messaging system
✅ Support tickets
✅ Admin audit logging
✅ Analytics tracking

---

## 🔐 **Authentication Setup**

### **Configure Supabase Auth:**

1. In Supabase Dashboard, go to "Authentication" → "Settings"
2. Enable Email provider
3. Configure email templates (optional)
4. Set Site URL: `http://localhost:8080` (for development)
5. Add Redirect URLs:
   - `http://localhost:8080/auth/callback`
   - `https://your-domain.com/auth/callback` (for production)

### **Update Your App Config:**

The `supabase-config.js` file is already configured with your credentials:
```javascript
const supabaseConfig = {
    url: 'https://iqyauoezuuuohwhmxnkh.supabase.co',
    anonKey: 'your-anon-key',
    // ...
};
```

---

## 💳 **Gumroad Setup**

### **Step 1: Create Products**

1. Go to https://gumroad.com/products
2. Create these products:

**VIP Membership:**
- Name: "Hxmpa' VIP Membership"
- Price: $12.99/month
- Type: Subscription
- Permalink: `hxmp-vip-membership`

**Individual Video Template:**
- Name: "Premium Video - [Title]"
- Price: Variable (set per video)
- Type: One-time purchase

**Super Hxmp Template:**
- Name: "Super Hxmp - [Title]"
- Price: $20-50
- Type: One-time purchase

### **Step 2: Set Up Webhooks**

1. Go to Gumroad Settings → Advanced → Webhooks
2. Add webhook URL: `https://your-domain.com/api/gumroad/webhook`
3. Select events:
   - ✅ sale
   - ✅ subscription_started
   - ✅ subscription_ended
   - ✅ subscription_updated
   - ✅ refund

### **Step 3: Get API Keys**

1. Go to Gumroad Settings → Advanced → Application
2. Copy your Access Token
3. Already saved in `.env` file

---

## 🎨 **Frontend Integration**

### **Include Supabase in Your HTML:**

Add to all pages that need authentication:

```html
<!-- Supabase Client -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase-config.js"></script>
<script>
  // Initialize Supabase client
  const { createClient } = supabase;
  const supabaseClient = createClient(
    supabaseConfig.url,
    supabaseConfig.anonKey,
    supabaseConfig.options
  );
</script>
```

### **Example: Check User Session**

```javascript
// Check if user is logged in
const { data: { user } } = await supabaseClient.auth.getUser();

if (user) {
  // User is logged in
  console.log('User:', user.email);
  
  // Get user profile
  const { data: profile } = await supabaseClient
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
    
  console.log('Profile:', profile);
} else {
  // Redirect to login
  window.location.href = '/login.html';
}
```

### **Example: Track Watch Time**

```javascript
// Start watch session
const sessionId = await startWatchSession(contentId);

// Update watch time every 10 seconds
setInterval(async () => {
  await updateWatchTime(sessionId, 10);
}, 10000);

async function startWatchSession(contentId) {
  const { data, error } = await supabaseClient
    .from('watch_sessions')
    .insert({
      user_id: user.id,
      content_id: contentId,
      session_start: new Date().toISOString()
    })
    .select()
    .single();
    
  return data.id;
}

async function updateWatchTime(sessionId, seconds) {
  // Update session
  await supabaseClient
    .from('watch_sessions')
    .update({
      duration_seconds: supabaseClient.rpc('increment', { x: seconds }),
      session_end: new Date().toISOString()
    })
    .eq('id', sessionId);
    
  // Update user's daily watch time
  await supabaseClient.rpc('increment_watch_time', {
    user_id: user.id,
    seconds: seconds
  });
}
```

---

## 🚀 **Deployment to Netlify**

### **Step 1: Install Netlify CLI**

```bash
npm install -g netlify-cli
```

### **Step 2: Login to Netlify**

```bash
netlify login
```

### **Step 3: Initialize Site**

```bash
netlify init
```

Follow the prompts:
- Create & configure a new site
- Team: Your team
- Site name: hxmp-space (or your choice)
- Build command: (leave empty)
- Publish directory: `.` (current directory)

### **Step 4: Set Environment Variables**

```bash
netlify env:set SUPABASE_URL "https://iqyauoezuuuohwhmxnkh.supabase.co"
netlify env:set SUPABASE_ANON_KEY "your-anon-key"
netlify env:set GUMROAD_ACCESS_TOKEN "your-gumroad-token"
```

### **Step 5: Deploy**

```bash
# Deploy to production
netlify deploy --prod

# Or deploy to preview first
netlify deploy
```

---

## 📝 **Next Steps**

### **Immediate Tasks:**

1. ✅ Run database schema SQL
2. ✅ Run RLS policies SQL
3. ✅ Create admin user
4. ✅ Configure Supabase Auth
5. ✅ Set up Gumroad products
6. ✅ Configure Gumroad webhooks

### **Development Tasks:**

1. Create login/signup pages
2. Build video player with time tracking
3. Implement Gumroad checkout flow
4. Create admin dashboard
5. Build creator upload interface
6. Implement messaging system
7. Add comment system
8. Create analytics dashboard

### **Testing Checklist:**

- [ ] User registration works
- [ ] Login/logout works
- [ ] Free tier time limits work
- [ ] Ad unlocks work
- [ ] Video purchases work
- [ ] VIP subscription works
- [ ] Creator uploads work
- [ ] Wallet system works
- [ ] Messaging works
- [ ] Admin panel works

---

## 🆘 **Troubleshooting**

### **Database Issues:**

**Error: "relation does not exist"**
- Make sure you ran `database-schema-final.sql` first
- Check that all tables were created successfully

**Error: "permission denied"**
- Make sure you ran `database-rls-policies.sql`
- Check that RLS is enabled on all tables

### **Authentication Issues:**

**Can't log in:**
- Check Supabase Auth settings
- Verify email confirmation settings
- Check redirect URLs

**Session expires immediately:**
- Check `supabase-config.js` settings
- Verify `persistSession: true` is set

### **Gumroad Issues:**

**Webhook not firing:**
- Check webhook URL is correct
- Verify webhook is enabled in Gumroad
- Check server logs for errors

**Purchase not unlocking content:**
- Verify webhook handler is working
- Check `purchases` table for transaction
- Check `video_unlocks` table for unlock record

---

## 📞 **Support**

If you encounter issues:
1. Check the troubleshooting section above
2. Review Supabase logs in dashboard
3. Check browser console for errors
4. Review server logs for API errors

---

**Database is ready! Start building! 🚀**
