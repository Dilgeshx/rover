import React, { useState, useEffect } from 'react'
import { initRos } from './ros/rosClient'

export default function App() {
  // sample sensor values (we keep setter so ros callbacks can update them)
  const [sensors, setSensors] = useState([
    { id: 'temp', label: 'SICAKLIK', value: '—' },
    { id: 'hum', label: 'NEM', value: '—' },
    { id: 'ch4', label: 'CH4 YOĞUNLUĞU', value: '—' }
  ])

  const [rosClient, setRosClient] = useState(null)
  const [rosStatus, setRosStatus] = useState({ state: 'idle' })

  // intro text to show on load
  const [introText, setIntroText] = useState('')

  useEffect(() => {
    // show a simple welcome message on entry
    setIntroText('Hoşgeldiniz — GTU Rover kontrol paneli')
  }, [])

  // initialize ROS connection (fill in your Orin IP)
  useEffect(() => {
    // IMPORTANT: change this to your Orin IP on the network
    const ORIN_IP = '192.168.x.x' // <-- set your Orin IP here
    const ROSBRIDGE_PORT = 9090

    const client = initRos({
      orinIp: ORIN_IP,
      port: ROSBRIDGE_PORT,
      topicName: '/science_data',
      messageType: 'std_msgs/String',
      onStatus: (s) => setRosStatus(s),
      onData: (msg) => {
        // msg = { key, value, raw }
        if (!msg || !msg.key) return
        setSensors((prev) => prev.map((p) => (p.id === msg.key ? { ...p, value: msg.value } : p)))
      }
    })

    setRosClient(client)

    return () => {
      try { client && client.close() } catch (e) {}
    }
  }, [])

  // Typewriter for title
  const fullTitle = '<gtu-rover>'
  const [typedTitle, setTypedTitle] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [typingDone, setTypingDone] = useState(false)

  useEffect(() => {
    let i = 0
    setTypedTitle('')
    setShowCursor(true)
    setTypingDone(false)
    const t = setInterval(() => {
      i += 1
      setTypedTitle(fullTitle.slice(0, i))
      if (i >= fullTitle.length) {
        clearInterval(t)
        setTypingDone(true)
        // keep cursor blinking
        setShowCursor(true)
      }
    }, 100)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="app-root">
      <header className="header header-mock">
        <div className="title-box">
          <span className={`typewriter-text ${typingDone ? 'glow' : ''}`}>{typedTitle}</span>
          {/* cursor glyph replaced by a CSS-drawn thin block for consistent thin appearance */}
          <span className={`typewriter-cursor ${showCursor ? 'blink' : ''} ${typingDone ? 'retro' : ''}`}></span>
        </div>
      </header>

      <section className="dashboard mock-layout">
        <div className="sensors">
          {sensors.map((s) => (
            <div className="sensor" key={s.id}>
              <div className="sensor-label">{`>${s.label}`}</div>
              <div className="sensor-card">
                <div className="sensor-card-inner">{s.value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="intro-section">
        <div className="intro-box">{introText} {rosStatus && rosStatus.state ? ` — ${rosStatus.state}` : ''}</div>
      </section>
    </div>
  )
}

function formatObject(obj, prefix = '') {
  const out = []
  if (obj === null) return [`${prefix}null`]
  if (typeof obj !== 'object') return [`${prefix}${String(obj)}`]
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => {
      out.push(...formatObject(v, `${prefix}[${i}]: `))
    })
    return out
  }
  Object.keys(obj).forEach((k) => {
    const v = obj[k]
    if (v && typeof v === 'object') {
      out.push(`${prefix}${k}:`)
      out.push(...formatObject(v, `${prefix}  `))
    } else {
      out.push(`${prefix}${k}: ${String(v)}`)
    }
  })
  return out
}
