import request from 'supertest';
import { Photographer } from './types';
import app from './app';
import photographers from './photographers.json';

describe('the api endpoints', () => {
    test('the get all photographers endpoint', async () => {
        const res = await request(app).get("/api/photographers");
        expect(res.statusCode).toEqual(200);
        res.body.photographers.forEach((photographer: Photographer) => {
            expect(photographer).toHaveProperty('id'); 
            expect(photographer).toHaveProperty('name'); 
            expect(photographer).toHaveProperty('availabilities'); 
        })
        expect(res.body.photographers.length).toEqual(photographers.photographers.length)
    })
})