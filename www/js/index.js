/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('DOMContentLoaded', function() {
    // Wait for the deviceready event before using any of Cordova's device APIs.
    // See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
    document.addEventListener('deviceready', onDeviceReady, false);
});

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
// can add 3 more sliders for variability in color i.e for rgb? // Create canvas element dynamically
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let numArcs = 2500; // Number of arcs
let maxRotation = Math.PI / 6; // Max rotation in radians (30 degrees)
let maxSpeed = 20; // Maximum falling speed
let maxThickness = 5; // Maximum arc thickness
let maxRotationSpeed = 0.42; // Maximum rotation speed
let arcVariability = Math.PI; // Variability in arc angles (default: 180 degrees)
let maxOpacity = 1; // Maximum opacity of arcs (default: fully opaque)
const arcs = []; // Store falling arcs

// Create sliders for number of arcs, rotation range, falling speed, thickness, rotation speed, variability, and opacity
const controls = document.createElement("div");
controls.style.position = "absolute";
controls.style.top = "10px";
controls.style.left = "10px";
controls.style.background = "white";
controls.style.padding = "10px";
document.body.appendChild(controls);

const numArcsSlider = document.createElement("input");
numArcsSlider.type = "range";
numArcsSlider.min = "1";
numArcsSlider.max = "3000";
numArcsSlider.value = numArcs;
controls.appendChild(document.createTextNode("Number of Arcs: "));
controls.appendChild(numArcsSlider);
controls.appendChild(document.createElement("br"));

const rotationSlider = document.createElement("input");
rotationSlider.type = "range";
rotationSlider.min = "0";
rotationSlider.max = "90";
rotationSlider.value = "30"; // Default: 30 degrees
controls.appendChild(document.createTextNode("Max Rotation (degrees): "));
controls.appendChild(rotationSlider);
controls.appendChild(document.createElement("br"));

const speedSlider = document.createElement("input");
speedSlider.type = "range";
speedSlider.min = "1";
speedSlider.max = "10";
speedSlider.value = maxSpeed;
controls.appendChild(document.createTextNode("Max Falling Speed: "));
controls.appendChild(speedSlider);
controls.appendChild(document.createElement("br"));

const thicknessSlider = document.createElement("input");
thicknessSlider.type = "range";
thicknessSlider.min = "1";
thicknessSlider.max = "10";
thicknessSlider.value = maxThickness;
controls.appendChild(document.createTextNode("Max Arc Thickness: "));
controls.appendChild(thicknessSlider);
controls.appendChild(document.createElement("br"));

const rotationSpeedSlider = document.createElement("input");
rotationSpeedSlider.type = "range";
rotationSpeedSlider.min = "0.01";
rotationSpeedSlider.max = "0.5";
rotationSpeedSlider.step = "0.01";
rotationSpeedSlider.value = maxRotationSpeed;
controls.appendChild(document.createTextNode("Max Rotation Speed: "));
controls.appendChild(rotationSpeedSlider);
controls.appendChild(document.createElement("br"));

const variabilitySlider = document.createElement("input");
variabilitySlider.type = "range";
variabilitySlider.min = "0";
variabilitySlider.max = "360";
variabilitySlider.value = "180"; // Default: 180 degrees
controls.appendChild(document.createTextNode("Arc Variability (degrees): "));
controls.appendChild(variabilitySlider);
controls.appendChild(document.createElement("br"));

const opacitySlider = document.createElement("input");
opacitySlider.type = "range";
opacitySlider.min = "0";
opacitySlider.max = "1";
opacitySlider.step = "0.01";
opacitySlider.value = maxOpacity;
controls.appendChild(document.createTextNode("Max Arc Opacity: "));
controls.appendChild(opacitySlider);

class HalfArc {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = -50;
        this.radius = 30 + Math.random() * 30;
        this.speedY = 1 + Math.random() * maxSpeed;
        this.angle = maxRotation; // Start at max rotation degrees
        this.angleSpeed = (Math.random() - 0.5) * maxRotationSpeed;
        this.angleRange = maxRotation;
        this.angleDirection = 1;
        this.lineWidth = 1 + Math.random() * maxThickness;
        this.startAngle = Math.random() * arcVariability; // Random start angle
        this.endAngle = this.startAngle + Math.random() * arcVariability; // Random end angle
        this.opacity = Math.random() * maxOpacity; // Random opacity for each arc
    }
    
    update() {
        this.y += this.speedY;
        this.angle += this.angleSpeed * this.angleDirection;
        
        // Reverse direction when exceeding the angle range
        if (this.angle > this.angleRange || this.angle < -this.angleRange) {
            this.angleDirection *= -1;
        }
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, this.startAngle, this.endAngle); // Use variable start and end angles
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = `rgba(0, 0, 0, ${this.opacity})`; // Apply individual opacity
        ctx.stroke();
        ctx.restore();
    }
}

function populateArcs() {
    arcs.length = 0;
    for (let i = 0; i < numArcs; i++) {
        arcs.push(new HalfArc());
    }
}

numArcsSlider.addEventListener("input", () => {
    numArcs = parseInt(numArcsSlider.value, 20);
    populateArcs();
});

rotationSlider.addEventListener("input", () => {
    maxRotation = (parseInt(rotationSlider.value, 10) * Math.PI) / 180;
    for (let arc of arcs) {
        arc.angleRange = maxRotation;
    }
});

speedSlider.addEventListener("input", () => {
    maxSpeed = parseInt(speedSlider.value, 10);
    for (let arc of arcs) {
        arc.speedY = 1 + Math.random() * maxSpeed;
    }
});

thicknessSlider.addEventListener("input", () => {
    maxThickness = parseInt(thicknessSlider.value, 10);
    for (let arc of arcs) {
        arc.lineWidth = 1 + Math.random() * maxThickness;
    }
});

rotationSpeedSlider.addEventListener("input", () => {
    maxRotationSpeed = parseFloat(rotationSpeedSlider.value);
    for (let arc of arcs) {
        arc.angleSpeed = (Math.random() - 0.5) * maxRotationSpeed;
    }
});

variabilitySlider.addEventListener("input", () => {
    arcVariability = (parseInt(variabilitySlider.value, 10) * Math.PI) / 180; // Convert degrees to radians
    for (let arc of arcs) {
        arc.startAngle = Math.random() * arcVariability;
        arc.endAngle = arc.startAngle + Math.random() * arcVariability;
    }
});

opacitySlider.addEventListener("input", () => {
    maxOpacity = parseFloat(opacitySlider.value);
    for (let arc of arcs) {
        arc.opacity = Math.random() * maxOpacity; // Update opacity for each arc
    }
});

populateArcs();

function animate() {
    // Clear previous canvas before drawing the next frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw each arc
    for (let arc of arcs) {
        arc.update();
        arc.draw(ctx);
        
        // Reset arc position if it falls off screen
        if (arc.y - arc.radius > canvas.height) {
            arc.y = -arc.radius;
            arc.x = Math.random() * canvas.width;
            arc.speedY = 1 + Math.random() * maxSpeed;
            arc.angle = maxRotation;
            arc.angleSpeed = (Math.random() - 0.5) * maxRotationSpeed;
            arc.angleDirection = 1;
            arc.lineWidth = 1 + Math.random() * maxThickness;
            arc.startAngle = Math.random() * arcVariability;
            arc.endAngle = arc.startAngle + Math.random() * arcVariability;
            arc.opacity = Math.random() * maxOpacity; // Reset opacity for the arc
        }
    }
    
    requestAnimationFrame(animate);
}

animate();


}
