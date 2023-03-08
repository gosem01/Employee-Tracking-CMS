const inquirer = require('inquirer');

const employeeQuestions = [
    {
        type: 'list',
        name: 'menu',
        message: "What would you like to do?",
        choices: ['Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
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

    let keepAsking = true;
    while(keepAsking) {
        const answers = await promptQuestions();

        if(await answers.menu !== 'Quit') {
            questionAnswers.push(answers);
        } else {
            keepAsking = false;
        }
    }
}

init();