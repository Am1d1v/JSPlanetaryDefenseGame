
// Planer Class
class Planet{
    constructor() {
        this.x = 200;
        this.y = 200;
        this.radius = 80;
    }

    draw(context){
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.stroke();
    }
}

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

    // Instantiate Planet Class
    const planet = new Planet();
    planet.draw(context)
});