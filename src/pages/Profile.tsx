import { useEffect, useState } from 'react'
import { Layout } from '@/components/Layout'
import { EnhancedCard } from '@/components/EnhancedCard'
import { EnhancedButton } from '@/components/EnhancedButton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getStudentProfile, updateStudentProfile, getProfessorProfile, updateProfessorProfile } from '@/lib/database'

const Profile = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const role = user?.user_metadata?.role as 'student' | 'professor' | undefined
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState<any>({})

  useEffect(() => {
    const load = async () => {
      if (!user || !role) { setLoading(false); return }
      setLoading(true)
      setError('')
      try {
        if (role === 'student') {
          const { data, error } = await getStudentProfile(user.id)
          if (error) setError('Failed to load profile')
          setForm({
            first_name: data?.first_name || '',
            last_name: data?.last_name || '',
            email: data?.email || user.email || '',
            highoru: data?.highoru || '',
            university: data?.university || '',
            major: data?.major || '',
            year: data?.year || '',
            gpa: data?.gpa || '',
            bio: data?.bio || '',
            skills: data?.skills || [],
            interests: data?.interests || [],
            links: data?.links || {},
          })
        } else if (role === 'professor') {
          const { data, error } = await getProfessorProfile(user.id)
          if (error) setError('Failed to load profile')
          setForm({
            title: data?.title || '',
            first_name: data?.first_name || '',
            last_name: data?.last_name || '',
            email: data?.email || user.email || '',
            institution: data?.institution || '',
            department: data?.department || '',
            position: data?.position || '',
            bio: data?.bio || '',
            website: data?.website || '',
            orcid: data?.orcid || '',
            publications: data?.publications || [],
            research_areas: data?.research_areas || [],
          })
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user, role])

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      console.log('Starting logout process from profile...');
      await signOut();
      console.log('Logout successful, navigating to home...');
      navigate('/', { replace: true });
      
      // Fallback: if navigation doesn't work, force page reload
      setTimeout(() => {
        if (window.location.pathname !== '/') {
          console.log('Navigation failed, forcing page reload...');
          window.location.href = '/';
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error during logout:', error);
      navigate('/', { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const save = async () => {
    if (!user || !role) return
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      if (role === 'student') {
        const { error } = await updateStudentProfile({
          first_name: form.first_name,
          last_name: form.last_name,
          highoru: form.highoru,
          university: form.university,
          major: form.major,
          year: form.year,
          gpa: form.gpa,
          bio: form.bio,
          skills: form.skills,
          interests: form.interests,
          links: form.links,
        }, user.id)
        if (error) setError('Failed to save profile')
        else setSuccess('Profile updated successfully')
      } else {
        const { error } = await updateProfessorProfile({
          title: form.title,
          first_name: form.first_name,
          last_name: form.last_name,
          institution: form.institution,
          department: form.department,
          position: form.position,
          bio: form.bio,
          website: form.website,
          orcid: form.orcid,
          publications: form.publications,
          research_areas: form.research_areas,
        }, user.id)
        if (error) setError('Failed to save profile')
        else setSuccess('Profile updated successfully')
      }
    } finally {
      setSaving(false)
    }
  }

  const renderStudent = () => (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>First Name</Label>
          <Input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
        </div>
        <div>
          <Label>Last Name</Label>
          <Input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
        </div>
      </div>
      
      <div>
        <Label>Status</Label>
        <select 
          className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
          value={form.highoru} 
          onChange={(e) => setForm({ ...form, highoru: e.target.value })}
        >
          <option value="">Select your status</option>
          <option value="high school">High School</option>
          <option value="university">University</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>{form.highoru === 'high school' ? 'High School Name' : 'University'}</Label>
          <Input value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} />
        </div>
        {form.highoru === 'university' && (
          <div>
            <Label>Major</Label>
            <Input value={form.major} onChange={(e) => setForm({ ...form, major: e.target.value })} />
          </div>
        )}
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Year</Label>
          {form.highoru === 'high school' ? (
            <select 
              className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
              value={form.year} 
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            >
              <option value="">Select your grade</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 11">Grade 11</option>
              <option value="Grade 12">Grade 12</option>
            </select>
          ) : (
            <Input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
          )}
        </div>
        <div>
          <Label>GPA</Label>
          <Input value={form.gpa} onChange={(e) => setForm({ ...form, gpa: e.target.value })} />
        </div>
      </div>
      <div>
        <Label>Bio</Label>
        <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Skills (comma separated)</Label>
          <Input value={(form.skills || []).join(', ')} onChange={(e) => setForm({ ...form, skills: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean) })} />
        </div>
        <div>
          <Label>Interests (comma separated)</Label>
          <Input value={(form.interests || []).join(', ')} onChange={(e) => setForm({ ...form, interests: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean) })} />
        </div>
      </div>
      
      {/* Links Section */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Important Links</Label>
        <p className="text-sm text-muted-foreground">Add links to your professional profiles and websites</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="linkedin" className="text-sm">LinkedIn</Label>
            <Input 
              id="linkedin"
              type="url"
              placeholder="https://linkedin.com/in/yourprofile"
              value={form.links?.linkedin || ''} 
              onChange={(e) => setForm({ 
                ...form, 
                links: { ...form.links, linkedin: e.target.value }
              })} 
            />
          </div>
          <div>
            <Label htmlFor="personal_website" className="text-sm">Personal Website</Label>
            <Input 
              id="personal_website"
              type="url"
              placeholder="https://yourwebsite.com"
              value={form.links?.personal_website || ''} 
              onChange={(e) => setForm({ 
                ...form, 
                links: { ...form.links, personal_website: e.target.value }
              })} 
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="google_scholar" className="text-sm">Google Scholar</Label>
            <Input 
              id="google_scholar"
              type="url"
              placeholder="https://scholar.google.com/citations?user=..."
              value={form.links?.google_scholar || ''} 
              onChange={(e) => setForm({ 
                ...form, 
                links: { ...form.links, google_scholar: e.target.value }
              })} 
            />
          </div>
          <div>
            <Label htmlFor="github" className="text-sm">GitHub</Label>
            <Input 
              id="github"
              type="url"
              placeholder="https://github.com/username"
              value={form.links?.github || ''} 
              onChange={(e) => setForm({ 
                ...form, 
                links: { ...form.links, github: e.target.value }
              })} 
            />
          </div>
        </div>
        <div>
          <Label htmlFor="researchgate" className="text-sm">ResearchGate</Label>
          <Input 
            id="researchgate"
            type="url"
            placeholder="https://researchgate.net/profile/username"
            value={form.links?.researchgate || ''} 
            onChange={(e) => setForm({ 
              ...form, 
              links: { ...form.links, researchgate: e.target.value }
            })} 
          />
        </div>
      </div>
    </div>
  )

  const renderProfessor = () => (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Title</Label>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>First Name</Label>
          <Input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
        </div>
        <div>
          <Label>Last Name</Label>
          <Input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Institution</Label>
          <Input value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} />
        </div>
        <div>
          <Label>Department</Label>
          <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
        </div>
      </div>
      <div>
        <Label>Position</Label>
        <Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
      </div>
      <div>
        <Label>Bio</Label>
        <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Website</Label>
          <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
        </div>
        <div>
          <Label>ORCID</Label>
          <Input value={form.orcid} onChange={(e) => setForm({ ...form, orcid: e.target.value })} />
        </div>
      </div>
      <div>
        <Label>Publications</Label>
        <Textarea value={form.publications} onChange={(e) => setForm({ ...form, publications: e.target.value })} />
      </div>
      <div>
        <Label>Research Areas (comma separated)</Label>
        <Input value={(form.research_areas || []).join(', ')} onChange={(e) => setForm({ ...form, research_areas: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean) })} />
      </div>
    </div>
  )

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-section py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6">Profile</h1>
          <EnhancedCard variant="glass" className="p-6">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            {loading ? (
              <p className="text-muted-foreground">Loading profile...</p>
            ) : !role ? (
              <p className="text-muted-foreground">Please sign in to view your profile.</p>
            ) : role === 'student' ? (
              renderStudent()
            ) : (
              renderProfessor()
            )}

            <div className="mt-6 flex justify-between items-center">
              <EnhancedButton 
                variant="glass" 
                onClick={handleLogout} 
                disabled={isLoggingOut}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </EnhancedButton>
              <EnhancedButton variant="hero" onClick={save} disabled={saving || !role}>
                {saving ? 'Saving...' : 'Save Changes'}
              </EnhancedButton>
            </div>
          </EnhancedCard>
        </div>
      </div>
    </Layout>
  )
}

export default Profile


