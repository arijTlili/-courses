const moment = require('moment');
const request = require('supertest');
const {Rental} = require('../../models/rental');
const {Course} = require('../../models/course');
const {User} = require('../../models/user');
const mongoose = require('mongoose');

describe('/api/returns', () => {
  let server; 
  let customerId; 
  let courseId;
  let rental;
  let course; 
  let token;

  const exec = () => {
    return request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ customerId, courseId });
  };
  
  beforeEach(async () => { 
    server = require('../../index'); 

    customerId = mongoose.Types.ObjectId();
    courseId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    course = new Course({
      _id: courseId,
      title: '12345',
      dailyRentalRate: 2,
      field: { name: '12345' },
      numberOfHours: 10 
    });
    await course.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: '12345',
        phone: '12345'
      },
      course: {
        _id: courseId,
        title: '12345',
        dailyRentalRate: 2
      }
    });
    await rental.save();
  });

  afterEach(async () => { 
    await server.close(); 
    await Rental.remove({});
    await Course.remove({});
  });  

  it('should return 401 if client is not logged in', async () => {
    token = '';

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it('should return 400 if customerId is not provided', async () => {
    customerId = ''; 
    
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 400 if courseId is not provided', async () => {
    courseId = ''; 

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 404 if no rental found for the customer/course', async () => {
    await Rental.remove({});

    const res = await exec();

    expect(res.status).toBe(404);
  });

  it('should return 400 if return is already processed', async () => {
    rental.dateReturned = new Date();
    await rental.save();

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 200 if we have a valid request', async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it('should set the returnDate if input is valid', async () => {
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);
    const diff = new Date() - rentalInDb.dateReturned;
    expect(diff).toBeLessThan(10 * 1000);
  });

  it('should set the rentalFee if input is valid', async () => {
    rental.dateOut = moment().add(-7, 'days').toDate();
    await rental.save();

    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);
    expect(rentalInDb.rentalFee).toBe(14);
  });

  it('should increase the course stock if input is valid', async () => {
    const res = await exec();

    const courseInDb = await course.findById(courseId);
    expect(courseInDb.numberOfHours).toBe(course.numberOfHours + 1);
  });

  it('should return the rental if input is valid', async () => {
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);

    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee',
      'customer', 'course']));
  });
});