import React, { useState, useRef, useEffect } from 'react'

export default function Terminal({ lines = [], onSubmit = () => {} }) {
  const [input, setInput] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [lines])

  const submit = () => {
    if (input.trim() === '') return
    onSubmit(input.trim())
    setInput('')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      submit()
    }
  }

  return (
    <div className="terminal-wrap">
      <div className="terminal">
        {lines.map((ln, i) => (
          <div key={i} className="terminal-line">{ln}</div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="terminal-input">
        <span className="prompt">rover@rosbridge:~$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder='JSON veya komut girin, örn: {"pose":{"x":1}}'
        />
        <button onClick={submit}>Gönder</button>
      </div>
    </div>
  )
}
