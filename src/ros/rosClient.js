// Simple wrapper around global ROSLIB (loaded from CDN in index.html)
// Usage:
// const client = initRos({ orinIp: '192.168.1.50', port: 9090, onData, onStatus })
// client.close() to stop

export function initRos({ orinIp, port = 9090, topicName = '/science_data', messageType = 'std_msgs/String', onData, onStatus }) {
  if (!window.ROSLIB) {
    console.warn('ROSLIB not found. Make sure you added the script tag in index.html or installed roslib.')
    onStatus && onStatus({ state: 'error', message: 'ROSLIB not found' })
    return null
  }

  const url = `ws://${orinIp}:${port}`
  const ros = new window.ROSLIB.Ros({ url })

  ros.on('connection', () => {
    console.log('Connected to rosbridge at', url)
    onStatus && onStatus({ state: 'connected', url })
  })
  ros.on('error', (err) => {
    console.warn('ROS connection error', err)
    onStatus && onStatus({ state: 'error', error: err })
  })
  ros.on('close', () => {
    console.log('ROS connection closed')
    onStatus && onStatus({ state: 'closed' })
  })

  let callback = null
  const topic = new window.ROSLIB.Topic({ ros, name: topicName, messageType })

  callback = function(message) {
    const data = message.data || ''
    // Basic parsing convention used by your teammate: e.g. "t 29.5" or "h 140"
    // We'll normalize into keys: 'temp', 'hum', 'ch4' and pass back { key, value, raw }
    try {
      if (typeof data === 'string') {
        if (data.startsWith('t ')) {
          const v = data.split(' ')[1]
          onData && onData({ key: 'temp', value: v, raw: data })
          return
        }
        if (data.startsWith('h ')) {
          const v = data.split(' ')[1]
          onData && onData({ key: 'hum', value: v, raw: data })
          return
        }
        // try a few variants for CH4
        if (data.toLowerCase().startsWith('ch4 ') || data.toLowerCase().startsWith('c ') || data.toLowerCase().startsWith('m ')) {
          const v = data.split(' ')[1]
          onData && onData({ key: 'ch4', value: v, raw: data })
          return
        }
      }
    } catch (e) {
      // fallthrough
    }

    // default: deliver raw
    onData && onData({ key: 'raw', value: data, raw: data })
  }

  topic.subscribe(callback)

  return {
    ros,
    topic,
    close() {
      try {
        if (callback) topic.unsubscribe(callback)
      } catch (e) {
        console.warn('Error unsubscribing', e)
      }
      try { ros.close() } catch (e) {}
    }
  }
}
