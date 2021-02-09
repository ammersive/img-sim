const data = require('./data.json');

let postedImage = data["1.jpg"];

let description = "";
let allMatches = [];
let singleMatches = [];
let scores = [];

// Loop over all descriptions in the posted image. 
for (let h = 0; h < postedImage.length; h += 1) {
  singleMatches = [];
  // Iterate through descriptions in posted image
  description = postedImage[h]["description"].toLowerCase();

  // Check if current description occurs in any images in the data list
  for (let i = 0; i < Object.values(data).length; i += 1) {
    // Initialise a list to keep track of matches from within any one image object
    scores = [];

    // Loop over list of objects stored in value of current image object
    for (let j = 0; j < Object.values(data[`${i+1}.jpg`]).length; j += 1) {
      // If description being searched matches (inc. is a superset of) the search term description
      if (data[`${i+1}.jpg`][j]["description"].toLowerCase().includes(description)) {      
        // Log the img, index at which it was found, and score:
        scores.push([`${i+1}.jpg`, j, data[`${i+1}.jpg`][j]["score"]]);
      };  
    };    
    // If scores is non-empty, push to singleMatches list
    scores.length > 0 ? singleMatches.push(scores) : null;
  };
  allMatches.push(singleMatches);
};  

// console.log(allMatches);

console.log(allMatches[0][0]);

console.log(allMatches[0][0][0]);
console.log(allMatches[0][0][1]);
console.log(allMatches[0][0][2]);

console.log(allMatches[0][1][0]);
console.log(allMatches[0][1][1]);
console.log(allMatches[0][1][2]);

console.log(allMatches[0][2][0]);
console.log(allMatches[0][2][1]);
