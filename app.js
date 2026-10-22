const yargs = require('yargs');
const data10 = require('./data10');

yargs.command({
  command: 'add',
  describe: 'add a person',
  builder: {
    id: { type: 'number', demandOption: true },
    fname: { type: 'string', demandOption: true },
    lname: { type: 'string', demandOption: true },
    city: { type: 'string', demandOption: true },
    age: { type: 'number', demandOption: true }
  },
  handler: (x) => {
    if (!Number.isInteger(x.id) || x.id <= 0 ||
        !Number.isInteger(x.age) || x.age <= 0 ||
        !x.fname.trim() || !x.lname.trim() || !x.city.trim()) {
      console.log('Invalid person data');
      return;
    }
    data10.addPerson(x.id, x.fname, x.lname, x.city, x.age);
  }
});

yargs.command({
  command: 'list',
  describe: 'show all people',
  handler: () => {
    console.table(data10.loadInfo());
  }
});

yargs.command({
  command: 'read',
  describe: 'show one person',
  builder: {
    id: { type: 'number', demandOption: true }
  },
  handler: (x) => {
    const person = data10.loadInfo().find((obj) => obj.id === x.id);
    console.log(person || 'Person not found');
  }
});

yargs.command({
  command: 'delete',
  describe: 'delete a person',
  builder: {
    id: { type: 'number', demandOption: true }
  },
  handler: (x) => {
    data10.deleteData(x.id);
  }
});

yargs.command({
  command: 'delete-all',
  describe: 'delete all people',
  handler: () => {
    data10.deleteAll();
  }
});

yargs.command({
  command: 'names',
  describe: 'show full names and cities',
  handler: () => {
    const people = data10.loadInfo();
    people.forEach((person) => {
      console.log(person.fname + ' ' + person.lname + ' - ' + person.city);
    });
  }
});

yargs.parse();
