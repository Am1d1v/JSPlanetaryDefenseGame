
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
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.stroke();
    }
}

// Game Class. Main Game Logic
class Game {
    constructor(canvas){
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.planet = new Planet(this);

        // Initial mouse coordinates values
        this.mouse = {
            x: 0,
            y:0
        }

        // Change mouse coordinates
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
        });
    }

    // Will be called for each animation frame
    render(context){
        this.planet.draw(context);
        context.beginPath();
        context.moveTo(this.planet.x, this.planet.y);
        context.lineTo(this.mouse.x, this.mouse.y);
        context.stroke();
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