# Back-end Task 1

Node.js people management task, using `yargs` commands and a JSON file like Lecture 4.

First install the required package:

```bash
npm install
```

Run these commands from the project folder:

```bash
node app.js list
node app.js read --id=1
node app.js names
node app.js delete --id=1
node app.js delete-all
node app.js add --id=1 --fname=Omar --lname=Ahmed --city=Cairo --age=20
```

You can enter up to 10 people using the `add` command 10 times with different IDs. The JSON file already contains 10 example people, so delete a person or run `delete-all` before adding your own. Changes are saved in `data10.json`.
