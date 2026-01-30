import React, { useEffect, useState } from 'react'
import api from '../api'

const NotesPage = ({ setPage }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [noteDate, setNoteDate] = useState(new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingId, setEditingId] = useState(null)

  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const username = user?.username

  useEffect(() => {
    if (username) fetchNotes()
  }, [username])

  const fetchNotes = async () => {
    try {
      const res = await api.get(`/api/notes/user/${username}`)
      const data = res.data || []
      const normalized = data.map(n => {
        let id = n?.id || n?._id;

        if (id && typeof id === 'object') {
          // MongoDB often sends { $oid: "..." } or an object that stringifies to the hex string
          // We prioritize $oid, then toString() if it's not the generic [object Object]
          id = id.$oid || (typeof id.toString === 'function' && id.toString() !== '[object Object]' ? id.toString() : null);
        }

        // If it's still a number or contains only digits, it's likely a timestamp, not a valid hex ID
        if (typeof id === 'number' || (typeof id === 'string' && /^\d+$/.test(id))) {
          console.warn('INTERNALLY REJECTING NUMERIC ID:', id);
          id = null;
        }

        console.log('Normalized Note ID:', id, 'from origin:', n.id || n._id);

        if (!id || id === '[object Object]') {
          console.error('CRITICAL: Failed to normalize ID for note:', n);
        }
        return { ...n, id }
      })
      setNotes(normalized)
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

      if (editingId) {
        await api.put(`/api/notes/${editingId}`, payload)
        setSuccess('Updated successfully')
        setEditingId(null)
      } else {
        await api.post('/api/notes', payload)
        setSuccess('Saved successfully')
      }

      setTitle('')
      setContent('')
      setNoteDate(new Date().toISOString().slice(0, 10))
      fetchNotes()
    } catch (err) {
      console.error('SAVE ERROR:', err.response || err)
      const errorMsg = err.response?.data?.message || err.response?.data || err.message || 'Action failed'
      setError(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg)
    }
  }

  const handleEdit = (note) => {
    setEditingId(note.id)
    setTitle(note.title)
    setContent(note.content)
    setNoteDate(note.noteDate || new Date().toISOString().slice(0, 10))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return

    try {
      await api.delete(`/api/notes/${id}`)
      setSuccess('Deleted successfully')
      fetchNotes()
    } catch (err) {
      console.error('DELETE ERROR:', err.response || err)
      setError('Delete failed')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setTitle('')
    setContent('')
    setNoteDate(new Date().toISOString().slice(0, 10))
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
          <span className="mr-4 text-gray-600 font-medium">{username}</span>
          <button onClick={handleLogout} className="text-red-500 hover:underline">Logout</button>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          {editingId ? 'Edit Note' : 'Add New Note'}
        </h3>
        {success && <div className="text-green-600 bg-green-50 p-3 rounded mb-4">{success}</div>}
        {error && <div className="text-red-600 bg-red-50 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input type="date" value={noteDate} onChange={e => setNoteDate(e.target.value)} className="mt-1 block w-full rounded border px-3 py-2 focus:ring-orange-400 focus:border-orange-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Note title" className="mt-1 block w-full rounded border px-3 py-2 focus:ring-orange-400 focus:border-orange-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} rows={6} placeholder="Write your thoughts..." className="mt-1 block w-full rounded border px-3 py-2 focus:ring-orange-400 focus:border-orange-400" />
          </div>
          <div className="flex gap-4">
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md transition-colors shadow-sm font-medium">
              {editingId ? 'Update Note' : 'Save Note'}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-md transition-colors font-medium">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Your Timeline</h3>
        {notes.length === 0 && <div className="text-gray-500 italic text-center py-8 bg-gray-50 rounded-lg">No notes yet. Start writing!</div>}
        <div className="space-y-6">
          {notes.map((n, index) => (
            <div key={n.id ?? index} className="group border-l-4 border-orange-400 rounded-r-lg p-5 bg-white shadow-sm hover:shadow-md transition-shadow relative">
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded inline-block">{n.noteDate}</div>
                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(n)} className="text-blue-500 hover:text-blue-700 font-medium text-sm">Edit</button>
                  <button onClick={() => handleDelete(n.id)} className="text-red-500 hover:text-red-700 font-medium text-sm">Delete</button>
                </div>
              </div>
              <h4 className="font-bold text-xl text-gray-900 mb-2">{n.title}</h4>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{n.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NotesPage
