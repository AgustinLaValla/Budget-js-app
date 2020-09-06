//Select chart
const chart = document.querySelector('.chart');

//Create Canvas Element
const canvas = document.createElement('canvas');
canvas.width = 50;
canvas.height = 50;

//Append canvas element to chart element
chart.appendChild(canvas);

//Get canvas context
const ctx = canvas.getContext("2d");

//Line width
ctx.lineWidth = 8;

//Circle radius
const R = 20;


const drawcircle = (color, ratio, anticlockwise) => {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, R, 0, ratio * 2 * Math.PI, anticlockwise);
        ctx.stroke();
}

const updateChart = (income, outcome) => {
    let ratio = income / (income + outcome);
    drawcircle("#FFFFFF", -ratio, true);
    drawcircle("#f0624d", 1 - ratio, false);
};

updateChart(1000, 1000);

