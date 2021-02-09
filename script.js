const data = require('./data.json');

const similarImages = (postedImage) => {
  // Create list of keys to images from the data set
  const imageKeys = Object.keys(data); // [ '1.jpg',  '2.jpg',  '3.jpg', etc ...

  // Set up a dictionary to accumilate description match ratings // { '1.jpg': 0, '2.jpg': 0, etc... 
  const matchRatings = imageKeys.reduce((a, key) => Object.assign(a, { [key]: 0 }), {});

  // Variable to store current description
  let description = "";
  let score = 0;

  // Loop over all descriptions in the posted image. 
  for (let h = 0; h < postedImage.length; h += 1) {
    // Store description string value below for current run of the loop
    description = postedImage[h]["description"].toLowerCase();

    // To check if current description occurs in any images in the data list, loop over the image objects in the data list (we can get the loop length from imageKeys)
    for (let i = 0; i < imageKeys.length; i += 1) {

      // then within this, loop over the tag objects within the current image object (we can access these by using the string values stored in the imageKeys list)
      for (let j = 0; j < Object.values(data[imageKeys[i]]).length; j += 1) {
        // If the current description being searched matches (inc. is a superset of) the search term description
        if (data[imageKeys[i]][j]["description"].toLowerCase().includes(description)) {      
        // if (data[`${i+1}.jpg`][j]["description"].toLowerCase().includes(description)) {      
          // Add the mean average of the score of that description from (i) the posted image and (ii) the current search image: This operation is a first guess and ideally needs some validation against a larger data set
          matchRatings[imageKeys[i]] += ((score + data[imageKeys[i]][j]["score"]) / 2);
        };  
      }; 
    };
  };  
  // Create an array from the matchRatings object
  let imagesOrdered = Object.keys(matchRatings).map(key => [key, matchRatings[key]]);
  // Sort imagesOrdered based on highest to lowest match value
  return imagesOrdered.sort((first, second) => second[1] - first[1]).slice(0, 6);
};

console.log(similarImages(data["6.jpg"]));
console.log(similarImages(data["1.jpg"]));
console.log(similarImages(data["11.jpg"]));

// Log the first 6 items.
// Element 0 will always be image we passed in. Ideally, should refactor so it's not checked, but it's still here to help me check my work!
// The remaining five elements are the recommended matching images, in order of priority