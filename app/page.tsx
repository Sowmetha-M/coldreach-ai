'use client'

import { useState } from 'react'

interface GeneratedMessage {
  subject: string
  greeting: string
  body: string
  call_to_action: string
  closing: string
}

export default function Home() {
  const [purpose, setPurpose] = useState('Job application')
  const [recipientRole, setRecipientRole] = useState('Recruiter')
  const [tone, setTone] = useState('Formal')
  const [context, setContext] = useState('')
  const [generatedMessage, setGeneratedMessage] = useState<GeneratedMessage | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setGeneratedMessage(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purpose, recipientRole, tone, context }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate message')
      }

      const data = await response.json()
      setGeneratedMessage(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-12">
      <div className="w-full max-w-xl">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-slate-900 mb-3">ColdReach AI</h1>
          <p className="text-lg text-slate-600">
            Professional cold emails & LinkedIn messages — instantly.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Purpose
                </label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option>Job application</option>
                  <option>Internship</option>
                  <option>Referral</option>
                  <option>Networking</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option>Formal</option>
                  <option>Friendly</option>
                  <option>Confident</option>
                </select>
              </div>
            </div>

            {/* Hidden but kept for backend */}
            <select
              value={recipientRole}
              onChange={(e) => setRecipientRole(e.target.value)}
              className="hidden"
            >
              <option>Recruiter</option>
              <option>HR</option>
              <option>Engineer</option>
              <option>Manager</option>
            </select>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Your Background <span className="text-slate-500 font-normal">(optional)</span>
              </label>
              <textarea
                rows={4}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="I'm a final-year computer science student applying for a software engineering internship..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Generating...' : 'Generate Message'}
            </button>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Output Card */}
        {generatedMessage && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Generated Message
            </h2>

            <div className="bg-gray-50 rounded-lg p-6 space-y-5 mb-6 text-[15px]">
              <div>
                <p className="text-sm font-semibold text-slate-700">Subject</p>
                <p className="text-slate-900 font-medium">{generatedMessage.subject}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700">Greeting</p>
                <p className="text-slate-900">{generatedMessage.greeting}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700">Body</p>
                <p className="text-slate-900 whitespace-pre-line leading-relaxed">
                  {generatedMessage.body}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700">Call to Action</p>
                <p className="text-slate-900">{generatedMessage.call_to_action}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700">Closing</p>
                <p className="text-slate-900">{generatedMessage.closing}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${generatedMessage.subject}\n\n${generatedMessage.greeting}\n\n${generatedMessage.body}\n\n${generatedMessage.call_to_action}\n\n${generatedMessage.closing}`
                  )
                }
                className="flex-1 rounded-lg border border-gray-300 py-2 font-semibold hover:bg-gray-50 transition"
              >
                Copy Message
              </button>

              <button
                onClick={() => setGeneratedMessage(null)}
                className="flex-1 rounded-lg py-2 font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition"
              >
                Generate Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
