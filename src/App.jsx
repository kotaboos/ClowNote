import { useState, useEffect, useMemo } from 'react'
import Sidebar from './components/Sidebar.jsx'
import NoteEditor from './components/NoteEditor.jsx'

function App() {
  const [notes, setNotes] = useState([])
  const [selectedNoteId, setSelectedNoteId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const savedNotes = localStorage.getItem('clownote_notes')
    const savedTheme = localStorage.getItem('clownote_theme')
    
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
    
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark')
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('clownote_notes', JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    localStorage.setItem('clownote_theme', darkMode ? 'dark' : 'light')
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const filteredNotes = useMemo(() => {
    return notes.filter(note => 
      note.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [notes, searchQuery])

  const createNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'Без названия',
      content: '',
      updatedAt: new Date().toISOString(),
    }
    setNotes([newNote, ...notes])
    setSelectedNoteId(newNote.id)
  }

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id))
    if (selectedNoteId === id) {
      setSelectedNoteId(null)
    }
  }

  const updateNote = (id, updates) => {
    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, ...updates, updatedAt: new Date().toISOString() }
        : note
    ))
  }

  const selectedNote = notes.find(note => note.id === selectedNoteId)

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <Sidebar
        notes={filteredNotes}
        selectedNoteId={selectedNoteId}
        onSelectNote={setSelectedNoteId}
        onDeleteNote={deleteNote}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateNote={createNote}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
      />
      <NoteEditor
        note={selectedNote}
        onUpdateNote={updateNote}
        darkMode={darkMode}
      />
    </div>
  )
}

export default App
