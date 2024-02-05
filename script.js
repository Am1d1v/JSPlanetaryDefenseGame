
// Planet Class
class Planet {
    constructor(game) {
        this.game = game;
        this.x = this.game.width * 0.5;
        this.y = this.game.height * 0.5;
        this.radius = 80;
        this.image = document.querySelector('#planet');
    }

    draw(context){
        context.drawImage(this.image, this.x - 100, this.y - 100)
        if(this.game.debug){
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            context.stroke();
        }
    }
}

// Player Class
class Player{
    constructor(game){
        this.game = game;
        this.x = this.game.width * 0.5;
        this.y = this.game.height * 0.5;
        this.radius = 40;
        this.image = document.querySelector('#player');
        this.aim;
        this.angle = 0;
    }

    // Draw Player and Set Player's initial coordinated
    draw(context){
        context.save();
        context.translate(this.x, this.y)
        context.rotate(this.angle);
        context.drawImage(this.image, -this.radius, -this.radius)
        if(this.game.debug){
            context.beginPath();
            context.arc(0, 0, this.radius, 0, Math.PI * 2);
            context.stroke();
        }
        context.restore();
    }

    // Update Player's position
    update(){
        this.aim = this.game.calcAim(this.game.planet, this.game.mouse)
        this.x = this.game.planet.x + this.game.planet.radius * this.aim[0];
        this.y = this.game.planet.y + this.game.planet.radius * this.aim[1];

        // Player's Rotation
        this.angle = Math.atan2(this.aim[3], this.aim[2]);
    }

    // Player's Shoot Method
    shoot(){
        const projectile = this.game.getProjectile();
        if(projectile){
            projectile.start(this.x, this.y, this.aim[0], this.aim[1]);
        }
        console.log(projectile)
    }
}

// Object Pool. Reusable game objects
class Projectile {
    constructor(game){
        this.game = game;
        this.x;
        this.y;
        this.speedX = 1;
        this.speedY = 1;
        this.speedModifier = 10;
        this.radius = 9;
        this.free = true;
    }
    // Pull object from the object pull
    start(x, y, speedX, speedY){
        this.free = false;
        this.x = x ;
        this.y = y;
        this.speedX = speedX * this.speedModifier;
        this.speedY = speedY * this.speedModifier;
    }
    // Object becomes unactive. Make object ready to be taken from pool again
    reset(){
        this.free = true;
    }

    // Draw object(Show Object)
    draw(context){
        if(!this.free){
            context.save();
            context.beginPath();
            // Initial coordinates of object
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            context.fillStyle = 'white';
            context.fill();
            context.restore();
        }
    }

    // Move the projectile
    update(){
        if(!this.free){
            // Object Speed. Initially it has 1px per frame
            this.x += this.speedX;
            this.y += this.speedY;
        }
        // Reset if outside the visible game area
        if(this.x < 0 || this.x > this.game.width || this.y < 0 || this.y > this.game.width){
            this.reset();
        }
    }
}

// Enemy Class
class Enemy{
    constructor(game){
        this.game = game;
        this.x = 0;
        this.y = 0;
        this.radius = 30;
        this.width = this.radius * 2;
        this.height = this.radius * 2;
        this.speedX = 0;
        this.speedY = 0;
        this.free = true;
    }

    // Enemy is ready to be spawned(used)
    start(){
        this.free = false;

        // Random coordinates for enemy spawn
        this.x = Math.random() * this.game.width;
        this.y = Math.random() * this.game.height;

        const aim = this.game.calcAim(this, this.game.planet)
        
        // Enemies' speed and vector of movement
        this.speedX = aim[0];
        this.speedY = aim[1];

    }

    // Reset Enemy. Reseted enemies can be used again
    reset(){
        this.free = true;
    }

    // Show enemy
    draw(context){
        if(!this.free){
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            context.stroke();
        }
    }

    // Update enemies' data(coordinates)
    update(){
        if(!this.free){
            this.x += this.speedX;
            this.y += this.speedY;
        }
    }
}

// Game Class. Main Game Logic
class Game {
    constructor(canvas){
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.planet = new Planet(this);
        this.player = new Player(this);
        this.debug = true;

        // Projectile Pool
        this.projectilePool = [];

        // How many object we use in the pool
        this.numberOfProjectiles = 30;

        // Call projectile pool when the game is ready
        this.createProjectilePool();

        // Array of enemies
        this.enemyPool = [];

        // Number of enemies
        this.numberOfEnemies = 10;

        // Spawn enemies
        this.createEnemyPool();

        this.enemyPool[0].start();
        this.enemyPool[1].start();
        this.enemyPool[2].start();
        this.enemyPool[3].start();
        this.enemyPool[4].start();
        this.enemyPool[5].start();
        
        // Initial mouse coordinates values
        this.mouse = {
            x: 0,
            y:0
        }
        

        // Event Listeners
        // Change mouse coordinates
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
        });

        // Debug mode
        window.addEventListener('keyup', (e) => {
            if(e.key === 'd'){
                this.debug = !this.debug;
            }
        })

        // Shoot 
        window.addEventListener('mousedown', (e) => {
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
            this.player.shoot();
        });

    }

    // Will be called for each animation frame
    render(context){
        this.planet.draw(context);
        this.player.draw(context);
        this.player.update()

        // Draw every projectile
        this.projectilePool.forEach((projectile) => {
            projectile.draw(context);
            projectile.update();
        })

        // Draw enemy
        this.enemyPool.forEach((enemy) => {
            enemy.draw(context);
            enemy.update();
        })
    }

    // Set Player's cooidinates depending on where the currently mouse is 
    calcAim(a, b){
        // Horizontal Difference
        const dx = a.x - b.x;
        // Vertical Difference
        const dy = a.y - b.y;

        const distance = Math.hypot(dx, dy);

        // Player's Horizontal and Vertical Directions
        const aimX = dx / distance * -1;
        const aimY = dy / distance * -1;

        return [aimX, aimY, dx, dy]
    }

    // Create new Projectile
    createProjectilePool(){
        for(let i = 0; i < this.numberOfProjectiles; i++){
            this.projectilePool.push(new Projectile(this));
        }
    };

    // If projectile is ready to be used, we can call projectile again
    getProjectile(){
        for(let i = 0; i < this.projectilePool.length; i++){
            // Check is pool object free
           if(this.projectilePool[i].free){
            return this.projectilePool[i];
           }
        }
    }

     // Create an array of enemies.
     createEnemyPool(){
        for (let i = 0; i < this.numberOfEnemies; i++) {
            this.enemyPool.push(new Enemy(this))
        }
     }

     // If enemy is free, we can spawn it again
     getEnemy(){
        for(let i = 0; i < this.enemyPool.lengthl; i++){
            if(this.enemyPool[i].free){
                return this.enemyPool[i];
            }
        }
     }

}

// Load Canvas
window.addEventListener('load', () => {

    // Canvas and Canvas Context
    const canvas = document.querySelector('#canvas1');
    const context = canvas.getContext('2d');

    // Canvas Width and Height
    canvas.width = 800;
    canvas.height = 800;

    // Context Configuration
    context.strokeStyle = 'white';
    context.lineWidth = 2;

    // Instantiate Game Class
    const game = new Game(canvas);
    game.render(context);

    // Animation
    function animate(){
        // Clear Canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        game.render(context);
        window.requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate)

});