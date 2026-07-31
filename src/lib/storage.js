import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEY = 'sapSDHubV3';
const useLocal = process.env.REACT_APP_USE_LOCAL_STORAGE === 'true' || !isSupabaseConfigured();

function getLocal() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"users":[],"results":[],"feedback":[]}');
}
function saveLocal(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ---- Auth ----
export async function signUp({ email, password, fullName, gender, dob, company, country }) {
    if (useLocal) {
        const data = getLocal();
        if (data.users.find(u => u.email === email)) throw new Error('Email already registered');
        const user = { id: Date.now().toString(), email, fullName, gender, dob, company, country, password, notificationsEnabled: false, questionNotifEnabled: false, questionNotifModule: 'SAP SD', questionNotifDifficulty: 'easy' };
        data.users.push(user);
        saveLocal(data);
        return user;
    }
    const { data: authData, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id, full_name: fullName, gender, dob, company, country, email,
        notifications_enabled: false, question_notif_enabled: false, question_notif_module: 'SAP SD', question_notif_difficulty: 'easy'
    });
    if (profileError) throw profileError;
    return { id: authData.user.id, email, fullName, gender, dob, company, country, notificationsEnabled: false, questionNotifEnabled: false, questionNotifModule: 'SAP SD', questionNotifDifficulty: 'easy' };
}

export async function signIn({ email, password }) {
    if (useLocal) {
        const data = getLocal();
        const user = data.users.find(u => u.email === email && u.password === password);
        if (!user) throw new Error('Invalid email or password');
        return {
            notificationsEnabled: false, questionNotifEnabled: false, questionNotifModule: 'SAP SD', questionNotifDifficulty: 'easy',
            ...user
        };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
    return {
        id: data.user.id, email, fullName: profile?.full_name, gender: profile?.gender, dob: profile?.dob,
        company: profile?.company, country: profile?.country,
        notificationsEnabled: profile?.notifications_enabled ?? false,
        questionNotifEnabled: profile?.question_notif_enabled ?? false,
        questionNotifModule: profile?.question_notif_module || 'SAP SD',
        questionNotifDifficulty: profile?.question_notif_difficulty || 'easy',
    };
}

export async function signOut() {
    if (!useLocal && supabase) await supabase.auth.signOut();
}

// ---- Profile ----
export async function getProfile(userId) {
    if (useLocal) {
        const data = getLocal();
        return data.users.find(u => u.id === userId) || null;
    }
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    return data;
}

export async function updateProfile(userId, updates) {
    if (useLocal) {
        const data = getLocal();
        const idx = data.users.findIndex(u => u.id === userId);
        if (idx >= 0) { Object.assign(data.users[idx], updates); saveLocal(data); }
        return;
    }
    const payload = {};
    if (updates.fullName !== undefined) payload.full_name = updates.fullName;
    if (updates.company !== undefined) payload.company = updates.company;
    if (updates.country !== undefined) payload.country = updates.country;
    if (updates.notificationsEnabled !== undefined) payload.notifications_enabled = updates.notificationsEnabled;
    if (updates.questionNotifEnabled !== undefined) payload.question_notif_enabled = updates.questionNotifEnabled;
    if (updates.questionNotifModule !== undefined) payload.question_notif_module = updates.questionNotifModule;
    if (updates.questionNotifDifficulty !== undefined) payload.question_notif_difficulty = updates.questionNotifDifficulty;
    await supabase.from('profiles').update(payload).eq('id', userId);
}

export async function changePassword(newPassword, currentPassword) {
    if (useLocal) {
        return; // localStorage version doesn't enforce password
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
}

// ---- Results ----
export async function saveResult({ userId, sectionId, level, score, total, percentage, answers }) {
    if (useLocal) {
        const data = getLocal();
        data.results.push({ id: Date.now().toString(), userId, sectionId, level, score, total, percentage, answers, createdAt: new Date().toISOString() });
        saveLocal(data);
        return;
    }
    await supabase.from('quiz_results').insert({ user_id: userId, section_id: sectionId, level, score, total, percentage, answers });
}

export async function getResults(userId, sectionId) {
    if (useLocal) {
        const data = getLocal();
        return data.results.filter(r => r.userId === userId && (!sectionId || r.sectionId === sectionId));
    }
    let query = supabase.from('quiz_results').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (sectionId) query = query.eq('section_id', sectionId);
    const { data } = await query;
    return data || [];
}

// ---- Feedback ----
export async function saveFeedback({ userId, sectionId, difficulty, clarity, suggestion }) {
    if (useLocal) {
        const data = getLocal();
        data.feedback.push({ id: Date.now().toString(), userId, sectionId, difficulty, clarity, suggestion, createdAt: new Date().toISOString() });
        saveLocal(data);
        return;
    }
    await supabase.from('feedback').insert({ user_id: userId, section_id: sectionId, difficulty, clarity, suggestion });
}

// ---- Admin ----
// These rely on the current logged-in session. Supabase RLS only returns
// cross-user rows if that session's profile has is_admin = true (see
// supabase/admin-migration.sql). A non-admin calling these simply gets
// their own row back — RLS enforces this at the database level, not here.
export const isLocalMode = useLocal;

// Real authorization check — the PIN alone is just a UI gate. This confirms
// the CURRENT logged-in user actually has is_admin = true in the database.
// Every user can read their own profile row (base RLS policy), so this
// works regardless of the admin-only cross-user policies.
export async function checkIsAdmin(userId) {
    if (useLocal) {
        // No real admin concept in localStorage mode — treat as admin so
        // the console is usable for local testing.
        return true;
    }
    const { data, error } = await supabase.from('profiles').select('is_admin').eq('id', userId).single();
    if (error) return false;
    return data?.is_admin === true;
}

export async function adminGetAllUsers() {
    if (useLocal) {
        const data = getLocal();
        return data.users || [];
    }
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(u => ({ id: u.id, fullName: u.full_name, email: u.email, company: u.company, country: u.country, createdAt: u.created_at }));
}

export async function adminGetAllResults() {
    if (useLocal) {
        const data = getLocal();
        return data.results || [];
    }
    const { data, error } = await supabase.from('quiz_results').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(r => ({ userId: r.user_id, sectionId: r.section_id, level: r.level, score: r.score, total: r.total, percentage: r.percentage, createdAt: r.created_at }));
}

export async function adminGetAllFeedback() {
    if (useLocal) {
        const data = getLocal();
        return data.feedback || [];
    }
    const { data, error } = await supabase.from('feedback').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(f => ({ userId: f.user_id, sectionId: f.section_id, difficulty: f.difficulty, clarity: f.clarity, suggestion: f.suggestion, createdAt: f.created_at }));
}
