const data = require('./data.json');

// === Helper functions ===

// Give weight to description matches with high confidence scores over similar ones
const high = (score1, score2) => {
  return score1 + score2;
};

// Give weight to description matches with similar confidence scores over high ones
const alike = (score1, score2) => {
  return 2 - (Math.abs(score1 - score2));
};

// === Main function ===

const similarImages = (chosenImage, matchChoice, numberOfImages) => {
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
    // To check if current description occurs in any images in the data set, loop over the image objects in the data set (we can get the loop length from imageKeys)
    for (let i = 0; i < imageKeys.length; i += 1) {
      // then within this, loop over the nested data objects within the current image object (we can access these by using the string values from the imageKeys list)
      for (let j = 0; j < Object.values(data[imageKeys[i]]).length; j += 1) {
        // If the current description being searched matches (inc. is a superset of) the search term description     
        if (data[imageKeys[i]][j]["description"].toLowerCase() === description) {      
          // Determine the value of the match (according to the matchChoice - see helper functions above), and add it to the cummilative value for the current image in the matchRatings dictionary          
          matchRatings[imageKeys[i]] += matchChoice(score, data[imageKeys[i]][j]["score"]);
        };  
      }; 
    };
  };  
  // Create an array from the matchRatings dictionary, with match values rounded to 3 decimal places
  let imagesOrdered = Object.keys(matchRatings).map(key => [key, +matchRatings[key].toFixed(3)]);
  // Sort imagesOrdered based on highest to lowest match value
  return imagesOrdered.sort((first, second) => second[1] - first[1]).slice(0, numberOfImages + 1);  
};

// The similarImages() function has 3 (compulsory) parameters: 
// (i) image: pass in the key to the chosen image from the data set. e.g. data["1.jpg"];
// (ii) match function choice: high, which weights matches with high scores, or alike, which weights matches with similar scores.
// (iii) Number of matching images to return
// e.g.

console.log(similarImages(data["6.jpg"], high, 3)); // recommends as similar, in desc, order: 5, 10, 4 
console.log(similarImages(data["6.jpg"], alike, 3)); // recommends 10, 5, 4 

console.log(similarImages(data["1.jpg"], high, 6)); // recommends 2, 16, 15, 18, 11, 7
console.log(similarImages(data["1.jpg"], alike, 6)); // recommends 15, 16, 2, 9, 7, 11 

console.log(similarImages(data["11.jpg"], high, 5)); // recommends 13, 15, 16, 17, 18
console.log(similarImages(data["11.jpg"], alike, 5)); // recommends 15, 16, 13, 7, 2

// The similarImages() function returns a list of lists: each nested list contains the image key and the total match rating. It's this match rating by which the returned list is ordered: from highest similarity, descending. I leave these values in the function's return value so that we can do further tuning (e.g. in the confidence function below).
// Note that element 0 will always be the image we passed in.



// The confidence() function allows you to put a lower bound on the similarity of images. Expressed as a float between 0-1, it is calculated by taking an image in question's match value (as returned by similarImages()) as a percentage of that which similarImages() returns for the target image. 

// The confidence() function calls the similarImages() function, and so needs to be passed chosenImage and matchChoice values, although numberOfImages is hard coded as 10, since imposing confidence is highly likely to return fewer than 10 images. 

const confidence = (chosenImage, matchChoice, lowerBound) => {
  // call similarImages, receive an array containing image names and match values
  let imageArray = similarImages(chosenImage, matchChoice, 10);
  // declare array to store images returned 
  let confident = [];
  // Start loop at 1 (we're checking the rest of the images against the first)
  for (let i = 1; i < imageArray.length; i += 1) {
    // if current image match value, as % of target image, exceeds the lower bound, pass it to array to be returned.
    if (imageArray[i][1] / imageArray[0][1] > lowerBound) {
      confident.push(imageArray[i][0]);
    }
  }
  return confident;
};

// In the below, we can see that the final argument passed into confidence() is the confidence lower bound.
// For example:

console.log(confidence(data["1.jpg"], high, 0.65)); // [ '2.jpg' ] interpret as img 1 matches with reasonable confidence with img.2. Cool, they're both wildflowers. If we lower the confidence bar, the next image we get is 16, another purpler flower 

console.log(confidence(data["10.jpg"], high, 0.5)); // [ '6.jpg', '5.jpg' ] interpret as img 10 matching these images with medium confidence. These images are all produce, and include the nightshade family, but to be fair, the next step is to work out if this bares out over a larger dataset, or is a happy accident given how much of the rest of the data set is flowers, and this is just the compliment "not flower" set... Exploration continues!