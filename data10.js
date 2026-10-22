const fs = require('fs');
const file = __dirname + '/data10.json';

// Read the people saved in the JSON file
const loadInfo = () => {
  try {
    const dataJson = fs.readFileSync(file).toString();
    return JSON.parse(dataJson);
  } catch {
    return [];
  }
};

const savealldata = (allData) => {
  const saveallDataJson = JSON.stringify(allData, null, 2);
  fs.writeFileSync(file, saveallDataJson);
};

const addPerson = (id, fname, lname, city, age) => {
  const allData = loadInfo();
  const duplicatedData = allData.filter((obj) => {
    return obj.id == id;
  });

  if (duplicatedData.length === 0 && allData.length < 10) {
    allData.push({ id, fname, lname, city, age });
    savealldata(allData);
    console.log('Person added');
  } else {
    console.log('Duplicate ID or the list already has 10 people');
  }
};

const deleteData = (id) => {
  const allData = loadInfo();
  const dataToKeep = allData.filter((obj) => {
    return obj.id != id;
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
