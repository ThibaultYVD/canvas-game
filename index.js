const canvas = document.querySelector('canvas');

// Obtenir un contexte de dessin 2D à partir de l'élément HTML canvas
const context = canvas.getContext('2d')

// Définir la largeur du canvas sur la largeur de la fenêtre du navigateur
canvas.width = window.innerWidth;

// Définir la hauteur du canvas sur la hauteur de la fenêtre du navigateur
canvas.height = window.innerHeight;

class Player {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }

    drawPlayer() {
        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        context.fillStyle = this.color
        context.fill()
    }
}

const x = canvas.width / 2
const y = canvas.height / 2
const player = new Player(x, y, 30, 'blue')

player.drawPlayer();
console.log(player)