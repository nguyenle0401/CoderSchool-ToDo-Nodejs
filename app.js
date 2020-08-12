const fs = require("fs");
const yargs = require("yargs");
const chalk = require("chalk");

// console.log(chalk.blue("Hello world!"));
// console.log(chalk.red("Hello world!"));
// console.log(chalk.green("Hello world!"));
// console.log(chalk.red.bold("Hello world!"));

function loadData() {
  try {
    const buffer = fs.readFileSync("data.json"); //path to the file we want to read
    const dataString = buffer.toString(); // a string
    const javaScriptObject = JSON.parse(dataString); // convert string to js object
    return javaScriptObject;
  } catch (err) {
    console.log("ERROR", err);
    return [];
  } // expect to be a js array
}

function saveData(data) {
  // write a string or buffer to data.json
  fs.writeFileSync("data.json", JSON.stringify(data));
}


//Add todos
yargs.command({
  command: "add",
  describe: "Used for adding new todo",
  builder: {
    todo: {
      describe: "Todo content",
      demandOption: true,
      type: "string",
    },
    completed: {
      describe: "Todo status",
      type: "boolean",
      default: false,
    },
  },
  handler: function (arguments) {
    let todos = loadData();
    const id = todos.length === 0 ? 1 : todos[todos.length - 1].id + 1;
    todos.push({
      id: id,
      todo: arguments.todo,
      completed: arguments.completed,
    });
    saveData(todos);
    console.log(chalk.yellowBright.bold("Successfully"));
  },
});

//todos list
yargs.command({
  command: "list",
  describe: "",
  builder: {
    completed: {
      describe: "true = todo done, false = undone",
      type: "string",
      default: "all",
    },
  },

  handler: function ({ completed }) {
    const todos = loadData();
    let results;
    let color = "blue"
    if (completed === "true") {
      color = "green"
      results = todos.filter((e) => e.completed === true);
    } else if (completed === "false") {
      color = "red"
      results = todos.filter((e) => e.completed === false);
    } else {
      results = todos;
    }
    results.forEach((e, index) =>
      console.log(chalk[color](`id: ${e.id}, todo: ${e.todo} \n completed: ${e.completed}`))
    );
  },
});

//Delete items
yargs.command({
  command: "delete",
  describe: "delete",
  builder: {
    id: {
      describe: "id",
      demandOption: true,
      type: "number",
    },
  },
  handler: function (args) {
    const todos = loadData();
    const results = todos.filter((e) => e.id !== args.id);
    saveData(results);
    console.log(chalk.yellowBright.bold("Done"));
  },
});

//Delete all
yargs.command({
  command: "delete_all",
  describe: "delete all todos",

  handler: function () {
    saveData([]);
    console.log(chalk.yellowBright.bold("Done"));
  },
});

//Delete all completed
yargs.command({
  command: "delete_all_completed",
  describe: "delete all todos completed",

  handler: function () {
    const todos = loadData();
    const results = todos.filter((e) => (e.completed = "false"));
    saveData(results);
    console.log(chalk.yellowBright.bold("Done"));
  },
});

//Exchange status
yargs.command({
  command: "toggle",
  describe: "complete status",
  builder: {
    id: {
      describe: "id",
      demandOption: true,
      type: "number",
    },
  },
  handler: function (args) {
    const todos = loadData();
    const results = todos.map((e) => {
      if (e.id === args.id) {
        e.completed = !e.completed;
      }
      return e;
    });
    saveData(results);
    console.log(chalk.yellowBright.bold("Done"));
  },
});

yargs.parse();
