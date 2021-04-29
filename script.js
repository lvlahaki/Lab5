// script.js

const img = new Image(); // used to load image from <input> and draw to canvas

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  const canvas = document.getElementById("user-image");
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0, canvas.width, canvas.height);
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let dimensions = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  let width = dimensions.width; let height = dimensions.height;
  let startX = dimensions.startX; let startY = dimensions.startY;

  ctx.fillStyle = 'black';
  ctx.drawImage(img, startX, startY, width, height);
  console.log("Do something");

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

const imageInput = document.getElementById('image-input');

imageInput.addEventListener('change', () =>{
  const imgurl = URL.createObjectURL(imageInput.files[0]);
  img.src = imgurl;
  img.alt = imageInput.files[0].name;
});

const buttons = document.getElementsByTagName('button');
const submit = buttons[0];
const reset = buttons[1];
const button = buttons[2];

let form = document.getElementById("generate-meme");

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const canvas = document.getElementById("user-image");
  const ctx = canvas.getContext('2d');
  const toptext = document.getElementById("text-top");
  const bottomtext = document.getElementById("text-bottom");
  ctx.fillStyle = 'white';
  ctx.font = '50px impact';
  ctx.textAlign = 'center';
  ctx.fillText(toptext.value, canvas.width/2, 50 , canvas.width);
  ctx.fillText(bottomtext.value, canvas.width/2, 380, canvas.width);
  submit.disabled = true;
  reset.disabled = false;
  button.disabled = false;
});

reset.addEventListener('click', () => {
  const canvas = document.getElementById("user-image");
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0, canvas.width, canvas.height);
  submit.disabled = false;
  reset.disabled = true;
  button.disabled = true;
});

let voices = window.speechSynthesis.getVoices();
let voiceSelect = document.getElementById('voice-selection');
voiceSelect.disabled = false;
let noneOption = document.querySelector("option[value=none]");
noneOption.remove();
for (let i = 0; i < voices.length; i++){
  let option = document.createElement('option');
  option.textContent = voices[i].name + '- ' + voices[i].lang;

  if(voices[i].default){
    option.textContent += ' [DEFAULT]';
  }

  option.setAttribute('data-lang', voices[i].lang);
  option.setAttribute('data-name', voices[i].name);
  voiceSelect.appendChild(option);
}

button.addEventListener('click', () =>{
  const toptext = document.getElementById("text-top");
  const bottomtext = document.getElementById("text-bottom");
  var words = new SpeechSynthesisUtterance(toptext.value + bottomtext.value);
  for(let i = 0; i < voices.length; i++){
    if (voices[i].name  + '- ' + voices[i].lang === voiceSelect.value){
      words.voice = voices[i];
    }
  }
  words.volume = volume/100;
  speechSynthesis.speak(words);
});

let volume = 1;
const volslide = document.querySelector("[type=range]");
let volumeGroup = document.getElementById('volume-group');
let volumeImage = volumeGroup.getElementsByTagName("img")[0];
volslide.addEventListener('input', () =>{
  volume = volslide.value;
  if(volume == 0){
    volumeImage.src = "icons/volume-level-0.svg";
  }
  else if(volume >= 1 && volume <= 33){
    volumeImage.src = "icons/volume-level-1.svg";
  }
  else if(volume >= 34 && volume <= 66){
    volumeImage.src = "icons/volume-level-2.svg";
  }
  else if(volume >= 67){
    volumeImage.src = "icons/volume-level-3.svg";
  }
});


/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
