const canvas = document.getElementById('chainCanvas');
const ctx = canvas.getContext('2d');
let width, height, mouse = { x: -100, y: -100 };

// Chain settings
const points = [];
const numPoints = 25;
const segmentLength = 40;
const chainX = window.innerWidth * 0.15; // Positioned on the left

function init() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    for (let i = 0; i < numPoints; i++) {
        points.push({ x: chainX, y: i * segmentLength, oldX: chainX, oldY: i * segmentLength });
    }
}

function update() {
    // Gravity & Physics
    for (let i = 1; i < numPoints; i++) {
        let p = points[i];
        let vx = (p.x - p.oldX) * 0.95;
        let vy = (p.y - p.oldY) * 0.95;
        
        p.oldX = p.x; p.oldY = p.y;
        p.x += vx; p.y += vy + 0.15; // Gravity

        // Mouse interaction (Inertial Sway)
        let dx = p.x - mouse.x;
        let dy = p.y - mouse.y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 150) {
            let force = (150 - dist) / 150;
            p.x += dx * force * 0.05;
        }
    }

    // Constraints
    for (let i = 0; i < 5; i++) { // Iterations for stability
        points[0].x = chainX; points[0].y = 0; // Fix top point
        for (let j = 0; j < numPoints - 1; j++) {
            let p1 = points[j], p2 = points[j+1];
            let dx = p2.x - p1.x, dy = p2.y - p1.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            let diff = (segmentLength - dist) / dist * 0.5;
            p1.x -= dx * diff; p1.y -= dy * diff;
            p2.x += dx * diff; p2.y += dy * diff;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#a07c58';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < numPoints; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
    
    // Tiny Shimmer Fragments
    if (Math.random() > 0.95) {
        let p = points[Math.floor(Math.random() * numPoints)];
        ctx.fillStyle = '#ede4d4';
        ctx.fillRect(p.x + (Math.random()-0.5)*10, p.y, 1, 1);
    }
}

function loop() {
    update(); draw(); requestAnimationFrame(loop);
}

window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
init(); loop();
