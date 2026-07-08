import { useState, useEffect, useRef } from 'react'
import styles from '../styles/NoteEditor.module.css'

function NoteEditor({ note, onUpdateNote, darkMode }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const titleRef = useRef(null)
  const contentRef = useRef(null)
  const debounceTimerRef = useRef(null)

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content)
    } else {
      setTitle('')
      setContent('')
    }
  }, [note])

  useEffect(() => {
    if (note && titleRef.current) {
      titleRef.current.focus()
    }
  }, [note])

  const saveNote = (titleToSave, contentToSave) => {
    if (!note) return
    
    clearTimeout(debounceTimerRef.current)
    
    debounceTimerRef.current = setTimeout(() => {
      onUpdateNote(note.id, {
        title: titleToSave,
        content: contentToSave,
      })
      setIsTyping(false)
    }, 500)
  }

  const handleTitleChange = (e) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    setIsTyping(true)
    saveNote(newTitle, content)
  }

  const handleContentChange = (e) => {
    const newContent = e.target.value
    setContent(newContent)
    setIsTyping(true)
    saveNote(title, newContent)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target === titleRef.current) {
      e.preventDefault()
      contentRef.current?.focus()
    }
  }

  return (
    <div className={`${styles.editor} ${darkMode ? styles.dark : ''}`}>
      {!note ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📝</div>
          <p>Выберите заметку или создайте новую</p>
        </div>
      ) : (
        <>
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={handleTitleChange}
            onKeyDown={handleKeyDown}
            placeholder="Заголовок"
            className={styles.titleInput}
          />
          
          <textarea
            ref={contentRef}
            value={content}
            onChange={handleContentChange}
            placeholder="Начните писать..."
            className={styles.contentArea}
            spellCheck={false}
          />
          
          {isTyping && (
            <div className={styles.savingIndicator}>
              Сохранение...
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default NoteEditor
