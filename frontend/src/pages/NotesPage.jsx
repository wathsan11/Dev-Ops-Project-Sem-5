import React, { useEffect, useState } from 'react'
import api from '../api'

const NotesPage = ({ setPage }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [noteDate, setNoteDate] = useState(new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const username = user?.username

  useEffect(() => {
    if (username) fetchNotes()
  }, [username])

  const fetchNotes = async () => {
    try {
      const res = await api.get(`/api/notes/user/${username}`)
      setNotes(res.data || [])
    } catch (err) {
      console.error('FETCH NOTES ERROR:', err.response || err)
      const errorMsg = err.response?.data?.message || err.response?.data || err.message || 'Could not load notes'
      setError(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!title || !content) {
      setError('Please provide title and content')
      return
    }

    try {
      const payload = {
        username,
        title,
        content,
        noteDate
      }
      console.log('USERNAME:', username)
      const res = await api.post('/api/notes', payload)
      setSuccess('Saved')
      setTitle('')
      setContent('')
      fetchNotes()
    } catch (err) {
      console.error('SAVE ERROR:', err.response || err)
      const errorMsg = err.response?.data?.message || err.response?.data || err.message || 'Save failed'
      setError(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    setPage('login')
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Diary</h2>
        <div>
          <span className="mr-4 text-gray-600">{username}</span>
          <button onClick={handleLogout} className="text-orange-500">Logout</button>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow mb-6">
        {success && <div className="text-green-600 mb-2">{success}</div>}
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input type="date" value={noteDate} onChange={e => setNoteDate(e.target.value)} className="mt-1 block w-full rounded border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full rounded border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} rows={6} className="mt-1 block w-full rounded border px-3 py-2" />
          </div>
          <div>
            <button type="submit" className="bg-orange-400 text-white px-4 py-2 rounded">Save Note</button>
          </div>
        </form>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Your Notes</h3>
        {notes.length === 0 && <div className="text-gray-600">No notes yet.</div>}
        <div className="space-y-4">
          {notes.map((n, index) => (
            <div key={n._id?.$oid || n._id?.toString() || index} className="border rounded p-4 bg-white">
              <div className="text-sm text-gray-500 mb-1">{n.noteDate}</div>
              <div className="font-semibold text-lg">{n.title}</div>
              <div className="mt-2 text-gray-800 whitespace-pre-wrap">{n.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NotesPage
