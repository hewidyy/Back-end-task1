const readline = require('readline');
const data = require('./data10');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(message) {
  return new Promise((resolve) => {
    rl.question(message, resolve);
  });
}

async function main() {
  let choice = '';

  while (choice !== '7') {
    console.log('\n--- People Menu ---');
    console.log('1 - Enter data of 10 people');
    console.log('2 - Show all people');
    console.log('3 - Show one person');
    console.log('4 - Delete all people');
    console.log('5 - Delete one person');
    console.log('6 - Show full names and cities');
    console.log('7 - Exit');

    choice = (await ask('Choose: ')).trim();

    if (choice === '1') {
      if (data.loadInfo().length > 0) {
        const answer = (await ask('Replace the current people? (y/n): ')).trim().toLowerCase();
        if (answer !== 'y') {
          console.log('Nothing changed');
          continue;
        }
        data.deleteAllData();
      }

      while (data.loadInfo().length < 10) {
        console.log('\nPerson ' + (data.loadInfo().length + 1));
        const id = Number(await ask('ID: '));
        const fname = (await ask('First name: ')).trim();
        const lname = (await ask('Last name: ')).trim();
        const age = Number(await ask('Age: '));
        const city = (await ask('City: ')).trim();

        if (!Number.isInteger(id) || id <= 0 || !fname || !lname || !Number.isInteger(age) || age <= 0 || !city) {
          console.log('Invalid data, try again');
          continue;
        }
        data.addPerson(id, fname, lname, city, age);
      }

    } else if (choice === '2') {
      const people = data.loadInfo();
      if (people.length === 0) console.log('No people found');
      else console.table(people);

    } else if (choice === '3') {
      const id = Number(await ask('Enter ID: '));
      const people = data.loadInfo();
      const person = people.find((obj) => obj.id === id);
      if (person) console.log(person);
      else console.log('Person not found');

    } else if (choice === '4') {
      data.deleteAllData();

    } else if (choice === '5') {
      const id = Number(await ask('Enter ID: '));
      data.deleteData(id);

    } else if (choice === '6') {
      const people = data.loadInfo();
      if (people.length === 0) console.log('No people found');
      for (let i = 0; i < people.length; i++) {
        console.log(people[i].fname + ' ' + people[i].lname + ' - ' + people[i].city);
      }

    } else if (choice !== '7') {
      console.log('Choose a number from 1 to 7');
    }
  }

  rl.close();
}

main();
