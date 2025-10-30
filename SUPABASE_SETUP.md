# 🚀 Supabase Setup Guide

## ✅ Connection Status
Your Supabase connection is configured and working!
- **URL**: `https://srbvekhupzoajedpyepr.supabase.co`
- **Status**: ✅ Connected

---

## 📋 Setup Steps

### Step 1: Create Database Tables

You have **2 options** to create the tables:

#### Option A: Supabase Dashboard (Easiest) ⭐

1. **Open the SQL Editor**:
   ```
   https://supabase.com/dashboard/project/srbvekhupzoajedpyepr/sql/new
   ```

2. **Copy the migration SQL**:
   - Open file: `supabase/migrations/001_create_curriculum_tables.sql`
   - Copy all the SQL code

3. **Paste and Run**:
   - Paste into the SQL Editor
   - Click "Run" button
   - You should see: ✅ Success

#### Option B: Supabase CLI

```bash
# 1. Install Supabase CLI
npm install -g supabase

# 2. Link your project
supabase link --project-ref srbvekhupzoajedpyepr

# 3. Push migrations
supabase db push
```

---

### Step 2: Verify Tables Created

Run the connection test:

```bash
npx tsx scripts/test-supabase-connection.ts
```

You should see:
```
✅ Connection successful!
📊 Checking tables...
   Modules: 0 found
   Lessons: 0 found
   Items: 0 found
```

---

### Step 3: Migrate Curriculum Data

Once tables are created, populate them with your curriculum data:

```bash
npx tsx scripts/migrate-to-supabase.ts
```

This will:
- ✅ Load curriculum data from `curriculum-data.json`
- ✅ Insert modules (12+ modules)
- ✅ Insert lessons (10+ lessons)
- ✅ Insert items (100+ quiz questions)

---

## 📚 What Gets Created

### Tables:
1. **modules** - Course modules (Bartending Basics, Tools & Terms, etc.)
2. **lessons** - Individual lessons within modules
3. **items** - Quiz questions (MCQ, Order, Match, etc.)

### Features:
- ✅ Row Level Security (RLS) enabled
- ✅ Public read access for curriculum data
- ✅ Automatic timestamps (created_at, updated_at)
- ✅ Indexes for fast queries
- ✅ Foreign key constraints

---

## 🔧 Using Supabase in Your App

### Reading Data

```typescript
import { supabase } from '@/lib/supabase';

// Get all modules
const { data: modules, error } = await supabase
  .from('modules')
  .select('*')
  .order('chapter_index');

// Get lessons for a module
const { data: lessons } = await supabase
  .from('lessons')
  .select('*')
  .eq('module_id', 'ch1-basics');

// Get items for a lesson
const { data: items } = await supabase
  .from('items')
  .select('*')
  .in('id', lessonItemIds);
```

### Authentication Integration

Supabase Auth can work alongside Firebase Auth:

```typescript
// Sign up with Supabase
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password',
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure-password',
});

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

---

## 📊 Database Schema

### modules
```sql
- id (TEXT PRIMARY KEY)
- title (TEXT)
- chapter_index (INTEGER)
- description (TEXT)
- prerequisite_ids (TEXT[])
- estimated_minutes (INTEGER)
- tags (TEXT[])
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

### lessons
```sql
- id (TEXT PRIMARY KEY)
- module_id (TEXT) → references modules(id)
- title (TEXT)
- item_ids (TEXT[])
- estimated_minutes (INTEGER)
- prerequisite_ids (TEXT[])
- types (TEXT[])
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

### items
```sql
- id (TEXT PRIMARY KEY)
- type (TEXT) - mcq, order, match, checkbox, short
- prompt (TEXT)
- options (TEXT[])
- answer_index (INTEGER)
- order_target (TEXT[])
- answer_text (TEXT)
- acceptable_answers (TEXT[])
- correct (TEXT[])
- pairs (JSONB)
- roleplay (JSONB)
- tags (TEXT[])
- concept_id (TEXT)
- difficulty (NUMERIC)
- xp_award (INTEGER)
- review_weight (NUMERIC)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

---

## 🎯 Next Steps

1. ✅ **Create tables** (use Option A or B above)
2. ✅ **Test connection** (`npx tsx scripts/test-supabase-connection.ts`)
3. ✅ **Migrate data** (`npx tsx scripts/migrate-to-supabase.ts`)
4. 🚀 **Start using Supabase in your app!**

---

## 🔐 Security Notes

- ✅ Anonymous key is safe for client-side use
- ✅ Row Level Security (RLS) is enabled
- ✅ Public tables allow read-only access
- 🔒 For write operations, you'll need auth policies

---

## 📝 Useful Scripts

```bash
# Test connection
npx tsx scripts/test-supabase-connection.ts

# Migrate data
npx tsx scripts/migrate-to-supabase.ts

# Run migrations (shows instructions)
npx tsx scripts/run-migrations.ts
```

---

## 🆘 Troubleshooting

### "Table not found" error
→ Run migrations first (Step 1)

### "Permission denied" error
→ Check RLS policies in Supabase dashboard

### "Invalid API key" error
→ Verify EXPO_PUBLIC_SUPABASE_ANON_KEY in .env

---

## 🎉 You're All Set!

Your Supabase configuration is ready. Follow the steps above to create tables and start using it!

Need help? Check the [Supabase Documentation](https://supabase.com/docs)
