const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const people = [];

function question(message) {
  return new Promise(resolve => rl.question(message, resolve));
}

async function addPeople() {
  while (people.length < 10) {
    console.log(`\nEnter person ${people.length + 1} of 10`);

    const id = (await question('ID: ')).trim();
    if (!id || people.some(person => person.id === id)) {
      console.log('Please enter a unique ID.');
      continue;
    }

    const firstName = (await question('First name: ')).trim();
    const lastName = (await question('Last name: ')).trim();
    const ageInput = (await question('Age: ')).trim();
    const age = Number(ageInput);
    const city = (await question('City: ')).trim();

    if (!firstName || !lastName || !city || !ageInput || !Number.isInteger(age) || age <= 0) {
      console.log('Some details are missing or invalid. Please try again.');
      continue;
    }

    people.push({ id, firstName, lastName, age, city });
    console.log('Person added successfully.');
  }
}

function showAllPeople() {
  if (people.length === 0) {
    console.log('No people have been added yet.');
    return;
  }
  console.table(people);
}

async function showOnePerson() {
  const id = (await question('Enter the ID: ')).trim();
  const person = people.find(person => person.id === id);
  if (person) console.table([person]);
  else console.log('Person not found.');
}

async function deleteOnePerson() {
  const id = (await question('Enter the ID to delete: ')).trim();
  const index = people.findIndex(person => person.id === id);
  if (index === -1) {
    console.log('Person not found.');
    return;
  }
  people.splice(index, 1);
  console.log('Person deleted.');
}

function showNamesAndCities() {
  if (people.length === 0) {
    console.log('No people to display.');
    return;
  }
  people.forEach(person => {
    console.log(`${person.firstName} ${person.lastName} - ${person.city}`);
  });
}

async function main() {
  while (true) {
    console.log('\n--- People Manager ---');
    console.log('1. Enter 10 people');
    console.log('2. Show all people');
    console.log('3. Find a person by ID');
    console.log('4. Delete all people');
    console.log('5. Delete a person by ID');
    console.log('6. Show full names and cities');
    console.log('7. Exit');

    const choice = (await question('Choose an option: ')).trim();

    switch (choice) {
      case '1':
        if (people.length === 10) console.log('You already have 10 people.');
        else await addPeople();
        break;
      case '2': showAllPeople(); break;
      case '3': await showOnePerson(); break;
      case '4':
        people.length = 0;
        console.log('All people deleted.');
        break;
      case '5': await deleteOnePerson(); break;
      case '6': showNamesAndCities(); break;
      case '7':
        console.log('Goodbye!');
        rl.close();
        return;
      default: console.log('Invalid option. Please choose 1 to 7.');
    }
  }
}

main();
