const inquirer = require('inquirer');
// get the client
const mysql = require('mysql2');
const cTable = require('console.table');

// create the connection to database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'employee_tracker_db'
});

const employeeQuestions = [
    {
        type: 'list',
        name: 'menu',
        message: "What would you like to do?",
        choices: ['Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
    },
    {
        type: 'input',
        name: 'departmentName',
        message: "What is the name of the department?",
        when: (answers) => answers.menu === 'Add Department'
    },
    {
        type: 'input',
        name: 'roleName',
        message: "What is the name of the role?",
        when: (answers) => answers.menu === 'Add Role'
    },
    {
        type: 'input',
        name: 'roleSalary',
        message: "What is the salary?",
        when: (answers) => answers.menu === 'Add Role'
    },
    {
        type: 'input',
        name: 'roleDepartment',
        message: "What is the department for this role?",
        when: (answers) => answers.menu === 'Add Role'
    },
    {
        type: 'input',
        name: 'employeeFirstName',
        message: "What is the employee's first name?",
        when: (answers) => answers.menu === 'Add Employee'
    },
    {
        type: 'input',
        name: 'employeeLastName',
        message: "What is the employee's last name?",
        when: (answers) => answers.menu === 'Add Employee'
    },
    {
        type: 'input',
        name: 'employeeRole',
        message: "What is the employee's role?",
        when: (answers) => answers.menu === 'Add Employee'
    },
    {
        type: 'input',
        name: 'employeeManager',
        message: "Who is the employee's manager?",
        when: (answers) => answers.menu === 'Add Employee'
    },
    {
        type: 'input',
        name: 'employeeUpdateRole',
        message: "What is the employee's new role?",
        when: (answers) => answers.menu === 'Update Employee Role'
    }
];

async function promptQuestions() {
    const answers = await inquirer.prompt(employeeQuestions);
    return answers;
}

const questionAnswers = [];


async function init() {
    // db.query(
    //     'SELECT * FROM department',
    //     function(err, results, fields) {
    //         console.log('\n');
    //         console.table(results);
    //     }
    // );

    let keepAsking = true;
    while(keepAsking) {
        const answers = await promptQuestions();

        if(await answers.menu === 'Quit') {
            // questionAnswers.push(answers);
            keepAsking = false;
        } else if (await answers.menu === 'View All Departments') {
            db.query(
                'SELECT * FROM department',
                function(err, results, fields) {
                    console.log('\n');
                    console.table(results);
                    for(var i = 0; i < results.length; i++) {
                        console.log('\n');
                    }
                    console.log('\n');
                }
            );
        } else if (await answers.menu === 'View All Roles') {
            db.query(
                'SELECT * FROM roles',
                function(err, results, fields) {
                    console.log('\n');
                    console.table(results);
                    for(var i = 0; i < results.length; i++) {
                        console.log('\n');
                    }
                    console.log('\n');
                }
            );
        } else {
            // keepAsking = false;
        }
    }
    console.log(questionAnswers);
}

init();