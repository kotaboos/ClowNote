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

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageHtml = `<img src="${event.target.result}" alt="Встроенное изображение" style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0; display: block;" />`
        setContent(prev => prev + (prev ? '\n' : '') + imageHtml)
        setIsTyping(true)
        saveNote(title, content + (content ? '\n' : '') + imageHtml)
      }
      reader.readAsDataURL(file)
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
          
          <div className={styles.editorToolbar}>
            <label className={styles.imageUploadButton}>
              📷 Добавить фото
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className={styles.imageUploadInput}
              />
            </label>
          </div>
          
          <div 
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => {
              setContent(e.target.innerHTML)
              setIsTyping(true)
              saveNote(title, e.target.innerHTML)
            }}
            dangerouslySetInnerHTML={{ __html: content }}
            className={styles.contentArea}
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
