# Image recognition algorithm

### Aim: Write an algorithm that, when passed an image, returns images that are similar to the first.

The project consists of a `script.js` algorithm, that has access to a JSON data set containing label annotations of 20 plant images from the Google Cloud Vision API. 

## Google Cloud Vision API labels

My algorithm focuses on the following labels (descriptions from the Cloud Vision docs):

- **description** - the label description.
- **score** - the confidence score, which ranges from 0 (no confidence) to 1 (very high confidence).

In the future, it could consider topicality, which is the relevance of some image content to the overall picture. For example, the topicality of the description “sheep” would likely be low for a far-off sheep in the corner of an otherwise sheep-free landscape, but high for the kind of close up shot a sheep might put on its dating profile. This project doesn't consider topicality yet because there’s currently [an issue](https://issuetracker.google.com/issues/117855698) where all topicality values are the same as scores.  

## Use instructions

### `similarImages()`

The `similarImages()` function returns information on the extent to which other images in the data set match the target. It has three compulsory parameters:

- `chosenImage`: This is the key of the chosen image object, which is assumed to have the same structure as images in the API response JSON. An example argument: `data["11.jpg"]`.

- `matchChoice`: This specifies how matching descriptions, when encountered, will be weighted, and is currently a choice between `high()` or `alike()`. 
    - `high()` gives weight to description matches with high scores over similar ones. 
    -  `alike()` gives weight to description matches with similar scores over high ones. 

  As `matchChoice` calls a separate function, it should be straightforward to tune/improve/replace this calculation in future work.

- `numberOfImages`: This takes an integer, the number of matching images to return.

### Example calls and return values

`similarImages()` returns a list of lists: each nested list contains the image key and the total match rating. It's this match rating by which the **returned list is ordered**: from **highest similarity, descending**. 

These values appear in the function's return value so that we can do further tuning (e.g. in the confidence function below). **Note that element 0 will always be the image we passed in**, and appears in the list because we’ll need it in the fine tuning. So, for example:

    `similarImages(data["1.jpg"], high, 6)
    // returns
    [
      [ '1.jpg', 7.76 ],
      [ '2.jpg', 5.052 ],
      [ '16.jpg', 4.884 ],
      [ '15.jpg', 4.534 ],
      [ '18.jpg', 4.39 ],
      [ '11.jpg', 4.24 ],
      [ '7.jpg', 4.228 ]
    ]`

Read this as 1.jpg (which is a purple wildflower), as being most similar to 2.jpg (another wildflower), and then next most similar to 16.jpg (a purple flower) and so on… 

**Another example:**

    `similarImages(data["6.jpg"], alike, 5)
    // returns
    [
      [ '6.jpg', 13.28 ],
      [ '10.jpg', 7.135 ],
      [ '5.jpg', 6.225 ],
      [ '4.jpg', 2.293 ]
    ]`

Read this as 6.jpg (physalis and figs), as being most similar to 10.jpg (aubergines), and then next most similar to 5.jpg (a tomato), then 4.jpg (banana). All produce. It would be tempting to highlight the nightshade family here, but I expect that’s more of a product of it being a small data set with a high proportion of nightshade based produce…

### confidence()

A further function, `confidence()`, returns recommendations, also considering a lower bound on the similarity of images. Lower bound is expressed as a float between 0-1, and is calculated by taking an image in question's match value (as returned by `similarImages()`) as a percentage of that which `similarImages()` returns for the target image. 

The `confidence()` function calls the `similarImages()` function, and so needs to be passed `chosenImage` and `matchChoice` values, although `numberOfImages` is hard coded inside `confidence()` as 10, since imposing confidence is likely to return fewer than 10 images.

### Example calls and return values

Note that `confidence` is a value between 0-1 and is passed into the third function parameter:

    `confidence(data["1.jpg"], high, 0.65)
    // returns
    [ '2.jpg' ]` 

We can interpret this as img 1 matching with reasonable confidence with img 2. Cool, they're both wildflowers. If we lower the confidence bar by 0.05, the next image we get is 16, another purple flower. Let's try another.

    `confidence(data["10.jpg"], high, 0.5)
    // returns
    [ '6.jpg', '5.jpg' ]` 

So that’s img 10 (the aubergine) matching 5 and 6 images (other produce) with medium confidence. 

## Algorithm design, methodology, and functional programming approach

### Functional programming paradigm

I intended to take a “functional programming” approach, where we package up the different bits of functionality from an otherwise complex algorithm into discrete, predictable packages – in this case, separate functions that call each other. There are several benefits to this approach. One is just straightforward readability / understanding of the code base and architecture. If functionality is split out like this, and functions are well named, we can get a high-level idea of what’s going quite quickly, and then delve into the different function bodies when we want the details. Another is ease of maintainability and scalability. We’ll see an example of this with the match function in a the next section.

I'm still learning functional programming best practices, and I expect there's much to improve upon. I really like the basic philosophy of it as an approach though, so I'm keen for feedback in that respect.

### Methodology

The methodology is this: For each text description on the target image object (e.g. “Flower” or “Spring” or “Nutrition”), loop over the other image objects in the data set and check their descriptions. If the current description being searched matches a description from the target image, increment the match score of the current image in relation to the target image. This happens in the `similarImages()` function, and for a more detailed annotation of each line of the function, see `script.js`. 

What is a match? I take matches to be an exact string match between (lower case) descriptions. At an earlier point in the project, I was using the `.includes()` function to match possible supersets of the target image description. (e.g. “flower” would produce a match with “flower*s*”). But when I tested this version against just straight matches, it appeared that maybe the former was slightly better.

How are matches weighted – by which I mean, how much importance should we give to a description match when we encounter one? There are many ways to approach how to weight a match when it’s found. I thought I’d build in two possible approaches, by pulling out this operatrion into it’s own set of functions, which are called inside `similarImages()`. 

One match function `high()` gives weight to description matches with high confidence scores over similar ones, by essentially incrementing the total match score for the relevant image by the score of the description from the passed in image and that of the current image from the data set being checked. 

Another function `alike()` gives precedence to matches with similar confidence, by calculating the absolute value of the difference between scores and incrementing the total match score for that image on this basis. The user can choose which match function to implement by passing their choice into the second parameter of the `similarImages()` function.

I would say tentatively that the `high()` function appears to return better results than the `alike()` function, but that is a statement that requires further testing and larger data sets to say with any confidence.

I fully acknowledge that this is a somewhat naïve methodology, and constitutes a first pass approach to specifying and weighting matches. There is much room for improvement, testing, refactoring, and so on, which I turn to in the next section.

## Critical reflection on the project to date

### Does it work?

Some intel from my past career as a cognitive biases researcher might be useful here – humans can over perceive links and patterns where there really are none, and motivational biases can add further inaccuracy to judgements of similarity. I got excited when the algorithm matched flowers to flowers. But let’s not overlook the fact that the majority of images in this data set are flowers. The reasonably reliable matching of produce images (a smaller proportion of the data set) is a potentially better sign that this algorithm is returning something meaningful. (I had to row back on my excitement that maybe it was clever enough to match nightshade family images – that’s likely a feature of there being a nigh number of nightshade family images in this data set).

So, to answer the “does it work” question, I say with reasonable confidence: *“I don’t really know”*, but with high confidence that *"Further testing is needed!"*.

### Missed matches

I use straightforward string matching to calculate description matches. But there are nuances to human language that this approach will not capture, and in this sense my algorithm is deficient. One nuance is that we might have different terms for the same thing – consider “courgette” and “zucchini”. My algorithm cannot capture this. There will also be semantic connections (words with related meanings, but very different characters) that cannot be captured through straightforward string matching. One approach to accounting for these language features might be to connect to some sort of look up table of semantic word matches.

### Match weighting validation 

As above, my approach to weighting matches is really just a first step. If we want to get a better idea of how to tune the algorithm, the next step could be some experimental testing across a much larger data set, to ascertain, for instance, if we should favour the high() or alike() match functions – or something else altogether. Perhaps high scoring matches should be given significantly more weight than I presently do, and vice versa with low scoring matches. Perhaps non-specific words (e.g. “plant”) should be weighted as lower, to forefront descriptions with higher specificity of meaning. These are all assumptions that could be tested, and the algorithm refined, by trying it out on a larger data set.

### Efficiency

My approach here is to leave the JSON data unchanged, and then to iterate over all descriptions in the whole data set, with nested for loops. I’m fully open to there being a potentially less expensive way to do this – whether that’s through pre-processing the JSON into something less nested, or by redesigning the nested looping approach, or by putting a lower bound on the descriptions searched on the basis of their confidence score so we don't check them all.

## Conclusion

Whether or not the algorithm as it currently stands matches images in a way that is useful to a user, I think I’ve got something to work with, and to keep improving on the basis of feedback, further research, and testing. I certainly had fun, and it was a good opportunity to practice accessing and iterating over nested JSON data structures, and thinking about meaningful ways to compare objects therein. 