let audioCtx: AudioContext | null = null

function getContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  return audioCtx
}

export function playCorrect() {
  try {
    const ctx = getContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.setValueAtTime(523.25, ctx.currentTime)
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1)
    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2)
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.4)
  } catch {}
}

export function playWrong() {
  try {
    const ctx = getContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.setValueAtTime(200, ctx.currentTime)
    osc.frequency.setValueAtTime(150, ctx.currentTime + 0.3)
    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.4)
  } catch {}
}

export function playLevelUp() {
  try {
    const ctx = getContext()
    const notes = [523.25, 587.33, 659.25, 783.99, 1046.5]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12)
      gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.12)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.3)
      osc.start(ctx.currentTime + i * 0.12)
      osc.stop(ctx.currentTime + i * 0.12 + 0.3)
    })
  } catch {}
}

export function playType() {
  try {
    const ctx = getContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.frequency.setValueAtTime(800 + Math.random() * 400, ctx.currentTime)
    gain.gain.setValueAtTime(0.05, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.05)
  } catch {}
}

let bgMusicPlaying = false
let bgMusicGain: GainNode | null = null

export function startBgMusic() {
  if (bgMusicPlaying) return
  bgMusicPlaying = true
  try {
    const ctx = getContext()
    bgMusicGain = ctx.createGain()
    bgMusicGain.gain.setValueAtTime(0.08, ctx.currentTime)
    bgMusicGain.connect(ctx.destination)

    function playLoop() {
      if (!bgMusicPlaying) return
      const now = ctx.currentTime
      const notes = [261.63, 329.63, 392.0, 329.63, 293.66, 349.23, 440.0, 349.23]
      const noteLen = 0.5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const noteGain = ctx.createGain()
        osc.type = 'sine'
        osc.connect(noteGain)
        if (bgMusicGain) noteGain.connect(bgMusicGain)
        noteGain.gain.setValueAtTime(0.06, now + i * noteLen)
        noteGain.gain.exponentialRampToValueAtTime(0.01, now + i * noteLen + noteLen * 0.9)
        osc.frequency.setValueAtTime(freq, now + i * noteLen)
        osc.start(now + i * noteLen)
        osc.stop(now + i * noteLen + noteLen)
      })
      setTimeout(playLoop, notes.length * noteLen * 1000)
    }
    playLoop()
  } catch {}
}

export function stopBgMusic() {
  bgMusicPlaying = false
  bgMusicGain = null
}
