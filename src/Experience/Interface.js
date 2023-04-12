import EventEmitter from './Utils/EventEmitter.js'
import Experience from './Experience.js'

export default class Interface extends EventEmitter
{
    constructor()
    {
        super()

        this.experience = new Experience()
        this.resources = this.experience.resources

        this.$loader = document.querySelector('.loader')
        this.$startBtn = document.querySelector('.start-btn')

        // Resources loaded
        this.resources.on('ready', () => {
            this.$loader.classList.remove('is-active')
            this.$startBtn.classList.add('is-active')

            this.$startBtn.addEventListener('click', () => {
                this.trigger('startExperience')
                this.$startBtn.classList.remove('is-active')
            })
        })
    }
}