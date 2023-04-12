import * as THREE from "three"
import Experience from "../Experience.js"

export default class Cube {
	constructor(position) {
		this.experience = new Experience()
		this.scene = this.experience.scene

		this.initialPosition = {
			x: position.x,
			y: position.y,
			z: position.z,
		}

		this.setGeometry()
		this.setMaterial()
		this.setMesh()

		this.rotation = {
			speed: {
				x: Math.random() * 2 - 1,
				y: Math.random() * 2 - 1,
				z: Math.random() * 2 - 1,
			},
		}

		this.randomDirection = {
			x: Math.random() * 2 - 1,
			y: Math.random() * 2 - 1,
		}
	}

	setGeometry() {
		this.geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
	}

	setMaterial() {
		this.material = new THREE.MeshStandardMaterial({
			color: new THREE.Color(
				Math.round(Math.random()),
				Math.round(Math.random()),
				Math.round(Math.random())
			),
		})
	}

	setMesh() {
		this.mesh = new THREE.Mesh(this.geometry, this.material)

		this.mesh.position.x = this.initialPosition.x
		this.mesh.position.y = this.initialPosition.y
		this.mesh.position.z = this.initialPosition.z

		this.mesh.receiveShadow = true
		this.mesh.castShadow = true
		this.scene.add(this.mesh)
	}

	update() {
		this.mesh.rotation.x += this.rotation.speed.x
		this.mesh.rotation.y += this.rotation.speed.y
		this.mesh.rotation.z += this.rotation.speed.z

		this.mesh.position.x += this.randomDirection.x * 0.1
		this.mesh.position.y += this.randomDirection.y * 0.1
	}

	destroy() {
		this.scene.remove(this.mesh)
	}
}
