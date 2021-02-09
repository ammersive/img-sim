const data = require('./data.json');

let description = "flower";
let num = 1;

// Initial loop: check if a description occurs in one image
let propertyIndexes = [];
// Does any one obj in this list of one comparison picture have the specified property?
for (let i = 0; i < Object.values(data[`${num}.jpg`]).length; i += 1) {
  // if description being searched includes the specified property  
  if (data["1.jpg"][i]["description"].toLowerCase().includes(description)) {
    // If it does, log the index at which it was found
    propertyIndexes.push(i);
  };  
}

console.log(propertyIndexes); // when description = "plant" : [ 1, 2, 9 ] , when description = "flower" : [ 0, 1, 7 ] 


