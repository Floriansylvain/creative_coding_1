import * as THREE from "three"
import Experience from "../Experience.js"

export default class Sphere {
	constructor() {
		this.experience = new Experience()
		this.scene = this.experience.scene
		this.resources = this.experience.resources
		this.debug = this.experience.debug

		this.setSphere()
	}

	setSphere() {
		this.sphere = new THREE.Mesh(
			new THREE.SphereGeometry(0.1, 16, 16),
			new THREE.MeshStandardMaterial({
				color: "#ffffff",
			})
		)
		this.sphere.receiveShadow = true
		this.sphere.castShadow = true
		this.scene.add(this.sphere)
	}

	update() {}

	destroy() {
		this.scene.remove(this.sphere)
	}
}
