const fs = require('fs');

const loadInfo = () => {
  try {
    const dataJson = fs.readFileSync('data10.json').toString();
    return JSON.parse(dataJson);
  } catch {
    return [];
  }
};

const savealldata = (allData) => {
  const saveallDataJson = JSON.stringify(allData, null, 2);
  fs.writeFileSync('data10.json', saveallDataJson);
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
  } else {
    console.log('Duplicate ID or the list already has 10 people');
  }
};

const deleteData = (id) => {
  const allData = loadInfo();
  const dataToKeep = allData.filter((obj) => {
    return obj.id !== id;
  });

  savealldata(dataToKeep);
  console.log(dataToKeep.length < allData.length ? 'Person deleted' : 'Person not found');
};

const deleteAll = () => {
  savealldata([]);
  console.log('All people deleted');
};

module.exports = { addPerson, loadInfo, deleteData, deleteAll };
