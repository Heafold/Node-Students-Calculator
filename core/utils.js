const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
require('dayjs/locale/fr');
const customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(customParseFormat);

const studentsDataPath = path.join(__dirname, '..', 'Data', 'students.json');

function getStudentsData() {
  const data = fs.readFileSync(studentsDataPath, 'utf8');
  return JSON.parse(data);
}

function writeStudentsData(data) {
  fs.writeFileSync(studentsDataPath, JSON.stringify(data, null, 2), 'utf8');
}

const formatDate = (dateString) => {
    const date = dayjs(dateString, 'YYYY-MM-DD').locale('fr');
    return date.format('D MMMM YYYY');
}

  
function addStudent(student) {
  const students = getStudentsData();
  students.push(student);
  writeStudentsData(students);
}

function deleteStudent(name) {
  const students = getStudentsData();
  const updatedStudents = students.filter(student => student.name !== name);
  writeStudentsData(updatedStudents);
}

const calculate = {
  addition: (num1, num2) => num1 + num2,
  multiplication: (num1, num2) => num1 * num2
};

module.exports = {
  getStudentsData,
  formatDate,
  addStudent,
  deleteStudent,
  calculate
};
