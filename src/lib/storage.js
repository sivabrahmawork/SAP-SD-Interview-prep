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
        const user = { id: Date.now().toString(), email, fullName, gender, dob, company, country };
        data.users.push(user);
        saveLocal(data);
        return user;
    }
    const { data: authData, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id, full_name: fullName, gender, dob, company, country, email
    });
    if (profileError) throw profileError;
    return { id: authData.user.id, email, fullName };
}

export async function signIn({ email, password }) {
    if (useLocal) {
        const data = getLocal();
        const user = data.users.find(u => u.email === email);
        if (!user) throw new Error('User not found');
        return user;
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
    return { id: data.user.id, email, fullName: profile?.full_name || email };
}

export async function signOut() {
    if (!useLocal && supabase) await supabase.auth.signOut();
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
