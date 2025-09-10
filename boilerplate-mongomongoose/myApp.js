require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define your schema here
const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String],
});
// Create your model here
let Person = mongoose.model("Person", personSchema);

const createAndSavePerson = (done) => {
  const person = new Person({
    name: "John",
    age: 30,
    favoriteFoods: ["pizza", "pasta"],
  });

  person.save((err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

// Array of people for createManyPeople
const arrayOfPeople = [
  { name: "Alice", age: 25, favoriteFoods: ["salad", "sushi"] },
  { name: "Bob", age: 28, favoriteFoods: ["steak", "fries"] },
  { name: "Charlie", age: 32, favoriteFoods: ["tacos", "burritos"] },
];

const createManyPeople = (arrayOfPeople, done) => {
  // .create() method to create multiple records
  Person.create(arrayOfPeople, (err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, (err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

const findPersonById = (personId, done) => {
  Person.findById(personId, (err, data) => done(err, data)); // More concise approach
};

// Classic Updates by Running Find, Edit, then Save
const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  Person.findById(personId, (err, person) => {
    if (err) return done(err);
    person.favoriteFoods.push(foodToAdd);
    person.save((err, updatedPerson) => done(err, updatedPerson));
  });
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  // New option to return the updated document
  Person.findOneAndUpdate(
    { name: personName },
    { age: ageToSet },
    { new: true },
    (err, updatedPerson) => done(err, updatedPerson)
  );
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, removedPerson) => {
    if (err) return done(err);
    done(null, removedPerson);
  });
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  // Use model.remove() to delete multiple documents
  Person.remove({ name: nameToRemove }, (err, result) => {
    if (err) return done(err);
    done(null, result);
  });
};

const queryChain = (done) => {
  const foodToSearch = "burrito";
  // Chain search query helpers to narrow search results
  Person.find({ favoriteFoods: foodToSearch })
    .sort({ name: 1 }) // Sort by name ascending
    .limit(2) // Limit to 2 results
    .select({ age: 0 }) // Exclude age field
    .exec((err, data) => done(err, data));
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
