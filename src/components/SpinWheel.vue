<template>
  <VueWinWheel
    ref="winWheel"
    :options="allOptions"
    :canvasWidth="canvasWidth"
    :canvasHeight="canvasHeight"
    :stopAt="stopAt"
  />
  <br />
  <br />
  <br />
  <button @click="spinWinWheel">Random Spin</button>
  <button @click="spinWinWheelStopAt">Defined Spin</button>
</template>

<script setup>
import { VueWinWheel } from '@zohaibtariq/vuewinwheel'
import '@zohaibtariq/vuewinwheel/dist/style.css'
import { ref, onMounted } from 'vue'

const winWheel = ref()

const spinWinWheel = () => {
  spinStartTime = Date.now() // if you miss this sound will not play after first run
  if (winWheel.value) winWheel.value.spin() // winWheelInstances is only required for the (2 part wheel)
}

const spinWinWheelStopAt = () => {
  spinStartTime = Date.now() // if you miss this sound will not play after first run
  if (winWheel.value) winWheel.value.spinAndStopAt(stopAt)
}

const canvasWidth = 500 // set custom canvas width
const canvasHeight = 500 // set custom canvas height
const stopAt = 3 // Segment at which you want to stop at

let spinningAudio = new Audio('./spinning.mp3') // update this with your own tik sound
let winnerAudio = new Audio('./winner.mp3') // update this with your own win sound

// Called when the animation has finished.
function spinStopped(indicatedSegment) {
  playWinningSound()
  // Display different message if win/lose/bankrupt.
  // this must need to be updated according to your segment text
  if (indicatedSegment.text == 'LOOSE TURN') alert('Sorry but you loose a turn.')
  else if (indicatedSegment.text == 'BANKRUPT') alert('Oh no, you have gone BANKRUPT!')
  else alert('You have won ' + indicatedSegment.text)
}

function eachSegmentSpin() {
  playSpinningSound()
}

let spinStartTime

function playSpinningSound() {
  if (!spinStartTime) {
    spinStartTime = Date.now() // this must start when spin starts
  }
  spinningAudio.pause()
  const spinEndTime = Date.now()
  const diffInSpinTime = spinEndTime - spinStartTime
  // do not play this sound if animation time is exceeded
  if (
    options?.animation?.duration === undefined ||
    diffInSpinTime < (options.animation.duration * 1000) / 1.4
  ) {
    // if you observe wheel stop but tik sound continues to play increase value of 1.4 to gradually a higher digit number like 1.5, 1.6 what ever suites you, animation duration and spin setting effects it
    spinningAudio.currentTime = 0
    spinningAudio.play()
  }
}

function playWinningSound() {
  winnerAudio.pause()
  winnerAudio.currentTime = 0
  winnerAudio.play()
}

const options = {
  // wheel_of_fortune
  outerRadius: 212, // Set outer radius so wheel fits inside the background.
  innerRadius: 75, // Make wheel hollow so segments don't go all way to center.
  textFontSize: 24, // Set default font size for the segments.
  textOrientation: 'vertical', // Make text vertical so goes down from the outside of wheel.
  textAlignment: 'outer', // Align text to outside of wheel.
  numSegments: 24, // Specify number of segments.
  // Define segments including colour and text.
  segments: [
    // font size and text colour overridden on bankrupt segments.
    { fillStyle: '#ee1c24', text: '300' },
    { fillStyle: '#3cb878', text: '450' },
    { fillStyle: '#f6989d', text: '600' },
    { fillStyle: '#00aef0', text: '750' },
    { fillStyle: '#f26522', text: '500' },
    { fillStyle: '#000000', text: 'BANKRUPT', textFontSize: 16, textFillStyle: '#ffffff' },
    { fillStyle: '#e70697', text: '3000' },
    { fillStyle: '#fff200', text: '600' },
    { fillStyle: '#f6989d', text: '700' },
    { fillStyle: '#ee1c24', text: '350' },
    { fillStyle: '#3cb878', text: '500' },
    { fillStyle: '#f26522', text: '800' },
    { fillStyle: '#a186be', text: '300' },
    { fillStyle: '#fff200', text: '400' },
    { fillStyle: '#00aef0', text: '650' },
    { fillStyle: '#ee1c24', text: '1000' },
    { fillStyle: '#f6989d', text: '500' },
    { fillStyle: '#f26522', text: '400' },
    { fillStyle: '#3cb878', text: '900' },
    { fillStyle: '#000000', text: 'BANKRUPT', textFontSize: 16, textFillStyle: '#ffffff' },
    { fillStyle: '#a186be', text: '600' },
    { fillStyle: '#fff200', text: '700' },
    { fillStyle: '#00aef0', text: '800' },
    { fillStyle: '#ffffff', text: 'LOOSE TURN', textFontSize: 12 }
  ],
  // Specify the animation to use.
  animation: {
    type: 'spinToStop',
    duration: 3,
    spins: 10,
    callbackFinished: spinStopped, // Function to call when the spinning has stopped.
    callbackSound: eachSegmentSpin, // Called when the tick sound is to be played.
    soundTrigger: 'pin' // Specify pins are to trigger the sound.
  },
  // Turn pins on.
  pins: {
    number: 24,
    fillStyle: 'silver',
    outerRadius: 4
  }
}

const allOptions = {
  ...options,
  outerRadius: canvasWidth / 2 - (options.lineWidth || 1)
}

onMounted(() => {
  allOptions.outerRadius = canvasWidth / 2 - (options.lineWidth || 1)
})
</script>

<style scoped>
/* Define your css here inspect dom to see what ids and classes are available */
</style>
