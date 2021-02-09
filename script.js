const data = require('./data.json');

// Check if a description occurs in any images in the data list

let description = "plant";
let matchingDescriptions = [];

// Loop over all images:
for (let i = 0; i < Object.values(data).length; i += 1) {
  // initialise a list to keep track of matches from within any one image object
  let scores = [];
  // Loop over list of objects stored in value of current image object
  for (let j = 0; j < Object.values(data[`${i+1}.jpg`]).length; j += 1) {
    // If description being searched matches (inc. is a superset of) the search term description  
    if (data[`${i+1}.jpg`][j]["description"].toLowerCase().includes(description)) {      
      // Log the img, index at which it was found, and score:
      scores.push([`${i+1}.jpg`, j, data[`${i+1}.jpg`][j]["score"]]);
      // or:
      // scores.push(j);
    };  
  }
  matchingDescriptions.push(scores);
};  
console.log(matchingDescriptions); // [   [ 1, 2, 9 ], [ 1, 4, 11 ], [ 5, 9, 12 ], [ 3, 8, 10 ], ... 




// let description = "flower";
// let num = 1;

// // Initial loop: check if a description occurs in one image
// let propertyIndexes = [];
// // Does any one obj in this list of one comparison picture have the specified property?
// for (let i = 0; i < Object.values(data[`${num}.jpg`]).length; i += 1) {
//   // if description being searched includes the specified property  
//   if (data["1.jpg"][i]["description"].toLowerCase().includes(description)) {
//     // If it does, log the index at which it was found
//     propertyIndexes.push(i);
//   };  
// }

// console.log(propertyIndexes); // when description = "plant" : [ 1, 2, 9 ] , when description = "flower" : [ 0, 1, 7 ] 
