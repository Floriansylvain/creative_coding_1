import * as THREE from "three"
import Experience from "../Experience.js"
import Environment from "./Environment.js"
import Cube from "./Cube.js"

export default class World {
	constructor() {
		this.experience = new Experience()
		this.scene = this.experience.scene
		this.interface = this.experience.interface

		this.debug = this.experience.debug

		this.mouseTimeout = undefined
		this.cubes = []

		this.colorsPick = {}

		this.marioSprite = undefined

		this.downVolTimout = undefined
		this.upVolTimout = undefined

		this.interface.on("startExperience", () => {
			this.environment = new Environment()
			this.scene.background = new THREE.Color(0x000000)
			this.updateColorPick()
			this.initMario()

			document
				.querySelector("body")
				.addEventListener("mousemove", (e) => this.onMouseMove(e))
			document
				.querySelector("body")
				.addEventListener("touchmove", (e) => this.onMouseMove(e))
		})
	}

	initMario() {
		const spriteTexture = new THREE.TextureLoader().load(
			`${import.meta.env.BASE_URL}/textures/mario.png`
		)
		const spriteMaterial = new THREE.SpriteMaterial({ map: spriteTexture })
		this.marioSprite = new THREE.Sprite(spriteMaterial)
		this.marioSprite.position.set(0, 0, 0)
		this.scene.add(this.marioSprite)
	}

	onMouseMove(event) {
		if (!this.experience.audio) return

		const mousePosition = this.getMousePosition(event)

		this.upVolume()
		this.spawnEphemeralCubes(mousePosition, 200)
		this.scene.background = new THREE.Color(this.getBackgroundRandomColor())
		this.marioSprite.position.y =
			Math.sin(this.experience.time.elapsed * 0.02) * 0.5 + 0.5

		if (this.mouseTimeout) clearTimeout(this.mouseTimeout)
		this.mouseTimeout = setTimeout(() => this.onMouseStop(), 50)
	}

	onMouseStop() {
		this.downVolume()
		this.scene.background = new THREE.Color(0x000000)
		this.marioSprite.position.y = 0
	}

	updateColorPick() {
		this.colorsPick = {
			r: Math.round(Math.random()),
			g: Math.round(Math.random()),
			b: Math.round(Math.random()),
		}
		setTimeout(() => this.updateColorPick(), 1000)
	}

	getBackgroundRandomColor() {
		return new THREE.Color(
			this.colorsPick.r * this.experience.audio.averageMidFrequencies,
			this.colorsPick.g * this.experience.audio.averageMidFrequencies,
			this.colorsPick.b * this.experience.audio.averageMidFrequencies
		)
	}

	upVolume() {
		if (this.experience.audio.gainNode.gain.value >= 0.8) return
		clearTimeout(this.downVolTimout)

		this.setVolume(
			Math.round((this.experience.audio.gainNode.gain.value + 0.1) * 10) / 10
		)
		this.upVolTimout = setTimeout(() => {
			this.upVolume()
		}, 200)
	}

	downVolume() {
		if (this.experience.audio.gainNode.gain.value <= 0.2) return
		clearTimeout(this.upVolTimout)

		this.setVolume(
			Math.round((this.experience.audio.gainNode.gain.value - 0.1) * 10) / 10
		)
		this.downVolTimout = setTimeout(() => {
			this.downVolume()
		}, 200)
	}

	setVolume(volume) {
		this.experience.audio.gainNode.gain.value = volume
	}

	getMousePosition(event) {
		const client = event.touches ? event.touches[0] : event

		const raycaster = new THREE.Raycaster()
		const mouse = {
			x: (client.clientX / window.innerWidth) * 2 - 1,
			y: -(client.clientY / window.innerHeight) * 2 + 1,
			z: 0,
		}
		raycaster.setFromCamera(mouse, window.experience.camera.instance)
		return {
			x: raycaster.ray.direction.x * 20,
			y: raycaster.ray.direction.y * 20,
			z: 0,
		}
	}

	spawnEphemeralCubes(position, quantity) {
		if (this.cubes.length > quantity) {
			this.cubes[0].destroy()
			this.cubes = this.cubes.slice(1)
		}

		const cube = new Cube(position)
		this.cubes.push(cube)

		setTimeout(() => {
			cube.destroy()
			this.cubes = this.cubes.filter((c) => c !== cube)
		}, 1000)
	}

	update() {
		if (!this.environment) return

		this.cubes.forEach((cube) => {
			cube.update()
		})
	}
}
