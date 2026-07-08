import { useState, useEffect, useMemo } from 'react'
import Sidebar from './components/Sidebar.jsx'
import NoteEditor from './components/NoteEditor.jsx'

function App() {
  const [notes, setNotes] = useState([])
  const [selectedNoteId, setSelectedNoteId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [appBackground, setAppBackground] = useState('')

  useEffect(() => {
    const savedNotes = localStorage.getItem('clownote_notes')
    const savedTheme = localStorage.getItem('clownote_theme')
    const savedBackground = localStorage.getItem('clownote_background')
    
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
    
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark')
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true)
    }
    
    if (savedBackground) {
      setAppBackground(savedBackground)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('clownote_notes', JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    localStorage.setItem('clownote_theme', darkMode ? 'dark' : 'light')
    localStorage.setItem('clownote_background', appBackground)
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode, appBackground])

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

  const handleBackgroundUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setAppBackground(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeBackground = () => {
    setAppBackground('')
  }

  const getBackgroundStyle = () => {
    if (appBackground) {
      return {
        backgroundImage: `url(${appBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    }
    return { backgroundColor: darkMode ? '#0f172a' : '#f8fafc' }
  }

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`} style={getBackgroundStyle()}>
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
        appBackground={appBackground}
        onBackgroundUpload={handleBackgroundUpload}
        onRemoveBackground={removeBackground}
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
