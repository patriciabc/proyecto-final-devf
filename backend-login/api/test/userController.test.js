import supertest from 'supertest';
import * as database from './database.js';
import api from '../api.js';

const agent = supertest.agent(api);
describe('Test Register User', () => {
  test('Create User', async () => {
    await database.connect();
    const response = await agent.post('/register').send({
            email:"patriciaballardoc@gmail.com",
            password:"1236",
            name:"Patricia",
            lastName:"Ballardo",
            role:"Administrator",
            isActive:true
    });
    expect(response.statusCode).toEqual(200);
    await database.close();
  });
}); 