import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { 
  Users, Lock, Briefcase, BarChart3, Settings, Search, Bell, 
  LogOut, ChevronRight, ChevronDown, X, Check, Star,
  Bookmark, MessageSquare, User, Home, Filter, Plus, Edit,
  Eye, Trash2, Upload, FileText, Clock, DollarSign, MapPin,
  Calendar, AlertTriangle, CheckCircle, Send, Phone, Mail,
  Building, Shield, ArrowRight, Loader, Menu, XCircle
} from 'lucide-react'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://tender-analyser-1.onrender.com').replace(/\/$/, '')

// ==================== DATA ====================
const sampleClients = [
  { id: 1, name: 'Rajesh Kumar', phone: '98765 43210', company: 'RK Constructions', class: 'Class II', district: 'Hyderabad', status: 'Active', subscription: 'Pro', email: 'rajesh@rkconstructions.com', gstin: '36AABCT1234H1Z2', username: 'rajesh_rk_2024', renewalDate: 'May 15, 2025' },
  { id: 2, name: 'Amit Sharma', phone: '99876 54321', company: 'Sharma & Co.', class: 'Class III', district: 'Warangal', status: 'Active', subscription: 'Premium', email: 'amit@sharmaaco.com', gstin: '36AABCS5678H1Z3', username: 'amit_sharma_2024', renewalDate: 'June 20, 2025' },
  { id: 3, name: 'Priya Singh', phone: '97654 32109', company: 'Singh Projects', class: 'Class I', district: 'Bangalore', status: 'Active', subscription: 'Basic', email: 'priya@singhprojects.com', gstin: '29AABCT9012H1Z4', username: 'priya_singh_2024', renewalDate: 'April 30, 2025' },
  { id: 4, name: 'Vikram Reddy', phone: '96543 21098', company: 'Reddy Builders', class: 'Class II', district: 'Karimnagar', status: 'Inactive', subscription: 'Pro', email: 'vikram@reddybuilders.com', gstin: '36AABCT3456H1Z5', username: 'vikram_reddy_2024', renewalDate: 'March 10, 2025' },
  { id: 5, name: 'Harish Patel', phone: '95432 10987', company: 'Patel & Bros', class: 'Class III', district: 'Hyderabad', status: 'Active', subscription: 'Premium', email: 'harish@patelbros.com', gstin: '36AABCT7890H1Z6', username: 'harish_patel_2024', renewalDate: 'July 5, 2025' },
]

const sampleTenders = [
  { id: 1, title: 'Construction of Rural Road under NREGA Scheme', department: 'Rural Development, Telangana', nit: 'RD-2025-04-001', location: 'Warangal District', value: 2850000, emd: 285000, submissionDeadline: 'May 10, 2025 @ 3:00 PM', publishedDate: 'April 20, 2025', status: 'Published', contractor: 'Rajesh Kumar', daysLeft: 15 },
  { id: 2, title: 'RCC Building Construction for Primary School', department: 'Public Works Department', nit: 'PWD-2025-04-012', location: 'Hyderabad', value: 1875000, emd: 187500, submissionDeadline: 'May 15, 2025 @ 3:00 PM', publishedDate: 'April 22, 2025', status: 'Under Review', contractor: 'Amit Sharma', daysLeft: 20 },
  { id: 3, title: 'Water Supply Pipeline Project - Phase 2', department: 'Water Supply Department', nit: 'WSD-2025-04-008', location: 'Karimnagar', value: 4550000, emd: 455000, submissionDeadline: 'May 20, 2025 @ 3:00 PM', publishedDate: 'April 18, 2025', status: 'Draft', contractor: 'Priya Singh', daysLeft: 25 },
]

const tenderAnalysis = {
  identity: { title: 'Construction of Rural Road under NREGA Scheme', nit: 'RD-2025-04-001', department: 'Rural Development, Telangana', location: 'Warangal District', publishedDate: 'April 20, 2025' },
  dates: { salePeriod: 'April 20 - May 5, 2025', submission: 'May 10, 2025 @ 3:00 PM', bidOpening: 'May 12, 2025', completion: 'December 31, 2025', daysToSubmit: 15 },
  financial: { estimatedValue: 2850000, emd: 285000, securityDeposit: '5%', performanceGuarantee: '5%' },
  eligibility: { class: 'Class II and above', turnover: '₹50,00,000 in last 3 years', experience: 'Minimum 2 years in road construction' },
  documents: ['Tender document', 'EMD (DD or Bank Guarantee)', 'GSTIN copy', 'PAN card', 'Experience certificates', 'Bank statements (last 3 years)', 'Financial statements (audited)'],
  scope: 'Construction of 15 km rural road with specifications as per IRC standards. Work includes earthwork, gravel base, bituminous layer, and drainage systems. Location: Warangal District. Timeline: 6 months.',
  payment: 'Payment will be made as follows:\n- 20% on work commencement\n- 60% on 80% completion\n- 20% on final completion and handover',
  penalties: ['Delay penalty: 0.5% per week (max 10%)', 'Quality non-compliance: 2% of bill value', 'Non-performance: Contract termination + EMD forfeiture'],
  conditions: ['Work to be completed in single stretch (no breaks)', 'Environmental clearance required', 'Daily site inspection mandatory'],
  recommendation: 'Recommended Bid: ₹26,50,000 - ₹27,80,000\n\nRajesh Kumar has experience with similar road projects. Class II qualification meets requirements.\n\nEMD is manageable. Timeline is tight but achievable with team of 20+ workers.'
}

// ==================== COMPONENTS ====================

// Loading Spinner
function LoadingSpinner({ size = 'md' }) {
  const sizeClasses = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} border-4 border-navy-light border-t-navy rounded-full animate-spin`}></div>
    </div>
  )
}

// Modal Component
function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null
  const sizeClasses = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-6xl' }
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${sizeClasses[size]} w-full bg-white rounded-lg shadow-xl animate-fade-in`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-navy">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
            <X className="w-5 h-5 text-slate" />
          </button>
        </div>
        <div className="p-4 max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

// ==================== ADMIN LOGIN ====================
function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('yugandhar@tenderwala.com')
  const [password, setPassword] = useState('demo123')
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please fill all fields')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onLogin()
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-light to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-navy rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-navy">TenderWala</h1>
          <p className="text-slate mt-2">Manage Tenders, Automate Resets, Scale Your Business</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-navy mb-6">Admin Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate mb-1">Email / Username</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="rounded border-gray-300" />
                <span className="text-sm text-slate">Remember me</span>
              </label>
              <a href="#" className="text-sm text-teal hover:underline">Forgot Password?</a>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy text-white py-3 rounded-lg font-medium hover:bg-navy/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Login'}
            </button>
          </form>
        </div>
        
        <p className="text-center text-sm text-slate mt-6">© 2025 TenderWala. All rights reserved.</p>
      </div>
    </div>
  )
}

// ==================== ADMIN DASHBOARD ====================
function AdminDashboard({ onNavigate }) {
  const metrics = [
    { title: 'Total Clients', value: '1,247', subtext: '+45 this month', icon: Users, color: 'teal', bg: 'bg-teal-light' },
    { title: 'Password Resets Today', value: '23', subtext: 'Average: 8 min response time', icon: Lock, color: 'orange', bg: 'bg-orange-light' },
    { title: 'Pending Tender Analysis', value: '12', subtext: '4 awaiting review', icon: Briefcase, color: 'navy', bg: 'bg-navy-light' },
    { title: 'Subscription Revenue', value: '₹87,450', subtext: 'Last 30 days', icon: DollarSign, color: 'success', bg: 'bg-green-100' },
  ]

  const activities = [
    { time: '2 min ago', client: 'Rajesh Kumar', action: 'Password Reset', status: 'Completed' },
    { time: '15 min ago', client: 'Amit Sharma', action: 'Interest: Road Project', status: 'Pending' },
    { time: '1 hour ago', client: 'Priya Singh', action: 'Analysis Published', status: 'Ready' },
    { time: '2 hours ago', client: 'Vikram Reddy', action: 'Subscription Upgraded', status: 'Completed' },
  ]

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, idx) => (
          <div key={idx} className={`${metric.bg} rounded-xl p-6`}>
            <div className="flex items-center justify-between mb-4">
              <metric.icon className={`w-8 h-8 text-${metric.color}`} />
              <span className="text-3xl font-bold text-navy">{metric.value}</span>
            </div>
            <h3 className="font-semibold text-navy">{metric.title}</h3>
            <p className="text-sm text-slate">{metric.subtext}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-navy mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {activities.map((activity, idx) => (
            <div key={idx} className="flex items-center justify-between py-3 border-b last:border-0">
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate">{activity.time}</span>
                <span className="font-medium text-navy">{activity.client}</span>
                <span className="text-slate">{activity.action}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                activity.status === 'Completed' ? 'bg-green-100 text-green-700' :
                activity.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                'bg-teal-light text-teal'
              }`}>{activity.status}</span>
            </div>
          ))}
        </div>
        <a href="#" className="text-teal hover:underline text-sm mt-4 inline-block">View All</a>
      </div>
    </div>
  )
}

// ==================== CLIENT MANAGEMENT ====================
function ClientManagement({ clients, onViewClient, onResetPassword }) {
  const [search, setSearch] = useState('')
  const [districtFilter, setDistrictFilter] = useState('All')
  const [classFilter, setClassFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  const filtered = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                       c.phone.includes(search) || c.gstin.toLowerCase().includes(search.toLowerCase())
    const matchDistrict = districtFilter === 'All' || c.district === districtFilter
    const matchClass = classFilter === 'All' || c.class === classFilter
    const matchStatus = statusFilter === 'All' || c.status === statusFilter
    return matchSearch && matchDistrict && matchClass && matchStatus
  })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-navy">Manage Clients</h2>
        <button className="bg-navy text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-navy/90">
          <Plus className="w-4 h-4" /> Add New Client
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[250px]">
            <input
              type="text"
              placeholder="Search by name, phone, GSTIN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <select value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)} className="px-4 py-2 border rounded-lg">
            <option value="All">All Districts</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Warangal">Warangal</option>
            <option value="Karimnagar">Karimnagar</option>
            <option value="Bangalore">Bangalore</option>
          </select>
          <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="px-4 py-2 border rounded-lg">
            <option value="All">All Classes</option>
            <option value="Class I">Class I</option>
            <option value="Class II">Class II</option>
            <option value="Class III">Class III</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border rounded-lg">
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-4 text-sm font-semibold text-slate">Client Name</th>
              <th className="text-left p-4 text-sm font-semibold text-slate">Phone</th>
              <th className="text-left p-4 text-sm font-semibold text-slate">Company</th>
              <th className="text-left p-4 text-sm font-semibold text-slate">Class</th>
              <th className="text-left p-4 text-sm font-semibold text-slate">District</th>
              <th className="text-left p-4 text-sm font-semibold text-slate">Status</th>
              <th className="text-left p-4 text-sm font-semibold text-slate">Subscription</th>
              <th className="text-left p-4 text-sm font-semibold text-slate">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((client) => (
              <tr key={client.id} className="border-t hover:bg-slate-50">
                <td className="p-4 font-medium text-navy">{client.name}</td>
                <td className="p-4 text-slate">{client.phone}</td>
                <td className="p-4 text-slate">{client.company}</td>
                <td className="p-4 text-slate">{client.class}</td>
                <td className="p-4 text-slate">{client.district}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    client.status === 'Active' ? 'bg-green-100 text-green-700' :
                    client.status === 'Inactive' ? 'bg-gray-100 text-gray-700' :
                    'bg-red-100 text-red-700'
                  }`}>{client.status}</span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    client.subscription === 'Premium' ? 'bg-orange-100 text-orange-700' :
                    client.subscription === 'Pro' ? 'bg-teal-100 text-teal' :
                    'bg-gray-100 text-gray-700'
                  }`}>{client.subscription}</span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => onViewClient(client)} className="p-1 text-teal hover:bg-teal-light rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => onResetPassword(client)} className="p-1 text-orange hover:bg-orange-light rounded">
                      <Lock className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-navy hover:bg-navy-light rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 border-t text-sm text-slate">
          Showing {filtered.length} of {clients.length} clients
        </div>
      </div>
    </div>
  )
}

// ==================== CLIENT DETAIL MODAL ====================
function ClientDetailModal({ client, isOpen, onClose, onReset }) {
  if (!client) return null
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Client: ${client.name}`} size="lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-navy mb-4">Client Information</h4>
          <div className="space-y-3">
            <div><span className="text-slate text-sm">Company:</span> <span className="font-medium">{client.company}</span></div>
            <div><span className="text-slate text-sm">Status:</span> <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">{client.status} ✓</span></div>
            <div><span className="text-slate text-sm">Class:</span> <span className="font-medium">{client.class}</span></div>
            <div><span className="text-slate text-sm">District:</span> <span className="font-medium">{client.district}</span></div>
            <div><span className="text-slate text-sm">Phone:</span> <span className="font-medium">{client.phone}</span></div>
            <div><span className="text-slate text-sm">Email:</span> <span className="font-medium">{client.email}</span></div>
            <div><span className="text-slate text-sm">GSTIN:</span> <span className="font-medium">{client.gstin}</span></div>
            <div><span className="text-slate text-sm">Username:</span> <span className="font-medium">{client.username}</span></div>
            <div><span className="text-slate text-sm">Subscription:</span> <span className="font-medium">{client.subscription} (Rs. 499/month)</span></div>
            <div><span className="text-slate text-sm">Renewal:</span> <span className="font-medium">{client.renewalDate}</span></div>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-navy mb-4">Quick Actions</h4>
          <div className="space-y-3">
            <button className="w-full border border-navy text-navy py-2 rounded-lg hover:bg-navy-light">Edit Client</button>
            <button onClick={() => onReset(client)} className="w-full bg-orange text-white py-2 rounded-lg hover:bg-orange/90 flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" /> Reset Password
            </button>
            <button className="w-full border border-teal text-teal py-2 rounded-lg hover:bg-teal-light">View Interests</button>
            <button className="w-full border border-slate text-slate py-2 rounded-lg hover:bg-slate-50">View Activity Log</button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

// ==================== PASSWORD RESET MODAL ====================
function PasswordResetModal({ client, isOpen, onClose, onSend }) {
  const [method, setMethod] = useState('sms')
  const [sending, setSending] = useState(false)

  const handleSend = () => {
    setSending(true)
    setTimeout(() => {
      setSending(false)
      onSend(client, method)
      onClose()
    }, 1500)
  }

  if (!client) return null
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Reset Password for ${client.name}`} size="sm">
      <div className="space-y-4">
        <p className="text-slate">Select method to send reset link:</p>
        <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50">
          <input type="radio" name="method" checked={method === 'sms'} onChange={() => setMethod('sms')} />
          <Phone className="w-5 h-5 text-slate" />
          <div>
            <div className="font-medium">Send SMS</div>
            <div className="text-sm text-slate">to {client.phone}</div>
          </div>
        </label>
        <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50">
          <input type="radio" name="method" checked={method === 'email'} onChange={() => setMethod('email')} />
          <Mail className="w-5 h-5 text-slate" />
          <div>
            <div className="font-medium">Send Email</div>
            <div className="text-sm text-slate">to {client.email}</div>
          </div>
        </label>
        <div className="flex gap-3 pt-4">
          <button onClick={onClose} className="flex-1 border border-slate text-slate py-2 rounded-lg hover:bg-slate-50">Cancel</button>
          <button onClick={handleSend} disabled={sending} className="flex-1 bg-orange text-white py-2 rounded-lg hover:bg-orange/90 flex items-center justify-center gap-2">
            {sending ? <LoadingSpinner size="sm" /> : <>Send Reset Link</>}
          </button>
        </div>
      </div>
    </Modal>
  )
}

// ==================== TENDER MANAGEMENT ====================
function TenderManagement({ tenders, onViewTender }) {
  const [activeTab, setActiveTab] = useState('viewAll')
  const [selectedContractor, setSelectedContractor] = useState('')
  const [uploadedFile, setUploadedFile] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) setUploadedFile(file)
  }

  const handleAnalyze = async () => {
    if (!selectedContractor || !uploadedFile) {
      toast.error('Please select contractor and upload file')
      return
    }

    setAnalyzing(true)
    setAnalysisProgress(0)
    setAnalysisResult(null)

    const progressTimer = setInterval(() => {
      setAnalysisProgress(prev => Math.min(prev + 10, 90))
    }, 800)

    try {
      const formData = new FormData()
      formData.append('file', uploadedFile)

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.detail || data.error || 'Tender analysis failed')
      }

      setAnalysisResult(data)
      setAnalysisProgress(100)
      setAnalysisComplete(true)
      toast.success('Tender analysis generated')
    } catch (error) {
      toast.error(error.message || 'Unable to analyze tender')
    } finally {
      clearInterval(progressTimer)
      setAnalyzing(false)
    }
  }

  const analysisSections = analysisResult ? [
    {
      title: 'Tender Identity',
      content: `Title: ${analysisResult.tender_title || '-'}\nNIT: ${analysisResult.tender_number || '-'}\nDepartment: ${analysisResult.department || '-'}`
    },
    {
      title: 'Key Dates',
      content: Object.entries(analysisResult.key_dates || {}).map(([key, value]) => `${key.replace(/_/g, ' ')}: ${value}`).join('\n') || '-'
    },
    {
      title: 'Financial Details',
      content: Object.entries(analysisResult.financial_details || {}).map(([key, value]) => `${key.replace(/_/g, ' ')}: ${value}`).join('\n') || '-'
    },
    { title: 'Eligibility Criteria', content: (analysisResult.eligibility_criteria || []).map((item, i) => `${i + 1}. ${item}`).join('\n') || '-' },
    { title: 'Required Documents', content: (analysisResult.required_documents || []).map((item, i) => `${i + 1}. ${item}`).join('\n') || '-' },
    { title: 'Scope of Work', content: analysisResult.scope_of_work || '-' },
    { title: 'Important Conditions', content: (analysisResult.important_conditions || []).map((item, i) => `${i + 1}. ${item}`).join('\n') || '-' },
    { title: 'Penalty Clauses', content: (analysisResult.penalty_clauses || []).map((item, i) => `${i + 1}. ${item}`).join('\n') || '-' },
    { title: 'Payment Terms', content: analysisResult.payment_terms || '-' },
    { title: 'Red Flags', content: (analysisResult.red_flags || []).map((item, i) => `${i + 1}. ${item}`).join('\n') || '-' },
    { title: 'Contractor Checklist', content: (analysisResult.contractor_checklist || []).map((item, i) => `${i + 1}. ${item}`).join('\n') || '-' },
    { title: 'Summary', content: analysisResult.summary_in_simple_words || '-' },
  ] : []

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-navy mb-6">Tender Management</h2>
      
      <div className="flex gap-4 mb-6 border-b">
        <button onClick={() => setActiveTab('uploadNew')} className={`px-4 py-2 border-b-2 ${activeTab === 'uploadNew' ? 'border-navy text-navy' : 'border-transparent text-slate'}`}>
          Upload New
        </button>
        <button onClick={() => setActiveTab('viewAll')} className={`px-4 py-2 border-b-2 ${activeTab === 'viewAll' ? 'border-navy text-navy' : 'border-transparent text-slate'}`}>
          View All
        </button>
      </div>

      {activeTab === 'uploadNew' ? (
        <div className="space-y-6">
          {!analysisComplete ? (
            <>
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-semibold text-navy mb-4">Step 1: Select Contractor</h3>
                <select value={selectedContractor} onChange={(e) => setSelectedContractor(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Which contractor expressed interest?</option>
                  {sampleClients.filter(c => c.status === 'Active').map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.phone}) — {c.company}</option>
                  ))}
                </select>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-semibold text-navy mb-4">Step 2: Upload Tender PDF</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  {uploadedFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText className="w-8 h-8 text-orange" />
                      <span className="font-medium">{uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                      <button onClick={() => setUploadedFile(null)} className="p-1 hover:bg-slate-100 rounded">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-slate mx-auto mb-4" />
                      <p className="text-slate mb-2">Drag tender PDF here or click to browse</p>
                      <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" id="file-upload" />
                      <label htmlFor="file-upload" className="inline-block bg-navy text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-navy/90">
                        Choose File
                      </label>
                    </>
                  )}
                </div>
              </div>

              <button onClick={handleAnalyze} disabled={analyzing || !selectedContractor || !uploadedFile} className="w-full bg-navy text-white py-3 rounded-lg font-medium hover:bg-navy/90 disabled:opacity-50 flex items-center justify-center gap-2">
                {analyzing ? <LoadingSpinner size="sm" /> : 'Generate Analysis'}
              </button>

              {analyzing && (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <p className="text-slate mb-4">Analyzing tender document... This may take 3-5 minutes</p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-teal h-3 rounded-full transition-all" style={{ width: `${analysisProgress}%` }}></div>
                  </div>
                  <p className="text-right text-sm text-slate mt-2">{analysisProgress}% Complete</p>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              {analysisSections.map((section, idx) => (
                <details key={idx} className="border rounded-lg">
                  <summary className="px-4 py-3 cursor-pointer font-medium text-navy flex items-center justify-between">
                    {section.title}
                    <ChevronDown className="w-4 h-4" />
                  </summary>
                  <div className="px-4 py-3 border-t text-sm text-slate whitespace-pre-line">{section.content}</div>
                </details>
              ))}
              <div className="flex gap-4 pt-4">
                <button className="flex-1 border border-navy text-navy py-2 rounded-lg hover:bg-navy-light">Edit Analysis</button>
                <button onClick={() => { setAnalysisComplete(false); setAnalysisResult(null); setUploadedFile(null); setSelectedContractor(''); toast.success('Analysis published!') }} className="flex-1 bg-teal text-white py-2 rounded-lg hover:bg-teal/90">
                  Publish to Contractor
                </button>
                <button className="flex-1 border border-slate text-slate py-2 rounded-lg hover:bg-slate-50">Save Draft</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-slate">Tender Title</th>
                <th className="text-left p-4 text-sm font-semibold text-slate">Contractor</th>
                <th className="text-left p-4 text-sm font-semibold text-slate">Status</th>
                <th className="text-left p-4 text-sm font-semibold text-slate">Uploaded Date</th>
                <th className="text-left p-4 text-sm font-semibold text-slate">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tenders.map((tender) => (
                <tr key={tender.id} className="border-t hover:bg-slate-50">
                  <td className="p-4 font-medium text-navy">{tender.title}</td>
                  <td className="p-4 text-slate">{tender.contractor}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tender.status === 'Published' ? 'bg-teal-light text-teal' :
                      tender.status === 'Under Review' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>{tender.status}</span>
                  </td>
                  <td className="p-4 text-slate">{tender.publishedDate}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => onViewTender(tender)} className="p-1 text-teal hover:bg-teal-light rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-navy hover:bg-navy-light rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-danger hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ==================== MOBILE APP LOGIN ====================
function MobileLogin({ onLogin }) {
  const [phone, setPhone] = useState('9876543210')

  const handleSubmit = () => {
    if (phone.length === 10) {
      onLogin()
    } else {
      toast.error('Please enter valid 10-digit phone number')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-light to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-navy rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-navy">TenderWala</h1>
          <p className="text-slate mt-2">Find Government Tenders. Easy.</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-navy mb-6">Contractor Login</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate mb-1">Phone Number</label>
              <div className="flex items-center border rounded-lg overflow-hidden">
                <span className="px-3 py-3 bg-slate-50 text-slate">+91</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 px-4 py-3 focus:outline-none"
                  placeholder="98765 43210"
                />
              </div>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-navy text-white py-3 rounded-lg font-medium hover:bg-navy/90 transition-colors"
            >
              Send OTP
            </button>
            <p className="text-center text-sm text-slate">We'll send you a 6-digit code via SMS</p>
          </div>
        </div>
        
        <p className="text-center text-sm text-slate mt-6">© 2025 TenderWala. All rights reserved.</p>
      </div>
    </div>
  )
}

// ==================== MOBILE OTP ====================
function MobileOTP({ onVerify }) {
  const [otp, setOtp] = useState('123456')
  const [timer, setTimer] = useState(45)

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t > 0 ? t - 1 : t), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-light to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-navy rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-navy">TenderWala</h1>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-navy mb-2">Enter OTP</h2>
          <p className="text-slate mb-6">We sent a code to 98765 43210</p>
          
          <div className="space-y-4">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent text-center text-2xl tracking-widest"
              placeholder="123456"
              maxLength={6}
            />
            <p className="text-center text-sm text-slate">
              {timer > 0 ? `Resend OTP in ${timer} seconds` : <button className="text-teal hover:underline">Resend OTP</button>}
            </p>
            <button
              onClick={onVerify}
              className="w-full bg-navy text-white py-3 rounded-lg font-medium hover:bg-navy/90 transition-colors"
            >
              Verify OTP
            </button>
            <button className="w-full text-teal text-sm hover:underline">Edit phone number</button>
          </div>
        </div>
      </div>
    </div>
  )
}

const mobileNavItems = [
  { icon: Home, label: 'Home', view: 'home' },
  { icon: Search, label: 'Search', view: 'search' },
  { icon: Bookmark, label: 'Interests', view: 'interests' },
  { icon: MessageSquare, label: 'Messages', view: 'messages' },
  { icon: User, label: 'Profile', view: 'profile' },
]

function MobileBottomNav({ activeView, onNavigate }) {
  return (
    <div className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 bg-white border-t flex justify-around py-3">
      {mobileNavItems.map((item) => (
        <button
          key={item.view}
          onClick={() => onNavigate(item.view)}
          className={`flex flex-col items-center gap-1 ${activeView === item.view ? 'text-teal' : 'text-slate'}`}
        >
          <item.icon className="w-5 h-5" />
          <span className="text-xs">{item.label}</span>
        </button>
      ))}
    </div>
  )
}

// ==================== MOBILE HOME ====================
function MobileHome({ onNavigate }) {
  const stats = [
    { title: 'Active Interests', value: '4', subtext: "Tenders you're tracking", icon: Bookmark },
    { title: 'New Tenders', value: '3', subtext: 'Matched your profile this week', icon: Star },
    { title: 'Analysis Ready', value: '1', subtext: 'Road project - Warangal', icon: CheckCircle },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-navy p-6 rounded-b-3xl">
        <p className="text-white/80">Hi Rajesh 👋</p>
        <p className="text-white text-sm">Your Pro subscription is active until May 15, 2025</p>
        <span className="inline-block mt-2 px-2 py-1 bg-teal text-white text-xs rounded">PRO</span>
      </div>

      <div className="p-4 -mt-4">
        <div className="grid grid-cols-3 gap-3 mb-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl p-4 shadow-sm">
              <stat.icon className="w-5 h-5 text-teal mb-2" />
              <p className="text-2xl font-bold text-navy">{stat.value}</p>
              <p className="text-xs text-slate">{stat.title}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-orange font-medium">Featured</span>
            <span className="text-xs text-danger font-medium">15 days left</span>
          </div>
          <h3 className="font-semibold text-navy mb-1">Construction of Rural Road under NREGA</h3>
          <p className="text-sm text-slate">Rural Development, Telangana</p>
          <p className="text-lg font-bold text-navy mt-2">₹28,50,000</p>
          <p className="text-sm text-slate mb-3">Warangal</p>
          <div className="flex gap-2">
            <button className="flex-1 border border-navy text-navy py-2 rounded-lg text-sm">View Details</button>
            <button className="flex-1 bg-orange text-white py-2 rounded-lg text-sm">Express Interest</button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-teal" />
            <div>
              <p className="text-sm font-medium">Analysis ready: Road Project - Warangal</p>
              <p className="text-xs text-slate">Tap to view details</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate ml-auto" />
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
            <Star className="w-5 h-5 text-orange" />
            <div>
              <p className="text-sm font-medium">New tender posted: Water Supply Project</p>
              <p className="text-xs text-slate">Tap to view details</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate ml-auto" />
          </div>
        </div>
      </div>

      <MobileBottomNav activeView="home" onNavigate={onNavigate} />
    </div>
  )
}

// ==================== MOBILE SEARCH ====================
function MobileSearch({ onNavigate }) {
  const [filtersOpen, setFiltersOpen] = useState(true)
  const [district, setDistrict] = useState('Warangal')
  const [department, setDepartment] = useState('Rural Development')
  const [value, setValue] = useState('50L - 1Cr')
  const [days, setDays] = useState('Closing soon')

  const tenders = [
    { title: 'Road Construction - NREGA', department: 'Rural Development', value: '₹28,50,000', days: 15, district: 'Warangal', interested: true },
    { title: 'Water Supply Pipeline', department: 'Water Supply', value: '₹45,50,000', days: 22, district: 'Karimnagar', interested: false },
    { title: 'RCC Building Construction', department: 'Public Works', value: '₹18,75,000', days: 28, district: 'Hyderabad', interested: false },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-navy p-4">
        <input type="text" placeholder="Search by keyword or tender number..." className="w-full px-4 py-2 rounded-lg" />
      </div>

      <div className="p-4">
        <button onClick={() => setFiltersOpen(!filtersOpen)} className="flex items-center gap-2 text-navy mb-4">
          <Filter className="w-4 h-4" /> Filters ▼
        </button>

        {filtersOpen && (
          <div className="bg-white rounded-xl p-4 shadow-sm mb-4 space-y-4">
            <div>
              <p className="font-medium text-sm mb-2">District</p>
              <div className="flex flex-wrap gap-2">
                {['All', 'Hyderabad', 'Warangal', 'Karimnagar'].map(d => (
                  <button key={d} onClick={() => setDistrict(d)} className={`px-3 py-1 rounded-full text-sm ${district === d ? 'bg-navy text-white' : 'bg-slate-100'}`}>{d}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-medium text-sm mb-2">Department</p>
              <div className="flex flex-wrap gap-2">
                {['All', 'Rural Development', 'Water Supply', 'Roads & Buildings'].map(d => (
                  <button key={d} onClick={() => setDepartment(d)} className={`px-3 py-1 rounded-full text-sm ${department === d ? 'bg-navy text-white' : 'bg-slate-100'}`}>{d}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-medium text-sm mb-2">Project Value</p>
              <div className="flex flex-wrap gap-2">
                {['Any', '10L - 50L', '50L - 1Cr', '1Cr+'].map(v => (
                  <button key={v} onClick={() => setValue(v)} className={`px-3 py-1 rounded-full text-sm ${value === v ? 'bg-navy text-white' : 'bg-slate-100'}`}>{v}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-medium text-sm mb-2">Days to Submit</p>
              <div className="flex flex-wrap gap-2">
                {['Any', 'Closing soon', '1-2 weeks', '2+ weeks'].map(d => (
                  <button key={d} onClick={() => setDays(d)} className={`px-3 py-1 rounded-full text-sm ${days === d ? 'bg-navy text-white' : 'bg-slate-100'}`}>{d}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {tenders.map((tender, idx) => (
            <div key={idx} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs bg-teal-light text-teal px-2 py-1 rounded">{tender.department}</span>
                {tender.interested && <span className="text-xs text-teal flex items-center gap-1"><Check className="w-3 h-3" /> Interested</span>}
              </div>
              <h3 className="font-semibold text-navy mb-1">{tender.title}</h3>
              <div className="flex items-center gap-4 text-sm text-slate mb-3">
                <span>₹{tender.value}</span>
                <span className="text-danger">{tender.days} days left</span>
                <span>{tender.district}</span>
              </div>
              {!tender.interested && (
                <button className="w-full bg-orange text-white py-2 rounded-lg text-sm">Express Interest</button>
              )}
            </div>
          ))}
        </div>
      </div>

      <MobileBottomNav activeView="search" onNavigate={onNavigate} />
    </div>
  )
}

// ==================== MOBILE TENDER DETAIL ====================
function MobileTenderDetail({ onBack }) {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-navy p-4">
        <button onClick={onBack} className="text-white mb-2">← Back</button>
        <h1 className="text-white font-semibold">Road Construction - NREGA Scheme</h1>
        <span className="inline-block mt-2 px-2 py-1 bg-teal text-white text-xs rounded">Analysis Ready ✓</span>
      </div>

      <div className="flex border-b bg-white">
        {['Overview', 'Analysis', 'Checklist'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab.toLowerCase())} className={`flex-1 py-3 text-sm font-medium ${activeTab === tab.toLowerCase() ? 'text-teal border-b-2 border-teal' : 'text-slate'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="p-4">
        {activeTab === 'overview' && (
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex justify-between"><span className="text-slate">Tender Value</span><span className="font-medium">₹28,50,000</span></div>
            <div className="flex justify-between"><span className="text-slate">Location</span><span className="font-medium">Warangal District</span></div>
            <div className="flex justify-between"><span className="text-slate">Days to Submit</span><span className="font-medium text-danger">15 days</span></div>
            <div className="flex justify-between"><span className="text-slate">Eligibility</span><span className="font-medium">Class II and above</span></div>
            <div className="flex justify-between"><span className="text-slate">Your Status</span><span className="text-teal">Interested ✓</span></div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-navy mb-2">Quick Facts</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate">EMD Required</span><span className="font-medium">₹2,85,000</span></div>
                <div className="flex justify-between"><span className="text-slate">Deadline</span><span className="font-medium">May 10, 2025 @ 3:00 PM</span></div>
                <div className="flex justify-between"><span className="text-slate">Timeline</span><span className="font-medium">6 months</span></div>
                <div className="flex justify-between"><span className="text-slate">Performance</span><span className="font-medium">5%</span></div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-navy mb-2">Who Can Apply?</h3>
              <p className="text-sm text-slate">Contractor Class II and above. Minimum ₹50,00,000 turnover in last 3 years. Minimum 2 years experience in road construction. <span className="text-teal">You meet all requirements ✓</span></p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-navy mb-2">Admin's Recommendation</h3>
              <div className="text-sm text-slate space-y-2">
                <p>✓ You have experience with similar projects</p>
                <p>✓ Your Class II qualification meets requirements</p>
                <p>✓ EMD is manageable for your company</p>
                <p className="text-orange">⚠ Timeline is tight - requires team of 20+ workers</p>
              </div>
              <div className="mt-3 p-3 bg-teal-light rounded-lg">
                <p className="text-sm text-slate">Suggested Bid:</p>
                <p className="text-xl font-bold text-navy">₹26,50,000 - ₹27,80,000</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-navy mb-4">Your Action Checklist</h3>
            <div className="space-y-3">
              {[
                'Download tender document',
                'Arrange EMD - ₹2,85,000',
                'Gather required documents (GSTIN, PAN, Bank statements)',
                'Prepare bid amount (₹26,50,000 - ₹27,80,000)',
                'Submit on portal before May 10, 3:00 PM',
              ].map((item, idx) => (
                <label key={idx} className="flex items-center gap-3">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-sm">{item}</span>
                </label>
              ))}
            </div>
            <p className="text-sm text-slate mt-4">Progress: 3/5 completed</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex gap-2">
        <button className="flex-1 border border-navy text-navy py-2 rounded-lg text-sm">Download PDF</button>
        <button className="flex-1 border border-teal text-teal py-2 rounded-lg text-sm">Contact Admin</button>
      </div>
    </div>
  )
}

// ==================== MOBILE INTERESTS ====================
function MobileInterests({ onNavigate }) {
  const interests = [
    { title: 'Road Construction - NREGA', department: 'Rural Development', status: 'Analysis Ready', value: '₹28,50,000', days: 15, statusColor: 'green' },
    { title: 'Water Supply Pipeline - Phase 2', department: 'Water Supply', status: 'Under Review...', value: '₹45,50,000', days: 22, statusColor: 'orange' },
    { title: 'RCC Building Construction', department: 'Public Works', status: 'Just Expressed', value: '₹18,75,000', days: 28, statusColor: 'gray' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-navy p-4">
        <h1 className="text-white font-semibold">My Interests</h1>
      </div>

      <div className="flex border-b bg-white">
        {['All', 'Pending', 'Analysis Ready', 'Completed'].map(tab => (
          <button key={tab} className="flex-1 py-3 text-xs font-medium text-slate border-b-2 border-transparent">{tab}</button>
        ))}
      </div>

      <div className="p-4 space-y-3">
        {interests.map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs px-2 py-1 rounded ${
                item.statusColor === 'green' ? 'bg-teal-light text-teal' :
                item.statusColor === 'orange' ? 'bg-orange-100 text-orange-700' :
                'bg-gray-100 text-gray-700'
              }`}>{item.status}</span>
              <span className="text-sm text-danger">{item.days} days left</span>
            </div>
            <h3 className="font-semibold text-navy mb-1">{item.title}</h3>
            <p className="text-sm text-slate mb-2">{item.department}</p>
            <p className="text-lg font-bold text-navy mb-3">₹{item.value}</p>
            <div className="flex gap-2">
              {item.status === 'Analysis Ready' ? (
                <>
                  <button className="flex-1 border border-teal text-teal py-2 rounded-lg text-sm">View Analysis</button>
                  <button className="flex-1 bg-teal text-white py-2 rounded-lg text-sm">Submit Bid</button>
                </>
              ) : (
                <button className="flex-1 border border-navy text-navy py-2 rounded-lg text-sm">View Details</button>
              )}
            </div>
          </div>
        ))}
      </div>

      <MobileBottomNav activeView="interests" onNavigate={onNavigate} />
    </div>
  )
}

// ==================== MOBILE MESSAGES ====================
function MobileMessages({ onNavigate }) {
  const conversations = [
    { name: 'Tender Admin', subject: 'Road Project analysis is ready', time: '10:24 AM', unread: true },
    { name: 'Support Team', subject: 'GST document received successfully', time: 'Yesterday', unread: false },
    { name: 'Bid Desk', subject: 'Premium bid recommendation available', time: 'Apr 22', unread: false },
  ]

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-navy p-4">
        <h1 className="text-white font-semibold">Messages</h1>
      </div>

      <div className="p-4 space-y-3">
        {conversations.map((message, idx) => (
          <button key={idx} className="w-full bg-white rounded-xl p-4 shadow-sm text-left flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${message.unread ? 'bg-teal text-white' : 'bg-slate-100 text-slate'}`}>
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-navy truncate">{message.name}</p>
                <span className="text-xs text-slate shrink-0">{message.time}</span>
              </div>
              <p className="text-sm text-slate truncate">{message.subject}</p>
            </div>
            {message.unread && <span className="w-2 h-2 bg-orange rounded-full shrink-0"></span>}
          </button>
        ))}
      </div>

      <MobileBottomNav activeView="messages" onNavigate={onNavigate} />
    </div>
  )
}

// ==================== MOBILE SUBSCRIPTION ====================
function MobileSubscription({ onNavigate }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [processing, setProcessing] = useState(false)

  const handleUpgrade = () => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setShowConfirm(false)
      toast.success('Payment Successful! Your plan is now Premium')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-navy p-4">
        <h1 className="text-white font-semibold">My Subscription</h1>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <h3 className="font-semibold text-navy mb-3">Current Plan</h3>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-2xl font-bold text-navy">PRO</p>
              <p className="text-slate">₹499/month</p>
            </div>
            <span className="text-sm text-slate">Next Renewal: May 15, 2025 (20 days)</span>
          </div>
          <div className="text-sm text-slate space-y-1">
            <p>✓ Browse unlimited tenders</p>
            <p>✓ Full AI-generated analysis</p>
            <p>✓ Unlimited interest requests</p>
            <p>✓ Priority support</p>
            <p className="text-slate/50">✗ Bid recommendation (upgrade for this)</p>
          </div>
        </div>

        <h3 className="font-semibold text-navy mb-3">Upgrade Options</h3>
        <div className="space-y-3">
          {[
            { plan: 'Basic', price: 'Free', current: false, features: ['Browse tenders', 'Filter & search', '3 interests/month'] },
            { plan: 'PRO', price: '₹499/month', current: true, features: ['Everything in Basic', 'Unlimited interests', 'Full AI analysis'] },
            { plan: 'PREMIUM', price: '₹999/month', current: false, features: ['Everything in Pro', 'Bid recommendations', 'Admin chat access', 'Document analysis'], highlight: true },
          ].map((p, idx) => (
            <div key={idx} className={`bg-white rounded-xl p-4 shadow-sm ${p.current ? 'border-2 border-teal' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-navy">{p.plan}</p>
                  <p className="text-sm text-slate">{p.price}</p>
                </div>
                {p.current && <span className="text-xs bg-teal text-white px-2 py-1 rounded">Current Plan</span>}
              </div>
              <div className="text-sm text-slate space-y-1 mb-3">
                {p.features.map((f, i) => <p key={i}>{f}</p>)}
              </div>
              {p.plan === 'PREMIUM' && !p.current && (
                <button onClick={() => setShowConfirm(true)} className="w-full bg-orange text-white py-2 rounded-lg text-sm">Upgrade to Premium</button>
              )}
              {p.plan === 'PRO' && p.current && (
                <button className="w-full border border-navy text-navy py-2 rounded-lg text-sm">Keep this plan</button>
              )}
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Upgrade to Premium?" size="sm">
        <div className="space-y-4">
          <p className="text-slate">₹999/month starting next month</p>
          <p className="text-sm text-slate">Cancel anytime, no questions asked</p>
          <p className="text-sm text-slate">Payment method: **** 1234</p>
          <div className="flex gap-3">
            <button onClick={() => setShowConfirm(false)} className="flex-1 border border-slate text-slate py-2 rounded-lg">Cancel</button>
            <button onClick={handleUpgrade} disabled={processing} className="flex-1 bg-orange text-white py-2 rounded-lg flex items-center justify-center gap-2">
              {processing ? <LoadingSpinner size="sm" /> : 'Confirm Payment'}
            </button>
          </div>
        </div>
      </Modal>

      <MobileBottomNav activeView="profile" onNavigate={onNavigate} />
    </div>
  )
}

// ==================== MOBILE PROFILE ====================
function MobileProfile({ onLogout, onNavigate }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-navy p-4">
        <h1 className="text-white font-semibold">Profile</h1>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-navy mb-3">Account</h3>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-slate">Name</span><span className="font-medium">Rajesh Kumar</span></div>
            <div className="flex justify-between"><span className="text-slate">Phone</span><span className="font-medium">98765 43210</span></div>
            <div className="flex justify-between"><span className="text-slate">Email</span><span className="font-medium">rajesh@rkconstructions.com</span></div>
          </div>
          <button className="w-full border border-navy text-navy py-2 rounded-lg text-sm mt-3">Edit Profile</button>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-navy mb-3">Company Info</h3>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-slate">Company</span><span className="font-medium">RK Constructions</span></div>
            <div className="flex justify-between"><span className="text-slate">GSTIN</span><span className="font-medium">36AABCT1234H1Z2</span></div>
            <div className="flex justify-between"><span className="text-slate">Class</span><span className="font-medium">Class II</span></div>
            <div className="flex justify-between"><span className="text-slate">District</span><span className="font-medium">Hyderabad</span></div>
          </div>
          <button className="w-full border border-navy text-navy py-2 rounded-lg text-sm mt-3">Edit Company Info</button>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-navy mb-3">Preferences</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center"><span className="text-slate">Notifications</span><input type="checkbox" defaultChecked className="rounded" /></div>
            <div className="flex justify-between items-center"><span className="text-slate">Email Alerts</span><input type="checkbox" defaultChecked className="rounded" /></div>
          </div>
        </div>

        <div className="space-y-2">
          <button className="w-full border border-slate text-slate py-2 rounded-lg text-sm">Download All My Data</button>
          <button className="w-full border border-danger text-danger py-2 rounded-lg text-sm">Delete Account</button>
          <button onClick={onLogout} className="w-full bg-navy text-white py-2 rounded-lg text-sm">Logout</button>
        </div>
      </div>

      <MobileBottomNav activeView="profile" onNavigate={onNavigate} />
    </div>
  )
}

// ==================== SIDEBAR ====================
function Sidebar({ activeItem, onNavigate, onLogout }) {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'clients', icon: Users, label: 'Clients' },
    { id: 'tenders', icon: Briefcase, label: 'Tender Management' },
    { id: 'resets', icon: Lock, label: 'Password Resets' },
    { id: 'employees', icon: Users, label: 'Employee Management' },
    { id: 'reports', icon: BarChart3, label: 'Reports' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <div className="w-64 bg-navy min-h-screen text-white">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal rounded-lg flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <span className="font-semibold">TenderWala</span>
        </div>
      </div>
      <nav className="p-4 space-y-1">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeItem === item.id ? 'bg-teal' : 'hover:bg-white/10'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="absolute bottom-0 w-64 p-4 border-t border-white/10">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white/70">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

// ==================== MAIN APP ====================
export default function App() {
  const [mode, setMode] = useState('admin') // 'admin' or 'mobile'
  const [adminView, setAdminView] = useState('login') // login, dashboard, clients, tenders
  const [mobileView, setMobileView] = useState('login') // login, otp, home, search, detail, interests, messages, subscription, profile
  const [selectedClient, setSelectedClient] = useState(null)
  const [resetClient, setResetClient] = useState(null)

  const handleAdminLogin = () => setAdminView('dashboard')
  const handleMobileLogin = () => setMobileView('otp')
  const handleMobileOTP = () => setMobileView('home')
  const handleMobileLogout = () => { setMode('admin'); setAdminView('login') }

  const handleViewClient = (client) => setSelectedClient(client)
  const handleResetPassword = (client) => setResetClient(client)
  const handleSendReset = (client, method) => {
    toast.success(`Reset link sent via ${method.toUpperCase()} to ${method === 'sms' ? client.phone : client.email}`)
  }

  const handleMobileNavigate = (view) => setMobileView(view)
  // Render Mobile App
  if (mode === 'mobile') {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl">
        <Toaster position="top-right" />
        {mobileView === 'login' && <MobileLogin onLogin={handleMobileLogin} />}
        {mobileView === 'otp' && <MobileOTP onVerify={handleMobileOTP} />}
        {mobileView === 'home' && <MobileHome onNavigate={handleMobileNavigate} />}
        {mobileView === 'search' && <MobileSearch onNavigate={handleMobileNavigate} />}
        {mobileView === 'detail' && <MobileTenderDetail onBack={() => setMobileView('home')} />}
        {mobileView === 'interests' && <MobileInterests onNavigate={handleMobileNavigate} />}
        {mobileView === 'messages' && <MobileMessages onNavigate={handleMobileNavigate} />}
        {mobileView === 'subscription' && <MobileSubscription onNavigate={handleMobileNavigate} />}
        {mobileView === 'profile' && <MobileProfile onLogout={handleMobileLogout} onNavigate={handleMobileNavigate} />}
        
        {/* Mode Switcher */}
        <div className="fixed top-4 right-4 z-50">
          <button onClick={() => setMode('admin')} className="bg-navy text-white px-3 py-1 rounded-full text-xs shadow-lg">
            Switch to Admin
          </button>
        </div>
      </div>
    )
  }

  // Render Admin Panel
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Toaster position="top-right" />
      
      {adminView === 'login' ? (
        <AdminLogin onLogin={handleAdminLogin} />
      ) : (
        <>
          <Sidebar activeItem={adminView} onNavigate={setAdminView} onLogout={() => setAdminView('login')} />
          <div className="flex-1 overflow-auto">
            <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold text-navy">
                  {adminView === 'dashboard' && 'Dashboard'}
                  {adminView === 'clients' && 'Manage Clients'}
                  {adminView === 'tenders' && 'Tender Management'}
                  {adminView === 'resets' && 'Password Resets'}
                  {adminView === 'employees' && 'Employee Management'}
                  {adminView === 'reports' && 'Reports'}
                  {adminView === 'settings' && 'Settings'}
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
                  <input type="text" placeholder="Search clients..." className="pl-10 pr-4 py-2 border rounded-lg text-sm" />
                </div>
                <button className="p-2 hover:bg-slate-100 rounded-full">
                  <Bell className="w-5 h-5 text-slate" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-teal rounded-full flex items-center justify-center text-white text-sm font-medium">Y</div>
                  <span className="text-sm font-medium">Yugandhar</span>
                </div>
              </div>
            </div>
            
            {adminView === 'dashboard' && <AdminDashboard onNavigate={setAdminView} />}
            {adminView === 'clients' && (
              <ClientManagement 
                clients={sampleClients} 
                onViewClient={handleViewClient}
                onResetPassword={handleResetPassword}
              />
            )}
            {adminView === 'tenders' && <TenderManagement tenders={sampleTenders} onViewTender={() => {}} />}
            {(adminView === 'resets' || adminView === 'employees' || adminView === 'reports' || adminView === 'settings') && (
              <div className="p-6 text-center text-slate">Coming soon...</div>
            )}
          </div>
        </>
      )}

      {/* Mode Switcher */}
      <div className="fixed bottom-4 right-4 z-50">
        <button onClick={() => setMode('mobile')} className="bg-teal text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
          <span>Switch to Mobile App</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Modals */}
      <ClientDetailModal 
        client={selectedClient} 
        isOpen={!!selectedClient} 
        onClose={() => setSelectedClient(null)} 
        onReset={handleResetPassword}
      />
      <PasswordResetModal 
        client={resetClient} 
        isOpen={!!resetClient} 
        onClose={() => setResetClient(null)} 
        onSend={handleSendReset}
      />
    </div>
  )
}
