/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.
use('mongodbVSCodePlaygroundDB');
// Insert a few documents into the businesses collection.
// Define a function to generate dummy data for businesses.

const generateDummyData = () => {
  const towns = ['Coleraine', 'Banbridge', 'Belfast', 'Lisburn', 'Ballymena', 'Derry', 'Newry', 'Enniskillen', 'Omagh', 'Ballymena'];
  const businessArray = [];

  for (let i = 0; i < 100; i++) {
    const id = UUID(); // You'll need to implement the UUID generation logic
    const name = `Biz ${i}`;
    const town = towns[Math.floor(Math.random() * towns.length)];
    const rating = Math.floor(Math.random() * 5) + 1;

    businessArray.push({
      "_id": id,
      "name": name,
      "town": town,
      "rating": rating,
      "reviews": []
    });
  }

  return businessArray;
};

// Call the function to generate dummy data for businesses.
const businesses = generateDummyData();

// Insert the generated businesses into the database.
//db.getCollection('businesses').insertMany(businesses);

// Print a message indicating the number of businesses inserted.
print(`Inserted ${businesses.length} businesses into the database.`);
// Run a find command to view all businesses.
const allBusinesses = db.getCollection('businesses').find({});

// Print the businesses to the output window.
allBusinesses.forEach(printjson);

// Define a function to calculate the average rating of all businesses.
const averageRating = () => {
  const businesses = db.getCollection('businesses').find({});
  let totalRating = 0;
  let count = 0;

  businesses.forEach(business => {
    totalRating += business.rating;
    count++;
  });

  return totalRating / count;
};

// Print the average rating to the output window.
console.log(`Average rating of all businesses: ${averageRating()}`);