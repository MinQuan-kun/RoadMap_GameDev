import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import RoadmapBuilder from '../RoadmapBuilder'
import { createJobRoadmap, getJobRoadmap } from '../../services/recruiterApi'

const RecruiterRoadmapBuilder = () => {
  const { id } = useParams() // This is the jobId
  const navigate = useNavigate()

  const handleSaved = () => {
    // Optionally navigate back or just stay on page
    // navigate('/recruiter/jobs')
  }

  // Custom save function for the job
  const handleSaveRoadmap = async (roadmapId, payload) => {
    // Note: roadmapId is ignored here because we always post to the job endpoint 
    // and the backend handles inserting or replacing the roadmap.
    const result = await createJobRoadmap(id, payload)
    return result // e.g. { message, roadmapId }
  }

  // Custom load function for the job
  const handleLoadRoadmap = async (roadmapId) => {
    // Load the roadmap specifically for this job
    const data = await getJobRoadmap(id)
    return data // returns the roadmap detail or null if it doesn't exist
  }

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      {/* Top Navigation Bar */}
      <div className="flex items-center px-4 py-3 bg-slate-800 border-b border-slate-700">
        <button
          onClick={() => navigate('/recruiter/jobs')}
          className="flex items-center text-sm text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Quay lại danh sách công việc
        </button>
        <div className="mx-auto font-semibold text-slate-100">
          Xây dựng Roadmap cho công việc
        </div>
      </div>

      {/* Builder Content */}
      <div className="flex-1 relative">
        <RoadmapBuilder
          embedded={true}
          roadmapId={id} // Pass jobId as the pseudo roadmapId so the hook fires
          onSaved={handleSaved}
          onSaveRoadmap={handleSaveRoadmap}
          onLoadRoadmap={handleLoadRoadmap}
        />
      </div>
    </div>
  )
}

export default RecruiterRoadmapBuilder
