// import ml5 from 'ml5'
// import 'p5'

console.log('ml5 version:', ml5.version)
let video,
  classifier,
  count = 0
const cache = new Map()
const DECAY = 0.9

const result = document.createElement('div')
result.style.cssText =
  'position:fixed;top:0;right:0;padding:.2em 1em;background:#fffa'

function gotResults(err, results) {
  requestAnimationFrame(() => {
    classifier.predict(gotResults)
  })
  if (err) return
  count++
  results.forEach((r) => {
    const val = cache.get(r.label)
    if (val !== undefined) {
      cache.set(r.label, val + r.confidence)
    } else {
      cache.set(r.label, r.confidence)
    }
  })
  result.innerHTML = cache
    .toJSON()
    .sort((a, b) => b[1] - a[1])
    .map(([label, val]) => {
      cache.set(label, val * DECAY)
      const ratio = val / count
      count *= DECAY
      if (val < 0.01) {
        return ''
        // cache.delete(label)
      }
      return `<p>${label} ${Math.round(ratio * 100) / 10}%</p>`
    })
    .join('')
}

function setup() {
  createCanvas(640, 480)
  video = createCapture(VIDEO)
  video.hide()
  // video.size(32, 240)
  background(0)
  classifier = ml5.imageClassifier('MobileNet', video, modelLoaded)
  classifier.predict(gotResults)
  document.body.appendChild(result)
}

function draw() {
  image(video, 0, 0)
}

// When the model is loaded
function modelLoaded() {
  console.log('Model Loaded!')
}

function modelReady() {
  console.log(this)
}
