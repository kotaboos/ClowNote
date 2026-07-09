import { useState, useEffect, useMemo, useCallback } from 'react'
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
      document.body.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('dark-mode')
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

  const handleBackgroundUpload = useCallback((file) => {
    console.log('🔍 handleBackgroundUpload called with file:', file?.name, 'size:', file?.size)
    
    
    if (!file) {
      console.warn('⚠️ No file provided')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Изображение слишком большое (максимум 10MB)')
      return
    }
    
    const objectUrl = URL.createObjectURL(file)
    console.log('✅ Creating blob URL:', objectUrl)

    setAppBackground(objectUrl)
  }, [])

  const removeBackground = useCallback(() => {
    onsole.log('❌ Removing background, revoking object URL if exists')
    if (appBackground && typeof appBackground === 'string' && appBackground.startsWith('blob:')) {
      URL.revokeObjectURL(appBackground)
    }
    setAppBackground('')
  }, [])

  useEffect(() => {
    if (appBackground) {
      const imageUrl = `url(${appBackground})`
      document.body.style.setProperty('--background-image', `url(${appBackground})`)
      document.body.style.setProperty('--background-size', 'cover')
      document.body.style.setProperty('--background-position', 'center')
      document.body.style.setProperty('--background-repeat', 'no-repeat')
      document.body.style.setProperty('--background-opacity', '0.15')
      document.body.classList.add('has-background')
    } else {
      document.body.style.removeProperty('--background-image')
      document.body.style.removeProperty('--background-size')
      document.body.style.removeProperty('--background-position')
      document.body.style.removeProperty('--background-repeat')
      document.body.style.removeProperty('--background-opacity')
      document.body.classList.remove('has-background')
    }
  }, [appBackground])

  return (
    <div className="app">
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
      <div className="app-content">
        <NoteEditor
          note={selectedNote}
          onUpdateNote={updateNote}
          darkMode={darkMode}
        />
      </div>
    </div>
  )
}

export default App
