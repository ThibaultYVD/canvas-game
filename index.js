const canvas = document.querySelector('canvas')

// Obtenir un contexte de dessin 2D à partir de l'élément HTML canvas
const context = canvas.getContext('2d')

// Définir la largeur du canvas sur la largeur et la hauteur de la fenêtre du navigateur
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Player {
    // Constructeur pour initialiser un joueur
    constructor(x, y, radius, color) {
        // Position x et y du joueur
        this.x = x;
        this.y = y;
        this.radius = radius; // Rayon du joueur
        this.color = color; // Couleur du joueur
    }

    // Méthode pour dessiner le joueur
    draw() {
        // Début d'un nouveau chemin
        context.beginPath()
        // Dessiner un cercle pour représenter le joueur
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        // Remplir le cercle avec la couleur spécifiée
        context.fillStyle = this.color
        context.fill()
    }
}

class Projectile {
    // Constructeur pour initialiser un projectile
    constructor(x, y, radius, color, velocity) {
        this.x = x; // Position x du projectile
        this.y = y; // Position y du projectile
        this.radius = radius; // Rayon du projectile
        this.color = color; // Couleur du projectile
        this.velocity = velocity; // Vitesse du projectile (un vecteur avec les composantes x et y)
    }

    // Méthode pour dessiner le projectile
    draw() {
        // Début d'un nouveau chemin
        context.beginPath();
        // Dessiner un cercle pour représenter le projectile
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        // Remplir le cercle avec la couleur spécifiée
        context.fillStyle = this.color;
        context.fill();
    }

    // Méthode pour mettre à jour la position du projectile
    update() {
        this.draw()
        // Mettre à jour la position du projectile en fonction de sa vitesse
        this.x += this.velocity.x;
        this.y += this.velocity.y;

    }
}

class Enemy {
    // Constructeur pour initialiser un projectile
    constructor(x, y, radius, color, velocity) {
        this.x = x; // Position x du projectile
        this.y = y; // Position y du projectile
        this.radius = radius; // Rayon du projectile
        this.color = color; // Couleur du projectile
        this.velocity = velocity; // Vitesse du projectile (un vecteur avec les composantes x et y)
    }

    // Méthode pour dessiner le projectile
    draw() {
        // Début d'un nouveau chemin
        context.beginPath();
        // Dessiner un cercle pour représenter le projectile
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        // Remplir le cercle avec la couleur spécifiée
        context.fillStyle = this.color;
        context.fill();
    }

    // Méthode pour mettre à jour la position du projectile
    update() {
        this.draw()
        // Mettre à jour la position du projectile en fonction de sa vitesse
        this.x += this.velocity.x;
        this.y += this.velocity.y;

    }
}

// Calculer la position x et y du joueur au milieu du canvas puis on instancie le joueur
const playerX = canvas.width / 2;
const playerY = canvas.height / 2;
const player = new Player(playerX, playerY, 30, 'blue');


const projectiles = []
const enemies = []

function spawnEnemies() {
    setInterval(() => {
        // Générer un rayon aléatoire pour l'ennemi entre 4 et 30
        const radius = Math.random() * (30 - 4) + 4
        const color = "green"
        let x
        let y

        // Déterminer aléatoirement si l'ennemi apparaîtra sur un bord horizontal ou vertical
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            y = Math.random() * canvas.height

        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }

        // Calculer l'angle entre l'ennemi et le centre du canvas
        const angle = Math.atan2(
            canvas.height / 2 - y,
            canvas.width / 2 - x
        )

        // Calculer la vitesse de l'ennemi en fonction de l'angle
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle),
        }
        enemies.push(new Enemy(x, y, radius, color, velocity))
    }, 1000)
}

// Fonction pour animer l'application
function animate() {
    // Demander au navigateur d'exécuter cette fonction en boucle
    requestAnimationFrame(animate);
    // Effacer le contenu du canvas pour chaque frame
    context.clearRect(0, 0, canvas.width, canvas.height)
    // Dessiner le joueur
    player.draw();
    // Mettre à jour la position de chaque projectile
    projectiles.forEach(projectile => {
        projectile.update()
    })

    enemies.forEach(enemy => {
        enemy.update()
    })
}


/* A chaque fois qu'on appelle une fonction en réponse à un clic en utilisant
 * un addEventListener, le premier argument de cette fonction va être un objet "Event"
 * qui contient les détails de l'événements, dont les coordonnées de la souris lors du clic
*/
addEventListener('click', (Event) => {
    //console.log(Event)

    // Calculer l'angle entre le clic de la souris et le centre du canvas
    const angle = Math.atan2(
        Event.clientY - canvas.height / 2,
        Event.clientX - canvas.width / 2
    )

    // Calculer la vitesse du projectile en fonction de l'angle
    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle),
    }

    projectiles.push(new Projectile(
        canvas.width / 2, // Position x initiale au milieu du canvas
        canvas.height / 2, // Position y initiale au milieu du canvas
        5, // Rayon du projectile
        "red", // Couleur du projectile
        velocity, // Vitesse du projectile
    ))
})

// Appeler la fonction animate pour commencer l'animation
animate()
spawnEnemies()