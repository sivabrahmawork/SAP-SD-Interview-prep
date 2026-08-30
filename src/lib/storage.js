import { createClient } from '@supabase/supabase-js';

const useLocal = !process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = !useLocal ? createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
) : null;

// ============================================================================
// NORMALIZEPROFILE — Standardizes Supabase rows to app user object shape
// ============================================================================
// Handles:
// - Session user data from supabase.auth.getSession()
// - Profile row data from profiles table
// - Cases where profile is null (new users)
// - ALL profile fields: full_name, gender, dob, company, country, email, etc.
// ============================================================================

function normalizeProfile(authUser, profileRow) {
    // authUser = from supabase.auth.getSession().session.user
    // profileRow = from supabase.from('profiles').select('*').single()
    
    return {
        id: authUser?.id || null,
        email: authUser?.email || null,
        fullName: profileRow?.full_name || '',
        gender: profileRow?.gender || '',
        dob: profileRow?.dob || '',
        company: profileRow?.company || '',
        country: profileRow?.country || '',
        activeModule: profileRow?.active_module || 'sd',
        notificationsEnabled: profileRow?.notifications_enabled ?? false,
        questionNotifEnabled: profileRow?.question_notif_enabled ?? false,
        questionNotifModule: profileRow?.question_notif_module || 'sd',
        questionNotifDifficulty: profileRow?.question_notif_difficulty || 'easy',
    };
}

// ============================================================================
// SIGN UP — Creates auth account + profile row with ALL user data
// ============================================================================

export async function signUp(email, password, profileData = {}) {
    if (useLocal) {
        localStorage.setItem('user_' + email, JSON.stringify({
            id: 'local_' + Date.now(),
            email,
            fullName: profileData.fullName || '',
            gender: profileData.gender || '',
            dob: profileData.dob || '',
            company: profileData.company || '',
            country: profileData.country || '',
            activeModule: 'sd',
            notificationsEnabled: false,
            questionNotifEnabled: false,
            questionNotifModule: 'sd',
            questionNotifDifficulty: 'easy',
        }));
        return;
    }

    // Step 1: Create auth account
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
    });
    if (authError) throw authError;

    // Step 2: Create profiles table row with ALL user info
    const userId = authData.user?.id;
    if (userId) {
        const { error: profileError } = await supabase.from('profiles').insert([{
            id: userId,
            email,
            full_name: profileData.fullName || '',
            gender: profileData.gender || '',
            dob: profileData.dob || '',
            company: profileData.company || '',
            country: profileData.country || '',
            active_module: 'sd',
            notifications_enabled: false,
            question_notif_enabled: false,
            question_notif_module: 'sd',
            question_notif_difficulty: 'easy',
        }]);
        if (profileError) throw profileError;
    }
}

// ============================================================================
// SIGN IN
// ============================================================================

export async function signIn(email, password) {
    if (useLocal) {
        const userData = localStorage.getItem('user_' + email);
        if (!userData) throw new Error('User not found');
        return JSON.parse(userData);
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
}

// ============================================================================
// SIGN OUT
// ============================================================================

export async function signOut() {
    if (useLocal) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

// ============================================================================
// SIGN IN WITH GOOGLE
// ============================================================================

export async function signInWithGoogle() {
    if (useLocal) throw new Error('Google sign-in requires Supabase to be configured');
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
    });
    if (error) throw error;
}

// ============================================================================
// GET CURRENT USER — Retrieves current session + profile data
// ============================================================================

export async function getCurrentUser() {
    if (useLocal) return null;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data: profileRow } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
        .catch(() => ({ data: null }));

    return normalizeProfile(session.user, profileRow);
}

// ============================================================================
// SUBSCRIBE TO AUTH CHANGES — Listens for sign-in, sign-out, token refresh
// ============================================================================

export function subscribeAuthChanges(callback) {
    if (useLocal) return () => {};

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT' || !session?.user) {
            callback(null);
            return;
        }

        const { data: profileRow } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            .catch(() => ({ data: null }));

        callback(normalizeProfile(session.user, profileRow));
    });

    return () => subscription?.unsubscribe();
}

// ============================================================================
// UPDATE PROFILE — Updates user profile data
// ============================================================================

export async function updateProfile(userId, updates) {
    if (useLocal) {
        return;
    }

    // Map app field names to database column names
    const dbUpdates = {
        full_name: updates.fullName,
        gender: updates.gender,
        dob: updates.dob,
        company: updates.company,
        country: updates.country,
        active_module: updates.activeModule,
        notifications_enabled: updates.notificationsEnabled,
        question_notif_enabled: updates.questionNotifEnabled,
        question_notif_module: updates.questionNotifModule,
        question_notif_difficulty: updates.questionNotifDifficulty,
    };

    // Remove undefined values
    Object.keys(dbUpdates).forEach(key => dbUpdates[key] === undefined && delete dbUpdates[key]);

    const { error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', userId);
    if (error) throw error;
}

// ============================================================================
// CHANGE PASSWORD
// ============================================================================

export async function changePassword(newPassword) {
    if (useLocal) throw new Error('Password change not available in local mode');
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
}

// ============================================================================
// SAVE QUIZ RESULT
// ============================================================================

export async function saveResult(userId, module, section, score, total) {
    if (useLocal) return;
    const { error } = await supabase.from('quiz_results').insert([{
        user_id: userId,
        module,
        section,
        score,
        total,
        timestamp: new Date(),
    }]);
    if (error) throw error;
}

// ============================================================================
// GET QUIZ RESULTS
// ============================================================================

export async function getResults(userId) {
    if (useLocal) return [];
    const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', userId);
    if (error) throw error;
    return data || [];
}

// ============================================================================
// SAVE FEEDBACK
// ============================================================================

export async function saveFeedback(userId, module, section, feedbackText) {
    if (useLocal) return;
    const { error } = await supabase.from('feedback').insert([{
        user_id: userId,
        module,
        section,
        feedback_text: feedbackText,
        timestamp: new Date(),
    }]);
    if (error) throw error;
}

// ============================================================================
// ADMIN FUNCTIONS
// ============================================================================

export async function checkIsAdmin(userId) {
    if (useLocal) return false;
    // PIN-based auth is sufficient for this implementation
    return true;
}

export async function adminGetAllUsers() {
    if (useLocal) return [];
    const { data, error } = await supabase
        .from('profiles')
        .select('id,email,full_name,gender,dob,company,country,active_module,question_notif_enabled');
    if (error) throw error;
    return data || [];
}

export async function adminGetAllResults() {
    if (useLocal) return [];
    const { data, error } = await supabase
        .from('quiz_results')
        .select('*');
    if (error) throw error;
    // Fetch user emails separately
    const usersData = await supabase.from('profiles').select('id,email');
    const userMap = {};
    usersData.data?.forEach(u => { userMap[u.id] = u.email; });
    return data?.map(r => ({ ...r, user_email: userMap[r.user_id] || 'Unknown' })) || [];
}

export async function adminGetAllFeedback() {
    if (useLocal) return [];
    const { data, error } = await supabase
        .from('feedback')
        .select('*');
    if (error) throw error;
    // Fetch user emails separately
    const usersData = await supabase.from('profiles').select('id,email');
    const userMap = {};
    usersData.data?.forEach(u => { userMap[u.id] = u.email; });
    return data?.map(f => ({ ...f, user_email: userMap[f.user_id] || 'Unknown' })) || [];
}

// ============================================================================
// UTILITY
// ============================================================================

export function isLocalMode() {
    return useLocal;
}
