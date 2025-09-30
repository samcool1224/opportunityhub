import { supabase } from './supabase'

export interface StudentData {
  id: string
  first_name: string
  last_name: string
  email: string
  highoru?: 'high school' | 'university'
  university?: string
  major?: string
  year?: string
  gpa?: string
  bio?: string
  skills?: string[]
  interests?: string[]
  portfolio_url?: string
  portfolio_filename?: string
  email_confirmed?: boolean
  created_at?: string
  links?: {
    linkedin?: string
    personal_website?: string
    google_scholar?: string
    github?: string
    researchgate?: string
    [key: string]: string | undefined
  }
}

export interface ProfessorData {
  id: string
  title?: string
  first_name: string
  last_name: string
  email: string
  institution?: string
  department?: string
  position?: string
  bio?: string
  website?: string
  orcid?: string
  publications?: string
  research_areas?: string[]
  verification_doc_url?: string
  verification_doc_filename?: string
  approved?: boolean
  email_confirmed?: boolean
  created_at?: string
}

// File upload function
export const uploadFile = async (file: File, userId: string, folder: string): Promise<{ url: string; filename: string } | null> => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${folder}/${Date.now()}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('user_files')
      .upload(fileName, file)

    if (error) {
      console.error('Error uploading file:', error)
      return null
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('user_files')
      .getPublicUrl(fileName)

    return {
      url: publicUrl,
      filename: file.name
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    return null
  }
}

// Student database operations
export const createStudentProfile = async (studentData: Omit<StudentData, 'id'>, userId: string): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('students')
      .insert({
        id: userId,
        ...studentData
      })

    return { error }
  } catch (error) {
    return { error }
  }
}

export const updateStudentProfile = async (studentData: Partial<StudentData>, userId: string): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('students')
      .update(studentData)
      .eq('id', userId)

    return { error }
  } catch (error) {
    return { error }
  }
}

export const getStudentProfile = async (userId: string): Promise<{ data: StudentData | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', userId)
      .single()

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

// Professor database operations
export const createProfessorProfile = async (professorData: Omit<ProfessorData, 'id'>, userId: string): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('professors')
      .insert({
        id: userId,
        approved: false,
        ...professorData
      })

    return { error }
  } catch (error) {
    return { error }
  }
}

export const updateProfessorProfile = async (professorData: Partial<ProfessorData>, userId: string): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('professors')
      .update(professorData)
      .eq('id', userId)

    return { error }
  } catch (error) {
    return { error }
  }
}

export const getProfessorProfile = async (userId: string): Promise<{ data: ProfessorData | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('professors')
      .select('*')
      .eq('id', userId)
      .single()

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

// Get all professors (for students to browse)
export const getAllProfessors = async (): Promise<{ data: ProfessorData[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('professors')
      .select('*')
      .order('created_at', { ascending: false })

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

// Get all students (for professors to browse)
export const getAllStudents = async (): Promise<{ data: StudentData[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false })

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

// Opportunities
export interface OpportunityData {
  id?: string
  professor_id: string
  title: string
  description: string
  tags?: string[]
  location?: string
  duration?: string
  compensation?: string
  type?: 'Remote' | 'On-site' | 'Hybrid'
  status?: 'Open' | 'Closed'
  applicants?: number
  applicant_cap?: number | null
  cap_reached_at?: string | null
  cap_reached_date?: string | null
  application_deadline?: string
  opportunity_link?: string
  app_link?: string
  created_at?: string
  professors?: {
    id?: string
    first_name?: string
    last_name?: string
    institution?: string
    department?: string
    bio?: string
  }
}

export const createOpportunity = async (opportunity: OpportunityData) => {
  try {
    const { error } = await supabase
      .from('opportunities')
      .insert({
        professor_id: opportunity.professor_id,
        title: opportunity.title,
        description: opportunity.description,
        tags: opportunity.tags || [],
        location: opportunity.location,
        duration: opportunity.duration,
        compensation: opportunity.compensation,
        type: opportunity.type || 'Remote',
        status: opportunity.status || 'Open',
        applicants: opportunity.applicants ?? 0,
        applicant_cap: opportunity.applicant_cap || null,
        application_deadline: opportunity.application_deadline,
        opportunity_link: opportunity.opportunity_link,
        app_link: opportunity.app_link || null
      })
    return { error }
  } catch (error) {
    return { error }
  }
}

export const getAllOpportunities = async () => {
  try {
    const { data, error } = await supabase
      .from('opportunities')
      .select(`
        *,
        professors:professor_id (
          first_name,
          last_name,
          institution,
          department,
          bio
        )
      `)
      .order('created_at', { ascending: false })

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

// Applications
export interface ApplicationData {
  id?: string
  opportunity_id: string
  student_id: string
  professor_id: string
  status?: 'submitted' | 'under_review' | 'accepted' | 'rejected'
  message?: string
  portfolio_url?: string
  created_at?: string
  updated_at?: string
}

export const applyToOpportunity = async (params: {
  opportunityId: string
  studentId: string
  professorId: string
  message?: string
}) => {
  try {
    // Check daily application limit for student
    const { data: dailyLimitCheck, error: limitError } = await supabase
      .rpc('check_daily_application_limit', { student_id_param: params.studentId })

    if (limitError) {
      return { error: { message: 'Error checking daily application limit' } }
    }

    if (!dailyLimitCheck) {
      return { error: { message: 'You have reached your daily application limit of 5 applications. Please try again tomorrow.' } }
    }

    // Check if student has already applied to this opportunity
    const { data: existingApplication, error: checkError } = await supabase
      .from('applications')
      .select('id')
      .eq('opportunity_id', params.opportunityId)
      .eq('student_id', params.studentId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      return { error: checkError }
    }

    if (existingApplication) {
      return { error: { message: 'You have already applied to this opportunity' } }
    }

    // Check if opportunity has reached its applicant cap
    const { data: opportunity, error: oppError } = await supabase
      .from('opportunities')
      .select('applicant_cap, cap_reached_at')
      .eq('id', params.opportunityId)
      .single()

    if (oppError) {
      return { error: { message: 'Error checking opportunity status' } }
    }

    if (opportunity.cap_reached_at) {
      return { error: { message: 'This opportunity has reached its applicant cap and is no longer accepting applications' } }
    }

    // Create the application
    const { error } = await supabase
      .from('applications')
      .insert({
        opportunity_id: params.opportunityId,
        student_id: params.studentId,
        professor_id: params.professorId,
        status: 'submitted',
        message: params.message || null,
      })
    return { error }
  } catch (error) {
    return { error }
  }
}

export const getStudentApplications = async (studentId: string) => {
  try {
    console.log('Fetching applications for student:', studentId);
    
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        opportunities:opportunity_id (
          *,
          professors:professor_id (
            first_name,
            last_name,
            institution,
            department,
            title,
            position
          )
        )
      `)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })

    console.log('Applications query result:', { data, error });
    
    if (data) {
      console.log('Sample application structure:', JSON.stringify(data[0], null, 2));
    }

    return { data, error }
  } catch (error) {
    console.error('Error in getStudentApplications:', error);
    return { data: null, error }
  }
}

export const getDailyApplicationCount = async (studentId: string) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('id')
      .eq('student_id', studentId)
      .gte('created_at', new Date().toISOString().split('T')[0] + 'T00:00:00')
      .lte('created_at', new Date().toISOString().split('T')[0] + 'T23:59:59')

    if (error) {
      return { count: 0, error }
    }

    return { count: data?.length || 0, error: null }
  } catch (error) {
    return { count: 0, error }
  }
}

export const getProfessorApplications = async (professorId: string): Promise<{ data: ApplicationData[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        students:student_id (*),
        opportunities:opportunity_id (*)
      `)
      .eq('professor_id', professorId)
      .order('created_at', { ascending: false })
    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

export const updateApplicationStatus = async (applicationId: string, status: 'under_review' | 'accepted' | 'rejected'): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', applicationId)
    return { error }
  } catch (error) {
    return { error }
  }
}

// Notifications
export interface NotificationData {
  id?: string
  user_id: string
  title: string
  body?: string
  data?: Record<string, any>
  read_at?: string | null
  created_at?: string
}

export const createNotification = async (notification: NotificationData): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: notification.user_id,
        title: notification.title,
        body: notification.body || null,
        data: notification.data || null,
      })
    return { error }
  } catch (error) {
    return { error }
  }
}

export const getNotifications = async (userId: string): Promise<{ data: NotificationData[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data: data as NotificationData[] | null, error }
  } catch (error) {
    return { data: null, error }
  }
}

export const markNotificationRead = async (id: string): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', id)
    return { error }
  } catch (error) {
    return { error }
  }
}