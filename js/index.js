const canvas = document.querySelector('canvas')
const uiScore = document.querySelector('#score')
const startGameBtn = document.querySelector('#StartGameBtn')
const menuModel = document.querySelector('#MenuModal')
const menuScore = document.querySelector('#MenuScore')

// Création de variables avec les fichiers audio
const blasterSfx = document.getElementById('blasterSfx');
const splashSfx = document.getElementById('splashSfx');
const deathSfx = document.getElementById('deathSfx');
blasterSfx.volume = 0.7

// Obtenir un contexte de dessin 2D à partir de l'élément HTML canvas
const context = canvas.getContext('2d')

window.onresize = function () {
    console.log("resizing ...")
    resizeCanvas()
    console.log(player.x)
    player.update()

}
//resizeCanvas()
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// Définir la largeur du canvas sur la largeur et la hauteur de la fenêtre du navigateur
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    //console.log(player.x)
    //console.log(player.y)
}

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

    update() {
        this.draw()
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
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

const friction = 0.98 // Constante pour gérer la friction
class Particule {
    // Constructeur pour initialiser une particule
    constructor(x, y, radius, color, velocity) {
        this.x = x; // Position x de la particule
        this.y = y; // Position y de la particule
        this.radius = radius; // Rayon de la particule
        this.color = color; // Couleur de la particule
        this.velocity = velocity; // Vitesse de la particule (un vecteur avec les composantes x et y)
        this.alpha = 1 // Opacité
    }

    // Méthode pour dessiner la particule
    draw() {
        // Sauvegarde l'état du contexte de dessin
        context.save()
        // Définit la transparence de la particule
        context.globalAlpha = this.alpha
        // Début d'un nouveau chemin
        context.beginPath();
        // Dessiner un cercle pour représenter la particule
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        // Remplir le cercle avec la couleur spécifiée
        context.fillStyle = this.color;
        context.fill();
        // Restaure l'état précédent du contexte de dessin (annule l'effet de globalAlpha)
        context.restore()
    }

    // Méthode pour mettre à jour la position de la particule
    update() {
        this.draw()
        // Mettre à jour la position de la particule en fonction de sa vitesse et ralentissent de plus en plus
        this.velocity.x *= friction
        this.velocity.y *= friction
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        // On dimminue l'opacité de la particule
        this.alpha -= 0.01

    }
}

// Calculer la position x et y du joueur au milieu du canvas puis on instancie le joueur
const playerX = canvas.width / 2;
const playerY = canvas.height / 2;


let player = new Player(playerX, playerY, 10, 'white');

let projectiles = []
let particules = []
let enemies = []

function init() {
    let playerX = canvas.width / 2;
    let playerY = canvas.height / 2;
    player = new Player(playerX, playerY, 10, 'white');

    projectiles = []
    particules = []
    enemies = []
    score = 0
    uiScore.innerHTML = score
    menuScore.innerHTML = score
}


function spawnEnemies() {
    setInterval(() => {
        // Générer un rayon aléatoire pour l'ennemi entre 4 et 30
        const radius = Math.random() * (30 - 4) + 8
        const color = `hsl(${Math.random() * 360}, 50%, 50%)` // HSL = Hue Saturation Lightness (Teinte, Saturation, Luminosité)
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
    }, 2000)
}

let animationId
let score = 0

// Fonction pour animer l'application
function animate() {
    // Demander au navigateur d'exécuter cette fonction en boucle, elle s'exécute à chaque frame
    animationId = requestAnimationFrame(animate);
    context.fillStyle = 'rgba(0, 0, 0, 0.1)' // Couleur RGB + Opacité. Ajouter de l'opacité donne un effet de shading à l'application
    context.fillRect(0, 0, canvas.width, canvas.height) // Effacer le contenu du canvas pour chaque frame
    player.draw(); // Dessiner le joueur
    particules.forEach((particule, particuleIndex) => {
        if (particule.alpha <= 0) {
            // Suppression des particules
            particules.splice(particuleIndex, 1)
        } else {
            particule.update() // Mise à jour des particules
        }

    })
    // Mettre à jour la position de chaque projectile
    projectiles.forEach((projectile, projectileIndex) => {

        projectile.update()

        // Suppression des projectiles quand ils arrivent sur les bords de l'écran
        if (projectile.x + projectile.radius < 0 || projectile.x - canvas.width > 0 ||
            projectile.y + projectile.radius < 0 || projectile.y - canvas.height > 0) {
            setTimeout(() => {
                projectiles.splice(projectileIndex, 1)
            }, 0)

        }

    })

    // Mettre à jour la position de chaque ennemi et gérer les collisions avec les projectiles
    enemies.forEach((enemy, enemyIndex) => {
        enemy.update()
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)

        // Vérifier s'il y a une collision entre le projectile et le joueur
        if (dist - enemy.radius - player.radius < 1) {

            deathSfx.currentTime = 0
            deathSfx.play()

            // Arrêter l'animation si une collision avec le joueur est détectée
            cancelAnimationFrame(animationId)

            // Réafficher le menu
            menuModel.style.display = 'flex'

            menuScore.innerHTML = score

        }
        projectiles.forEach((projectile, projectileIndex) => {
            // Calculer la distance entre le projectile et l'ennemi
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

            // Quand un projectile touche un ennemie
            if (dist - enemy.radius - projectile.radius < 1) {


                splashSfx.currentTime = 0
                splashSfx.play()

                // Création des particules
                for (let i = 0; i < enemy.radius * 1.5; i++) {
                    particules.push(new Particule(
                        projectile.x, projectile.y, // Coordonnées x et y du projectile comme base des coordonnées des particules
                        Math.random() * 2, // Radius des particules aléatoires
                        enemy.color, // Couleurs des particules = couleur de l'ennemie
                        {
                            // Vélocité des particules très aléatoire, qui vont simuler une explosion
                            x: (Math.random() - 0.5) * (Math.random() * 6),
                            y: (Math.random() - 0.5) * (Math.random() * 6)
                        }))
                }
                if (enemy.radius - 10 > 7) {
                    // Augmenter le score de 100 quand on réduit la taille de l'ennemie
                    score += 100
                    uiScore.innerHTML = score



                    // Utilisation de la librairie GSAP pour animer la réduction de la taille de l'ennemi
                    gsap.to(enemy, {
                        radius: enemy.radius - 12
                    })

                    setTimeout(() => {
                        // On dimminue la taille de l'ennemie et on supprime projectile du tableau en utilisant l'index
                        projectiles.splice(projectileIndex, 1)
                    }, 0)
                } else {
                    setTimeout(() => {
                        // Augmenter le score de 250 quand on élimine l'ennemie
                        score += 250
                        uiScore.innerHTML = score

                        // On supprime l'ennemie et le projectile du tableau en utilisant l'index
                        enemies.splice(enemyIndex, 1)
                        projectiles.splice(projectileIndex, 1)
                    }, 0)
                }



            }
        })
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
        x: Math.cos(angle) * 4,
        y: Math.sin(angle) * 4,
    }

    projectiles.push(new Projectile(
        canvas.width / 2, // Position x initiale au milieu du canvas
        canvas.height / 2, // Position y initiale au milieu du canvas
        5, // Rayon du projectile
        "white", // Couleur du projectile
        velocity, // Vitesse du projectile
    ))
    if (menuModel.style.display == 'none') {
        blasterSfx.currentTime = 0
        blasterSfx.play()
    }

})

// Bouton de lancement du jeu
startGameBtn.addEventListener("click", () => {
    init()
    animate() // Appeler la fonction animate pour commencer l'animation
    spawnEnemies() // Appeler la fonction pour faire apparaître les ennemies
    menuModel.style.display = 'none' // On fait disparaître le menu
})
