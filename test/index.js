import * as Tone from 'tone'
import { Midi } from '@tonejs/midi'

const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let animationId
let gameRunning = false
let notes = []
let startTime = null
const noteSpeed = 100 // 音符掉落速度

document.getElementById('midiInput').addEventListener('change', async function (event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()

    reader.onload = async function (e) {
      const arrayBuffer = e.target.result
      const midi = new Midi(arrayBuffer)
      processMIDI(midi)
      await playMIDI(midi)
    }

    reader.readAsArrayBuffer(file)
  }
})

document.getElementById('startButton').addEventListener('click', startGame)
document.getElementById('stopButton').addEventListener('click', stopGame)

async function playMIDI(midi) {
  await Tone.start()

  const sampler = new Tone.Sampler({
    urls: {
      A0: 'A0.mp3',
      C1: 'C1.mp3',
      'D#1': 'Ds1.mp3',
      'F#1': 'Fs1.mp3',
      A1: 'A1.mp3',
      C2: 'C2.mp3',
      'D#2': 'Ds2.mp3',
      'F#2': 'Fs2.mp3',
      A2: 'A2.mp3',
      C3: 'C3.mp3',
      'D#3': 'Ds3.mp3',
      'F#3': 'Fs3.mp3',
      A3: 'A3.mp3',
      C4: 'C4.mp3',
      'D#4': 'Ds4.mp3',
      'F#4': 'Fs4.mp3',
      A4: 'A4.mp3',
      C5: 'C5.mp3',
      'D#5': 'Ds5.mp3',
      'F#5': 'Fs5.mp3',
      A5: 'A5.mp3',
      C6: 'C6.mp3',
      'D#6': 'Ds6.mp3',
      'F#6': 'Fs6.mp3',
      A6: 'A6.mp3',
      C7: 'C7.mp3',
      'D#7': 'Ds7.mp3',
      'F#7': 'Fs7.mp3',
      A7: 'A7.mp3',
      C8: 'C8.mp3'
    },
    release: 1,
    baseUrl: 'https://tonejs.github.io/audio/salamander/'
  }).toDestination()

  await sampler.loaded
  window.currentSampler = sampler

  notes.forEach((note) => {
    Tone.Transport.schedule((time) => {
      sampler.triggerAttackRelease(note.name, note.duration, time, note.velocity)
    }, note.time)
  })

  Tone.Transport.start()
}

function processMIDI(midi) {
  notes = []
  midi.tracks.forEach((track) => {
    track.notes.forEach((note) => {
      notes.push({
        time: note.time,
        name: note.name,
        duration: note.duration,
        velocity: note.velocity
      })
    })
  })
  notes.sort((a, b) => a.time - b.time) // 按时间排序
}

function gameLoop(timestamp) {
  if (!startTime) startTime = timestamp
  const elapsed = (timestamp - startTime) / 1000

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 绘制音符
  notes.forEach((note) => {
    const y = (elapsed - note.time) * noteSpeed
    if (y > 0 && y < canvas.height) {
      drawNote(note, y)
    }
  })

  if (gameRunning) {
    animationId = requestAnimationFrame(gameLoop)
  }
}

function drawNote(note, y) {
  const track1 = [
    'C3',
    'F3',
    'B3',
    'E4',
    'A4',
    'D5',
    'G5',
    'D3',
    'G3',
    'C4',
    'F4',
    'B4',
    'E5',
    'A5',
    'E3',
    'A3',
    'D4',
    'G4',
    'C5',
    'F5',
    'B5'
  ]
  // const track2 = ['D3', 'G3', 'C4', 'F4', 'B4', 'E5', 'A5']
  // const track3 = ['E3', 'A3', 'D4', 'G4', 'C5', 'F5', 'B5']
  const index = track1.indexOf(note.name)
  if (index >= 0) {
    const x = getNoteXPosition(index)
    ctx.fillStyle = 'black'
    ctx.fillRect(x, y, 50, 10) // 绘制简单的矩形代表音符
  }
}

function getNoteXPosition(index) {
  // 简单映射音符到屏幕位置，可以根据需要调整
  // const keys = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

  // const octave = parseInt(noteName.slice(-1))
  const key = noteName.slice(0, -1)
  return 300 + (index % 3) * 60 + canvas.width / 2
}

function startGame() {
  startTime = null
  gameRunning = true
  gameLoop()
  if (window.currentSampler && notes.length > 0) {
    Tone.Transport.start()
  }
}

function stopGame() {
  gameRunning = false
  cancelAnimationFrame(animationId)
  if (window.currentSampler) {
    Tone.Transport.stop()
    window.currentSampler.dispose()
    window.currentSampler = null
  }
}

const keyMap = {
  A: 'C4',
  S: 'D4',
  D: 'E4',
  F: 'F4',
  G: 'G4',
  H: 'A4',
  J: 'B4',
  K: 'C5'
}

window.addEventListener('keydown', (event) => {
  const noteName = keyMap[event.key.toUpperCase()]
  if (noteName) {
    checkNoteHit(noteName)
  }
})

function checkNoteHit(noteName) {
  const currentTime = Tone.Transport.seconds
  const hitWindow = 0.1 // 击打判定时间窗口，单位为秒
  const note = notes.find((n) => n.name === noteName && Math.abs(currentTime - n.time) < hitWindow)
  if (note) {
    console.log(`Hit note: ${noteName}`)
    // 可以增加击中音符的视觉反馈
  } else {
    console.log(`Missed note: ${noteName}`)
  }
}
