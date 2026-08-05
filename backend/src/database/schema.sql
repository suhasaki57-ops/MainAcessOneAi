-- ======================================================
-- ASCESS-1-AI DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- SINGLE CONSOLIDATED SCHEMA FILE
-- ======================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ======================================================
-- 1. USERS TABLE
-- ======================================================
CREATE TABLE IF NOT EXISTS public."Users" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    preferences JSONB DEFAULT '{"theme": "dark", "highContrast": false, "ttsSpeed": 1.0, "fontSize": "medium"}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for Users
CREATE INDEX IF NOT EXISTS idx_users_email ON public."Users"(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public."Users"(role);

-- ======================================================
-- 2. DOCUMENTS TABLE
-- ======================================================
CREATE TABLE IF NOT EXISTS public."Documents" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public."Users"(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    extracted_text TEXT,
    ocr_status VARCHAR(20) DEFAULT 'pending' CHECK (ocr_status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for Documents
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public."Documents"(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_ocr_status ON public."Documents"(ocr_status);

-- ======================================================
-- 3. ACCESSIBILITY REPORTS TABLE
-- ======================================================
CREATE TABLE IF NOT EXISTS public."AccessibilityReports" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public."Users"(id) ON DELETE CASCADE,
    document_id UUID REFERENCES public."Documents"(id) ON DELETE SET NULL,
    url VARCHAR(2048),
    score NUMERIC(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
    contrast_issues INT DEFAULT 0,
    aria_issues INT DEFAULT 0,
    readability_issues INT DEFAULT 0,
    structure_issues INT DEFAULT 0,
    report_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for AccessibilityReports
CREATE INDEX IF NOT EXISTS idx_accessibility_user_id ON public."AccessibilityReports"(user_id);
CREATE INDEX IF NOT EXISTS idx_accessibility_doc_id ON public."AccessibilityReports"(document_id);

-- ======================================================
-- 4. TRANSLATIONS TABLE
-- ======================================================
CREATE TABLE IF NOT EXISTS public."Translations" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public."Users"(id) ON DELETE CASCADE,
    source_language VARCHAR(10) NOT NULL,
    target_language VARCHAR(10) NOT NULL,
    original_text TEXT NOT NULL,
    translated_text TEXT NOT NULL,
    confidence_score NUMERIC(4,3) DEFAULT 1.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for Translations
CREATE INDEX IF NOT EXISTS idx_translations_user_id ON public."Translations"(user_id);

-- ======================================================
-- 5. AI HISTORY TABLE
-- ======================================================
CREATE TABLE IF NOT EXISTS public."AIHistory" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public."Users"(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    feature_type VARCHAR(50) NOT NULL CHECK (feature_type IN ('chat', 'summarization', 'ocr_analysis', 'accessibility_fix', 'speech_translation')),
    tokens_used INT DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for AIHistory
CREATE INDEX IF NOT EXISTS idx_ai_history_user_id ON public."AIHistory"(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_history_feature ON public."AIHistory"(feature_type);

-- ======================================================
-- 6. SETTINGS TABLE
-- ======================================================
CREATE TABLE IF NOT EXISTS public."Settings" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public."Users"(id) ON DELETE CASCADE,
    screen_reader_enabled BOOLEAN DEFAULT false,
    auto_translate BOOLEAN DEFAULT false,
    preferred_voice VARCHAR(50) DEFAULT 'en-US-Standard-A',
    voice_rate NUMERIC(3,2) DEFAULT 1.0,
    voice_pitch NUMERIC(3,2) DEFAULT 1.0,
    ai_model VARCHAR(50) DEFAULT 'gemini-1.5-pro',
    notifications_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for Settings
CREATE INDEX IF NOT EXISTS idx_settings_user_id ON public."Settings"(user_id);

-- ======================================================
-- 7. ACTIVITY LOGS TABLE
-- ======================================================
CREATE TABLE IF NOT EXISTS public."ActivityLogs" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public."Users"(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for ActivityLogs
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public."ActivityLogs"(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON public."ActivityLogs"(action);

-- ======================================================
-- AUTO UPDATE TIMESTAMPS TRIGGER FUNCTION
-- ======================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for all tables
CREATE OR REPLACE TRIGGER set_updated_at_users BEFORE UPDATE ON public."Users" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER set_updated_at_documents BEFORE UPDATE ON public."Documents" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER set_updated_at_accessibility BEFORE UPDATE ON public."AccessibilityReports" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER set_updated_at_translations BEFORE UPDATE ON public."Translations" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER set_updated_at_ai BEFORE UPDATE ON public."AIHistory" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER set_updated_at_settings BEFORE UPDATE ON public."Settings" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER set_updated_at_logs BEFORE UPDATE ON public."ActivityLogs" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ======================================================
-- ROW LEVEL SECURITY (RLS) READY
-- ======================================================
ALTER TABLE public."Users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Documents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."AccessibilityReports" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Translations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."AIHistory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ActivityLogs" ENABLE ROW LEVEL SECURITY;
