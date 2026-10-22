const fs = require('fs');
const path = require('path');
const fileName = path.join(__dirname, 'data10.json');

// Read people from the JSON file
const loadInfo = () => {
  try {
    const dataJson = fs.readFileSync(fileName).toString();
    return JSON.parse(dataJson);
  } catch (error) {
    return [];
  }
};

// Save the new list after adding or deleting someone
const savealldata = (allData) => {
  fs.writeFileSync(fileName, JSON.stringify(allData, null, 2));
};

const addPerson = (id, fname, lname, city, age) => {
  const allData = loadInfo();
  const duplicatedData = allData.filter((obj) => {
    return obj.id === id;
  });

  if (duplicatedData.length === 0 && allData.length < 10) {
    allData.push({ id, fname, lname, city, age });
    savealldata(allData);
    console.log('Person added');
    return true;
  } else {
    console.log('Duplicate ID or the list is full');
    return false;
  }
};

const deleteData = (id) => {
  const allData = loadInfo();
  const dataToKeep = allData.filter((obj) => {
    return obj.id !== id;
  });

  if (dataToKeep.length === allData.length) {
    console.log('Person not found');
  } else {
    savealldata(dataToKeep);
    console.log('Person deleted');
  }
};

const deleteAllData = () => {
  savealldata([]);
  console.log('All people deleted');
};

module.exports = {
  addPerson,
  loadInfo,
  deleteData,
  deleteAllData
};
