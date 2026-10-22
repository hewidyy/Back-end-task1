const fs = require('fs');
const file = __dirname + '/data10.json';

const loadInfo = () => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return [];
  }
};

const savealldata = (allData) => {
  fs.writeFileSync(file, JSON.stringify(allData, null, 2));
};

const addPerson = (id, fname, lname, age, city) => {
  const allData = loadInfo();
  const duplicate = allData.filter(person => person.id === id);

  if (duplicate.length > 0) {
    console.log('This ID already exists');
  } else {
    allData.push({ id, fname, lname, age, city });
    savealldata(allData);
    console.log('Person added');
  }
};

const deleteData = (id) => {
  const allData = loadInfo();
  const remaining = allData.filter(person => person.id !== id);
  savealldata(remaining);
  console.log(remaining.length < allData.length ? 'Person deleted' : 'Person not found');
};

const deleteAllData = () => savealldata([]);

module.exports = { addPerson, loadInfo, deleteData, deleteAllData };
