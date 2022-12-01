const request = require('supertest');
const {Field} = require('../../models/field');
const {User} = require('../../models/user');
const mongoose = require('mongoose');

let server;

describe('/api/fields', () => {
  beforeEach(() => { server = require('../../index'); })
  afterEach(async () => { 
    await server.close(); 
    await Field.remove({});
  });

  describe('GET /', () => {
    it('should return all fields', async () => {
      const fields = [
        { name: 'field1' },
        { name: 'field2' },
      ];
      
      await Field.collection.insertMany(fields);

      const res = await request(server).get('/api/fields');
      
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.name === 'field1')).toBeTruthy();
      expect(res.body.some(g => g.name === 'field2')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    it('should return a field if valid id is passed', async () => {
      const field = new Field({ name: 'field1' });
      await field.save();

      const res = await request(server).get('/api/fields/' + field._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', field.name);     
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request(server).get('/api/fields/1');

      expect(res.status).toBe(404);
    });

    it('should return 404 if no field with the given id exists', async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get('/api/fields/' + id);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {

    // Define the happy path, and then in each test, we change 
    // one parameter that clearly aligns with the name of the 
    // test. 
    let token; 
    let name; 

    const exec = async () => {
      return await request(server)
        .post('/api/fields')
        .set('x-auth-token', token)
        .send({ name });
    }

    beforeEach(() => {
      token = new User().generateAuthToken();      
      name = 'field1'; 
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''; 

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if field is less than 5 characters', async () => {
      name = '1234'; 
      
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if field is more than 50 characters', async () => {
      name = new Array(52).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should save the field if it is valid', async () => {
      await exec();

      const field = await Field.find({ name: 'field1' });

      expect(field).not.toBeNull();
    });

    it('should return the field if it is valid', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'field1');
    });
  });

  describe('PUT /:id', () => {
    let token; 
    let newName; 
    let field; 
    let id; 

    const exec = async () => {
      return await request(server)
        .put('/api/fields/' + id)
        .set('x-auth-token', token)
        .send({ name: newName });
    }

    beforeEach(async () => {
      // Before each test we need to create a field and 
      // put it in the database.      
      field = new Field({ name: 'field1' });
      await field.save();
      
      token = new User().generateAuthToken();     
      id = field._id; 
      newName = 'updatedName'; 
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''; 

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if field is less than 5 characters', async () => {
      newName = '1234'; 
      
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if field is more than 50 characters', async () => {
      newName = new Array(52).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 404 if id is invalid', async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 404 if field with the given id was not found', async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should update the field if input is valid', async () => {
      await exec();

      const updatedField = await Field.findById(field._id);

      expect(updatedField.name).toBe(newName);
    });

    it('should return the updated field if it is valid', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', newName);
    });
  });  

  describe('DELETE /:id', () => {
    let token; 
    let field; 
    let id; 

    const exec = async () => {
      return await request(server)
        .delete('/api/fields/' + id)
        .set('x-auth-token', token)
        .send();
    }

    beforeEach(async () => {
      // Before each test we need to create a field and 
      // put it in the database.      
      field = new Field({ name: 'field1' });
      await field.save();
      
      id = field._id; 
      token = new User({ isAdmin: true }).generateAuthToken();     
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''; 

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 403 if the user is not an admin', async () => {
      token = new User({ isAdmin: false }).generateAuthToken(); 

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it('should return 404 if id is invalid', async () => {
      id = 1; 
      
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 404 if no field with the given id was found', async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should delete the field if input is valid', async () => {
      await exec();

      const fieldInDb = await Field.findById(id);

      expect(fieldInDb).toBeNull();
    });

    it('should return the removed field', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id', field._id.toHexString());
      expect(res.body).toHaveProperty('name', field.name);
    });
  });  
});