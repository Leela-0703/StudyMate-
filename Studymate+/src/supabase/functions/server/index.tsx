import { Hono } from "npm:hono"
import { cors } from "npm:hono/cors"
import { logger } from "npm:hono/logger"
import { createClient } from "npm:@supabase/supabase-js"
import * as kv from './kv_store.tsx'

const app = new Hono()

// Middleware
app.use('*', logger(console.log))
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// Create storage buckets on startup
const initializeStorage = async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketName = 'make-0825aea1-studymate-files'
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName)
    
    if (!bucketExists) {
      console.log('Creating storage bucket...')
      await supabase.storage.createBucket(bucketName, { public: false })
      console.log('Storage bucket created successfully')
    }
  } catch (error) {
    console.log('Error initializing storage:', error)
  }
}

initializeStorage()

// Auth middleware for protected routes
const requireAuth = async (c: any, next: any) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1]
  if (!accessToken) {
    return c.json({ error: 'No authorization token provided' }, 401)
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (error || !user?.id) {
      return c.json({ error: 'Invalid or expired token' }, 401)
    }
    c.set('userId', user.id)
    c.set('user', user)
    await next()
  } catch (error) {
    console.log('Auth error:', error)
    return c.json({ error: 'Authentication failed' }, 401)
  }
}

// User signup
app.post('/make-server-0825aea1/auth/signup', async (c) => {
  try {
    const { email, password, name, avatar } = await c.req.json()
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, avatar },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    })

    if (error) {
      console.log('Signup error:', error)
      return c.json({ error: error.message }, 400)
    }

    // Initialize user profile data
    await kv.set(`user:${data.user.id}:profile`, {
      id: data.user.id,
      email,
      name,
      avatar,
      studyStreak: 0,
      totalPoints: 0,
      weeklyProgress: 0,
      lastStudyDate: null,
      achievements: [],
      createdAt: new Date().toISOString()
    })

    return c.json({ user: data.user, message: 'User created successfully' })
  } catch (error) {
    console.log('Signup error:', error)
    return c.json({ error: 'Internal server error during signup' }, 500)
  }
})

// Get user profile
app.get('/make-server-0825aea1/users/profile', requireAuth, async (c) => {
  try {
    const userId = c.get('userId')
    const profile = await kv.get(`user:${userId}:profile`)
    
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404)
    }

    return c.json({ profile })
  } catch (error) {
    console.log('Error fetching profile:', error)
    return c.json({ error: 'Failed to fetch profile' }, 500)
  }
})

// Update user profile
app.put('/make-server-0825aea1/users/profile', requireAuth, async (c) => {
  try {
    const userId = c.get('userId')
    const updates = await c.req.json()
    
    const existingProfile = await kv.get(`user:${userId}:profile`) || {}
    const updatedProfile = { ...existingProfile, ...updates, updatedAt: new Date().toISOString() }
    
    await kv.set(`user:${userId}:profile`, updatedProfile)
    
    return c.json({ profile: updatedProfile })
  } catch (error) {
    console.log('Error updating profile:', error)
    return c.json({ error: 'Failed to update profile' }, 500)
  }
})

// Update study streak
app.post('/make-server-0825aea1/users/study-session', requireAuth, async (c) => {
  try {
    const userId = c.get('userId')
    const profile = await kv.get(`user:${userId}:profile`) || {}
    
    const today = new Date().toISOString().split('T')[0]
    const lastStudyDate = profile.lastStudyDate
    
    let studyStreak = profile.studyStreak || 0
    
    if (lastStudyDate !== today) {
      if (lastStudyDate) {
        const lastDate = new Date(lastStudyDate)
        const currentDate = new Date(today)
        const dayDiff = (currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24)
        
        if (dayDiff === 1) {
          studyStreak++
        } else if (dayDiff > 1) {
          studyStreak = 1
        }
      } else {
        studyStreak = 1
      }
      
      const updatedProfile = {
        ...profile,
        studyStreak,
        lastStudyDate: today,
        totalPoints: (profile.totalPoints || 0) + 10,
        updatedAt: new Date().toISOString()
      }
      
      await kv.set(`user:${userId}:profile`, updatedProfile)
      return c.json({ profile: updatedProfile })
    }
    
    return c.json({ profile })
  } catch (error) {
    console.log('Error updating study session:', error)
    return c.json({ error: 'Failed to update study session' }, 500)
  }
})

// Save summary
app.post('/make-server-0825aea1/summaries', requireAuth, async (c) => {
  try {
    const userId = c.get('userId')
    const { topic, content, summaryType, language, summary } = await c.req.json()
    
    const summaryData = {
      id: crypto.randomUUID(),
      userId,
      topic,
      content: content?.slice(0, 500), // Store first 500 chars of original content
      summaryType,
      language,
      summary,
      createdAt: new Date().toISOString()
    }
    
    await kv.set(`user:${userId}:summary:${summaryData.id}`, summaryData)
    
    return c.json({ summary: summaryData })
  } catch (error) {
    console.log('Error saving summary:', error)
    return c.json({ error: 'Failed to save summary' }, 500)
  }
})

// Get user summaries
app.get('/make-server-0825aea1/summaries', requireAuth, async (c) => {
  try {
    const userId = c.get('userId')
    const summaries = await kv.getByPrefix(`user:${userId}:summary:`)
    
    return c.json({ summaries: summaries.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )})
  } catch (error) {
    console.log('Error fetching summaries:', error)
    return c.json({ error: 'Failed to fetch summaries' }, 500)
  }
})

// Save quiz result
app.post('/make-server-0825aea1/quiz-results', requireAuth, async (c) => {
  try {
    const userId = c.get('userId')
    const { topic, questions, answers, score } = await c.req.json()
    
    const quizResult = {
      id: crypto.randomUUID(),
      userId,
      topic,
      questionsCount: questions.length,
      correctAnswers: score.correct,
      totalQuestions: score.total,
      percentage: score.percentage,
      answers,
      createdAt: new Date().toISOString()
    }
    
    await kv.set(`user:${userId}:quiz:${quizResult.id}`, quizResult)
    
    // Update user points
    const profile = await kv.get(`user:${userId}:profile`) || {}
    const pointsEarned = score.correct * 10
    const updatedProfile = {
      ...profile,
      totalPoints: (profile.totalPoints || 0) + pointsEarned,
      updatedAt: new Date().toISOString()
    }
    await kv.set(`user:${userId}:profile`, updatedProfile)
    
    return c.json({ quizResult, pointsEarned })
  } catch (error) {
    console.log('Error saving quiz result:', error)
    return c.json({ error: 'Failed to save quiz result' }, 500)
  }
})

// Get user quiz results
app.get('/make-server-0825aea1/quiz-results', requireAuth, async (c) => {
  try {
    const userId = c.get('userId')
    const quizResults = await kv.getByPrefix(`user:${userId}:quiz:`)
    
    return c.json({ quizResults: quizResults.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )})
  } catch (error) {
    console.log('Error fetching quiz results:', error)
    return c.json({ error: 'Failed to fetch quiz results' }, 500)
  }
})

// File upload endpoint
app.post('/make-server-0825aea1/upload', requireAuth, async (c) => {
  try {
    const userId = c.get('userId')
    const formData = await c.req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400)
    }
    
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${crypto.randomUUID()}.${fileExt}`
    const bucketName = 'make-0825aea1-studymate-files'
    
    const fileBuffer = await file.arrayBuffer()
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType: file.type,
      })
    
    if (error) {
      console.log('File upload error:', error)
      return c.json({ error: 'Failed to upload file' }, 500)
    }
    
    // Get signed URL for the file
    const { data: signedUrlData } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 3600) // 1 hour expiry
    
    return c.json({ 
      fileName: file.name,
      filePath: data.path,
      signedUrl: signedUrlData?.signedUrl 
    })
  } catch (error) {
    console.log('Upload error:', error)
    return c.json({ error: 'Internal server error during file upload' }, 500)
  }
})

// Get user activity/history
app.get('/make-server-0825aea1/activity', requireAuth, async (c) => {
  try {
    const userId = c.get('userId')
    
    // Get recent summaries and quiz results
    const summaries = await kv.getByPrefix(`user:${userId}:summary:`)
    const quizResults = await kv.getByPrefix(`user:${userId}:quiz:`)
    
    const activity = [
      ...summaries.map(s => ({ type: 'summary', title: `${s.topic} Summary`, time: s.createdAt, data: s })),
      ...quizResults.map(q => ({ type: 'quiz', title: `${q.topic} Quiz`, time: q.createdAt, score: `${q.percentage}%`, data: q }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10)
    
    return c.json({ activity })
  } catch (error) {
    console.log('Error fetching activity:', error)
    return c.json({ error: 'Failed to fetch activity' }, 500)
  }
})

// Health check
app.get('/make-server-0825aea1/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

Deno.serve(app.fetch)