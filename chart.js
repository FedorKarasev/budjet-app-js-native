const chart = document.querySelector('.chart');

const canvas = document.createElement('canvas');
canvas.height = 50;
canvas.width = 50;

chart.appendChild(canvas);

const ctx = canvas.getContext('2d');

ctx.lineWidth = 6;
const R = 20;

function drawCircle(color, ratio, anticlockwise) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, R, 0, ratio * 2 * Math.PI, anticlockwise);
    ctx.stroke();
}

function updateChart(income, outcome) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let ratio = income / (income + outcome);
    drawCircle('#ffffff', ratio, false);
    drawCircle('#f0624d', 1 - ratio, true);
}