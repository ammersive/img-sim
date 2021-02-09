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
  return imagesOrdered.sort((first, second) => second[1] - first[1]).slice(0, numberOfImages + 1);  
};

// The similarImages() function has 2 (compulsory) parameters: 
// (i) image: pass in the key to the chosen image from the dataset. e.g. data["1.jpg"];
// (ii) match function choice: high (which weights matches with high scores), or alike, which weights matches with similar scores.
// e.g.

console.log(similarImages(data["6.jpg"], high, 5)); // recommends as similar, in desc, order: 5, 10, 14, 4, 18
console.log(similarImages(data["6.jpg"], alike, 5)); // recommends 10, 5, 14, 15, 11
console.log(similarImages(data["1.jpg"], high, 6)); // recommends 16, 18, 2, 11, 7, 15
console.log(similarImages(data["1.jpg"], alike, 6)); // recommends 16, 15, 14, 11, 2, 18 
console.log(similarImages(data["11.jpg"], high, 5)); // recommends 16, 13, 18, 15, 2
console.log(similarImages(data["11.jpg"], alike, 5)); // recommends 15, 16, 14, 18, 13

// The similarImages() function returns the a list of lists: each nested list contains the image key and the total match rating. It's this match rating by which the returned list is ordered: from highest similarity, descending. I leave these value in the function's return value so that we can do further tuning (e.g. in the confidence function below).
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

// So, the final argument passed into confidence() is the confidence lower bound
console.log(confidence(data["11.jpg"], high, 0.5)); // [ '16.jpg', '13.jpg', '18.jpg', '15.jpg' ] - interpret as img.11 matches with medium confidence with these images. They're all flowers, but then, so is much of the present data set...
console.log(confidence(data["2.jpg"], high, 0.7)); // [ '16.jpg' ] interpret as img.2 matches with high confidence with img.16. Cool, they're both purple flowers. 
console.log(confidence(data["10.jpg"], high, 0.5)); // [ '6.jpg', '5.jpg' ] interpret as img.10 matching these images with medium confidence. I think they're all nightshade family! But to be fair, the next step is to work out if this bares out over a larger dataset, or is a happy accident given how much of the rest of the data set is flowers, and this is just the compliment "not flower" set... Exploration continues!