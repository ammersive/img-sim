const data = require('./data.json');

// === Helper functions ===

// Give weight to description matches with high scores over similar ones
const high = (score1, score2) => {
  return score1 + score2;
};

// Give weight to description matches with similar scores over high ones
const alike = (score1, score2) => {
  return 2 - (Math.abs(score1 - score2));
};

// === Main function ===

const similarImages = (chosenImage, matchChoice) => {
  // Create a list of keys to images from the data set
  const imageKeys = Object.keys(data); // [ '1.jpg',  '2.jpg',  '3.jpg', etc ...

  // Set up a dictionary to accumilate description match ratings // { '1.jpg': 0, '2.jpg': 0, etc... 
  const matchRatings = imageKeys.reduce((a, key) => Object.assign(a, { [key]: 0 }), {});

  // Variables to store current description values
  let description = "";
  let score = 0;

  // Loop over all descriptions in the posted image. 
  for (let x = 0; x < chosenImage.length; x += 1) {
    // Store description string value for current run of the loop
    description = chosenImage[x]["description"].toLowerCase();
    // To check if current description occurs in any images in the data list, loop over the image objects in the data list (we can get the loop length from imageKeys)
    for (let i = 0; i < imageKeys.length; i += 1) {
      // then within this, loop over the nested data objects within the current image object (we can access these by using the string values from the imageKeys list)
      for (let j = 0; j < Object.values(data[imageKeys[i]]).length; j += 1) {
        // If the current description being searched matches (inc. is a superset of) the search term description
        if (data[imageKeys[i]][j]["description"].toLowerCase().includes(description)) {      
          // Determine the value of the match (according to the matchChoice - see helper functions above), and add it to the cummilative value for the current image in the matchRatings dictionary          
          matchRatings[imageKeys[i]] += matchChoice(score, data[imageKeys[i]][j]["score"]);
        };  
      }; 
    };
  };  
  // Create an array from the matchRatings dictionary
  let imagesOrdered = Object.keys(matchRatings).map(key => [key, matchRatings[key]]);
  // Sort imagesOrdered based on highest to lowest match value
  return imagesOrdered.sort((first, second) => second[1] - first[1]).slice(0, 6);
};

// The similarImages() function has 2 (compulsory) parameters: 
// (i) image: pass in the key to the chosen image from the dataset. e.g. data["1.jpg"];
// (ii) match function choice: high (which weights matches with high scores), or alike, which weights matches with similar scores.
// e.g.

console.log(similarImages(data["6.jpg"], high)); // recommends as similar, in desc, order: 5, 10, 14, 4, 18
console.log(similarImages(data["6.jpg"], alike)); // recommends 10, 5, 14, 15, 11
console.log(similarImages(data["1.jpg"], high)); // recommends 16, 18, 2, 11, 7
console.log(similarImages(data["1.jpg"], alike)); // recommends 16, 15, 14, 11, 2
console.log(similarImages(data["11.jpg"], high)); // recommends 16, 13, 18, 15, 2
console.log(similarImages(data["11.jpg"], alike)); // recommends 15, 16, 14, 18, 13

// The similarImages() function returns the a list of lists: each nested list contains the image key and the total match rating. It's this match rating by which the returned list is ordered: from highest similarity, descending. One could do further filtering with this information (e.g. return only the first few images if the latter's match rating is much lower)
// Note that element 0 will always be the image we passed in. For efficiency over larger data sets, we'd remove this, but I find it interesting to see the comparison. 