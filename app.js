const readline = require('readline');
const data = require('./data10');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (message) => new Promise(resolve => rl.question(message, resolve));

async function main() {
  let choice = '';

  while (choice !== '7') {
    console.log('\n1. Enter 10 people');
    console.log('2. View all people');
    console.log('3. View one person');
    console.log('4. Delete all people');
    console.log('5. Delete one person');
    console.log('6. Full names and cities');
    console.log('7. Exit');
    choice = (await ask('Choose: ')).trim();

    if (choice === '1') {
      if (data.loadInfo().length > 0) {
        const answer = await ask('Replace current data? (y/n): ');
        if (answer.toLowerCase().trim() !== 'y') continue;
        data.deleteAllData();
      }

      while (data.loadInfo().length < 10) {
        console.log('\nPerson ' + (data.loadInfo().length + 1));
        const id = Number(await ask('ID: '));
        const fname = (await ask('First name: ')).trim();
        const lname = (await ask('Last name: ')).trim();
        const age = Number(await ask('Age: '));
        const city = (await ask('City: ')).trim();

        if (!Number.isInteger(id) || id <= 0 || !fname || !lname ||
            !Number.isInteger(age) || age <= 0 || !city) {
          console.log('Invalid data');
          continue;
        }
        data.addPerson(id, fname, lname, age, city);
      }

    } else if (choice === '2') {
      console.table(data.loadInfo());

    } else if (choice === '3') {
      const id = Number(await ask('ID: '));
      const person = data.loadInfo().find(person => person.id === id);
      console.log(person || 'Person not found');

    } else if (choice === '4') {
      data.deleteAllData();
      console.log('All people deleted');

    } else if (choice === '5') {
      const id = Number(await ask('ID: '));
      data.deleteData(id);

    } else if (choice === '6') {
      const people = data.loadInfo();
      for (let i = 0; i < people.length; i++) {
        console.log(people[i].fname + ' ' + people[i].lname + ' - ' + people[i].city);
      }
    }
  }
  rl.close();
}

main();
