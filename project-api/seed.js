const { Field } = require("./models/field");
const { Course } = require("./models/course");
const mongoose = require("mongoose");
const config = require("config");

const data = [
  {
    name: "Computer Science",
    courses: [
      { title: "Java Script", numberOfHours: 7, dailyRentalRate: 7 },
      { title: "Flutter", numberOfHours: 10, dailyRentalRate: 6 },
      { title: "HTML and CSS", numberOfHours: 9, dailyRentalRate: 6.5 },
      { title: "React", numberOfHours: 12, dailyRentalRate: 8 }
    ]
  },
  {
    name: "Embedded Telecommunications",
    courses: [
      { title: "Security", numberOfHours: 11, dailyRentalRate: 6 },
      { title: "Internet Protocol", numberOfHours: 15 , dailyRentalRate: 5 },
      { title: "Operating System", numberOfHours: 8, dailyRentalRate: 7 }
    ]
  },
  {
    name: "Industrial Electronics",
    courses: [
      { title: "MOPS Architecture", numberOfHours: 9 , dailyRentalRate: 4.5 },
      { title: "FPGA Cards", numberOfHours: 13, dailyRentalRate: 7.5 },
    ]
  },
  {
    name: "Mechatronics",
    courses: [
      { title: "Fluid Mechanics", numberOfHours: 14, dailyRentalRate: 5.5 },
    ]
  },
  {
    name: "Mechanical and Production",
    courses: [
      { title: "Conception of mechanical systems", numberOfHours: 15, dailyRentalRate: 6 },
      
    ]
  }
  
];

async function seed() {
  await mongoose.connect(config.get("db"));

  await Field.deleteMany({});

  for (let field of data) {
    const { _id: fieldId } = await new Field({ name: field.name }).save();
    const courses = field.courses.map(course => ({
      ...course,
      field: { _id: fieldId, name: field.name }
    }));
    await Course.insertMany(courses);
  }

  mongoose.disconnect();

  console.info("Done!");
}

seed();
