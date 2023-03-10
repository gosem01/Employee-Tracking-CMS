const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

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
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
    },
    {
        type: 'input',
        name: 'departmentName',
        message: "What is the name of the department?",
        when: (answers) => answers.menu === 'Add Department'
    },
    {
        type: 'input',
        name: 'roleTitle',
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
        type: 'list',
        name: 'roleDepartment',
        message: "What is the department id for this role?",
        choices: async function() {
            const departments = await db.promise().query('SELECT * FROM department');
            return departments[0].map(department => {
                return {
                    name: `${department.name}`,
                    value: department.id
                }
            });
        },
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
        type: 'list',
        name: 'employeeRole',
        message: "What is the employee's role?",
        choices: async function() {
            const roles = await db.promise().query('SELECT * FROM roles');
            return roles[0].map(role => {
                return {
                    name: `${role.title}`,
                    value: role.id
                }
            });
        },
        when: (answers) => answers.menu === 'Add Employee'
    },
    {
        type: 'list',
        name: 'employeeManager',
        message: "Select a manager:",
        choices: async function() {
            const employees = await db.promise().query('SELECT * FROM employee');
            return employees[0].map(employee => {
                return {
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id
                }
            });
        },
        when: (answers) => answers.menu === 'Add Employee'
    },
    {
        type: 'input',
        name: 'employeeUpdateFirst',
        message: "What is the employee's first name",
        when: (answers) => answers.menu === 'Update Employee Role'
    },
    {
        type: 'input',
        name: 'employeeUpdateLast',
        message: "What is the employee's last name",
        when: (answers) => answers.menu === 'Update Employee Role'
    },
    {
        type: 'list',
        name: 'employeeUpdateRole',
        message: "What is the employee's new role?",
        choices: async function() {
            const roles = await db.promise().query('SELECT * FROM roles');
            return roles[0].map(role => {
                return {
                    name: `${role.title}`,
                    value: role.id
                }
            });
        },
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

        if(await answers.menu === 'Quit') {
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
                'SELECT roles.id AS role_id, roles.title AS role_title, roles.salary, department.name AS department_name FROM roles LEFT JOIN department ON roles.department_id = department.id',
                function(err, results, fields) {
                    console.log('\n');
                    console.table(results);
                    for(var i = 0; i < results.length; i++) {
                        console.log('\n');
                    }
                    console.log('\n');
                }
            );
        } else if (await answers.menu === 'View All Employees') {
            db.query(
                `SELECT e.id, e.first_name, e.last_name, r.title AS role, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
                FROM employee e
                JOIN roles r ON e.role_id = r.id
                JOIN department d ON r.department_id = d.id
                LEFT JOIN employee m ON e.manager_id = m.id`,
                function(err, results, fields) {
                    console.log('\n');
                    console.table(results);
                    for(var i = 0; i < results.length; i++) {
                        console.log('\n');
                    }
                    console.log('\n');
                }
            );
        } else if (await answers.menu === 'Add Department') {
            const name = answers.departmentName;

            db.query(
                'INSERT INTO department (name) VALUES (?)',
                [name],
                function(err, results, fields) {
                    console.log('\n');
                }
            );
        } else if (await answers.menu === 'Add Role') {
            const title = answers.roleTitle;
            const salary = answers.roleSalary;
            const departmentId = answers.roleDepartment;

            db.query(
                'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)',
                [title, salary, departmentId],
                function(err, results, fields) {
                    console.log('\n');
                }
            );
        } else if (await answers.menu === 'Add Employee') {
            const first = answers.employeeFirstName;
            const last = answers.employeeLastName;
            const role = answers.employeeRole;
            const manager = answers.employeeManager;
            // console.log([first, last, role, manager])
            db.query(
                'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
                [first, last, role, manager],
                function(err, results, fields) {
                    console.log('\n');
                    console.log(err);
                }
            );
        } else if (await answers.menu === 'Update Employee Role') {
            const first = answers.employeeUpdateFirst;
            const last = answers.employeeUpdateLast;
            const role = answers.employeeUpdateRole;

            db.query(
                'UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?',
                [role, first, last],
                function(err, results, fields) {
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