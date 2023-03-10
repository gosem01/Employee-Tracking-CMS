INSERT INTO department (name)
VALUES ("Engineering"),
       ("Staffing"),
       ("Finance");

INSERT INTO roles (title, salary, department_id)
VALUES ("supervisor", 90000.00, 1),
       ("jr web developer", 75000.00, 1),
       ("recruiter", 50000.00, 2),
       ("accountant", 50000.00, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, 1),
       ("Jane", "Deer", 1, 1),
       ("Mark", "Cuban", 2, 2),
       ("Jerry", "Rice", 3, 3);
       