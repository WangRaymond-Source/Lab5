// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
const canvas = document.getElementById("user-image");
const ctx = canvas.getContext('2d');
const addImage = document.getElementById("image-input");
const subButton = document.querySelector("[type='submit']"); //submit button
const resetButton = document.querySelector("[type='reset']"); //reset/clear
const readButton =  document.querySelector("[type='button']"); //read button
const genMem = document.getElementById("generate-meme"); //gen Meme button
const voiceMenu = document.getElementById("voice-selection");
//drop down menu
function populateVoiceList() {

  var voices = window.speechSynthesis.getVoices();
  //enable drop down menu
  voiceMenu.disabled = false;
  voiceMenu.options[0] = null;
  for(var i = 0; i < voices.length; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    
    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }
    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceMenu.appendChild(option);
  }
  console.log(voices);
}

populateVoiceList();


// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  resetButton.disabled = true;
  readButton.disabled = true;
  subButton.disabled = false;

  //clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //fill canvas with black
  ctx.fillStyle = "#000000";
  //fill
  ctx.fillRect(0,0, Number(canvas.width), Number(canvas.height));
  
  //draw the uploaded image onto the canvas
  let dim = getDimmensions(canvas.width,canvas.height, img.width, img.height);
  ctx.drawImage(img, dim.startX, dim.startY, dim.width, dim.height);
  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});
//select and add Image to canvas
addImage.addEventListener('change', () =>{
  img.src = URL.createObjectURL(addImage.files[0]);
  img.alt = addImage.files[0].name;
});
//implement generate button
genMem.addEventListener('submit', (event) =>{
  event.preventDefault();
  let topText = document.getElementById("text-top");
  let botText = document.getElementById("text-bottom");
  //implement the text to the canvas
  ctx.font = "48px Arial";
  ctx.textAlign = "center";
  ctx.strokeStyle = "#FFFFFF";
  //*****come back to thius! */
  ctx.strokeText(topText.value, canvas.width/2, 48);
  ctx.strokeText(botText.value, canvas.width/2, canvas.height - 20);

  resetButton.disabled = false;
  readButton.disabled = false;
  subButton.disabled = true;
});
//clears the canvas and reset meme generator
resetButton.addEventListener('click', () =>{
  //clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  resetButton.disabled = true;
  readButton.disabled = true;
  subButton.disabled = false;
});

readButton.addEventListener('click', () =>{
  // var speakText = window.speechSynthesis;
  // let topText = document.getElementById("text-top").value;
  // let botText = document.getElementById("text-bottom").value;
  // var text1 = new SpeechSynthesisUtterance(topText);
  // var text2 = new SpeechSynthesisUtterance(botText);
  // speakText.speak(text1);
  // speakText.speak(text2);
  var theVoice = document.querySelector("[value='none']");
  console.log(theVoice);
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
