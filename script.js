const data = require('./data.json');

// For now, enter the image to check here:
let postedImage = data["6.jpg"];

// For now, we'll hard code this, which we'll populate withe the for loop below
matchRatings = { 
  '1.jpg' : 0,
  '2.jpg' : 0,  
  '3.jpg' : 0,  
  '4.jpg' : 0,  
  '5.jpg' : 0,  
  '6.jpg' : 0,  
  '7.jpg' : 0,  
  '8.jpg' : 0,  
  '9.jpg' : 0,  
  '10.jpg' : 0,  
  '11.jpg' : 0,  
  '12.jpg' : 0,  
  '13.jpg' : 0,  
  '14.jpg' : 0,  
  '15.jpg' : 0,  
  '16.jpg' : 0,  
  '17.jpg' : 0,  
  '18.jpg' : 0,  
  '19.jpg' : 0,  
  '20.jpg' : 0,
}; 

// Variable to store description of current 
let description = "";
let score = 0;

// Loop over all descriptions in the posted image. 
for (let h = 0; h < postedImage.length; h += 1) {
  // Iterate through descriptions in posted image
  description = postedImage[h]["description"].toLowerCase();

  // Check if current description occurs in any images in the data list, by...
  for (let i = 0; i < Object.values(data).length; i += 1) {

    // ...looping over over the list of objects stored as the value of the current image object
    for (let j = 0; j < Object.values(data[`${i+1}.jpg`]).length; j += 1) {
      // If description being searched matches (inc. is a superset of) the search term description
      if (data[`${i+1}.jpg`][j]["description"].toLowerCase().includes(description)) {      
        // Add the mean average of the score of that description from the posted image and the current search image
        // This operation is a first guess and ideally needs some validation against a larger data set
        matchRatings[`${i+1}.jpg`] += ((score + data[`${i+1}.jpg`][j]["score"]) / 2);
      };  
    }; 
  };
};  

// Create an array from the matchRatings object
let imagesOrdered = Object.keys(matchRatings).map(function(key) {
  return [key, matchRatings[key]];
});
// Sort imagesOrdered based on highest to lowest match value
imagesOrdered.sort(function(first, second) {
  return second[1] - first[1];
});

// Log the first 6 items.
// Element 0 will always be image we passed in. Ideally, should refactor so it's not checked, but it's still here to help me check my work!
// The remaining five elements are the recommended matching images, in order of priority
console.log(imagesOrdered.slice(0, 6));

// Validating with my (potentially biased(!) human eyes), it seems to work after a fashion!
// Flowers return flowers higher up
// Foody things (berries etc) returns food
// The non-specific landscapey ones are less good, but seem to avoid obvious flowers, for instance. 
// Now to refactor and tidy.