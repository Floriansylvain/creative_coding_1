import EventEmitter from "./EventEmitter.js"
import Experience from "../Experience.js"

export default class AudioAnalyser extends EventEmitter {
	constructor(audioPath, fftSize = 1024) {
		super()

		this.experience = new Experience()
		this.scene = this.experience.scene
		this.resources = this.experience.resources
		this.interface = this.experience.interface

		this.averageFrequencies = 0
		this.averageLowFrequencies = 0
		this.averageMidFrequencies = 0
		this.averageHighFrequencies = 0

		this.interface.on("startExperience", () => {
			this.audioContext = new AudioContext()
			this.analyser = this.audioContext.createAnalyser()
			this.analyser.fftSize = fftSize
			this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount)
			this.timeData = new Uint8Array(this.analyser.fftSize)

			this.isPlaying = false
			this.gainNode = this.audioContext.createGain()
			this.gainNode.gain.value = 0.1

			this.audio = new Audio(audioPath)
			this.source = this.audioContext.createMediaElementSource(this.audio)
			this.source.connect(this.analyser)
			this.source.connect(this.gainNode)
			this.gainNode.connect(this.audioContext.destination)
			this.play()
		})
	}

	play() {
		if (this.isPlaying) return

		this.isPlaying = true
		this.audio.play()
	}

	pause() {
		if (!this.isPlaying) return

		this.isPlaying = false
		this.audio.pause()
	}

	update() {
		if (!this.isPlaying) return

		this.analyser.getByteFrequencyData(this.frequencyData)
		this.analyser.getByteTimeDomainData(this.timeData)

		this.setAverageLowFrequencies()
		this.setAverageMediumFrequencies()
		this.setAverageHighFrequencies()
		this.setAverageFrequencies()
	}

	setVolume(gain) {
		this.gainNode.gain.value = gain
	}

	setAverageFrequencies() {
		// on add tous les éléments de l'array entre eux
		const total = this.frequencyData.reduce((acc, cur) => acc + cur)
		// on fait la moyenne des fréquences
		const average = total / this.frequencyData.length

		this.averageFrequencies = average / 255
	}

	setAverageLowFrequencies() {
		// On divise l'array de toutes les frequences par 3 et on prend la première partie (les fréquences les plus hautes)

		const third = Math.round(this.frequencyData.length / 3)
		const lowFrequencies = this.frequencyData.slice(0, third)

		// on add tous les éléments de l'array entre eux
		const total = lowFrequencies.reduce((acc, cur) => acc + cur)
		// on fait la moyenne des fréquences
		const average = total / lowFrequencies.length

		this.averageLowFrequencies = average / 255
	}

	setAverageMediumFrequencies() {
		// On divise l'array de toutes les frequences par 3 et on prend la deuxieme partie (les fréquences mid)
		const third = Math.round(this.frequencyData.length / 3)
		const mediumFrequencies = this.frequencyData.slice(third, third * 2)

		// on add tous les éléments de l'array entre eux
		const total = mediumFrequencies.reduce((acc, cur) => acc + cur)
		// on fait la moyenne des fréquences
		const average = total / mediumFrequencies.length

		this.averageMidFrequencies = average / 255
	}

	setAverageHighFrequencies() {
		// On divise l'array de toutes les frequences par 3 et on prend la troiseme partie (les fréquences hautes)
		const third = Math.round(this.frequencyData.length / 3)
		const highFrequencies = this.frequencyData.slice(
			third * 2,
			this.frequencyData.length - 1
		)

		// on add tous les éléments de l'array entre eux
		const total = highFrequencies.reduce((acc, cur) => acc + cur)
		// on fait la moyenne des fréquences
		const average = total / highFrequencies.length

		this.averageHighFrequencies = average / 255
	}
}
