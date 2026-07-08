import { useState, useEffect } from 'react'
import styles from '../styles/Sidebar.module.css'

function Sidebar({ 
  notes, 
  selectedNoteId, 
  onSelectNote, 
  onDeleteNote, 
  searchQuery, 
  onSearchChange, 
  onCreateNote,
  darkMode,
  onToggleTheme
}) {
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    setIsSearching(searchQuery.length > 0)
  }, [searchQuery])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const noteDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    
    if (noteDate.getTime() === today.getTime()) {
      return 'Сегодня'
    }
    
    const yesterday = new Date(today.getTime() - 86400000)
    if (noteDate.getTime() === yesterday.getTime()) {
      return 'Вчера'
    }
    
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className={`${styles.sidebar} ${darkMode ? styles.dark : ''}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>ClowNote</h1>
        <button 
          className={`${styles.themeToggle} ${darkMode ? styles.dark : ''}`}
          onClick={onToggleTheme}
          title={darkMode ? 'Светлая тема' : 'Тёмная тема'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
      
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Поиск заметок..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
        {isSearching && (
          <button 
            className={styles.clearButton}
            onClick={() => onSearchChange('')}
          >
            ✕
          </button>
        )}
      </div>
      
      <button 
        className={styles.newNoteButton}
        onClick={onCreateNote}
      >
        + Новая заметка
      </button>
      
      <div className={styles.notesList}>
        {notes.length === 0 ? (
          <div className={styles.emptyState}>
            {isSearching 
              ? 'Заметки не найдены'
              : 'У вас пока нет заметок'
            }
          </div>
        ) : (
          notes.map(note => (
            <div
              key={note.id}
              className={`${styles.noteItem} ${selectedNoteId === note.id ? styles.active : ''}`}
              onClick={() => onSelectNote(note.id)}
            >
              <div className={styles.noteHeader}>
                <h3 className={styles.noteTitle}>{note.title || 'Без названия'}</h3>
                <button
                  className={styles.deleteButton}
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteNote(note.id)
                  }}
                  title="Удалить заметку"
                >
                  🗑️
                </button>
              </div>
              <p className={styles.notePreview}>
                {note.content ? note.content.split('\n')[0] : 'Нет содержимого'}
              </p>
              <span className={styles.noteDate}>{formatDate(note.updatedAt)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Sidebar
