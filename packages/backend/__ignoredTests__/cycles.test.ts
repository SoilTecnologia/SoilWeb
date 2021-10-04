import axios from 'axios';
import { connect } from 'http2';

const baseURL = 'http://localhost:3308/pivot';
const createRoute = `${baseURL}/create`;
const updateRoute = `${baseURL}/update`;
let pivot_id;
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZmJiM2RhZTQtN2M3OC00ZDA1LTgwYWYtOTBjNTYxNGI1ZDFmIiwidXNlcl90eXBlIjoiU1VETyIsImlhdCI6MTYzMzExNTU1NiwiZXhwIjoxNjMzMTIyNzU2fQ._BMf5EOkf97rr3NalAh9ZcIc9DMq2yslj5IFJJCL0qM"

describe('Cycles Test', () => {
	beforeAll(async () => {
		const newPivot = {
			node_id: 0,
			pivot_name: "10",
			lng: 30,
			lat: 30,
			start_angle: 0,
			end_angle: 360,
			radius: 150
		}

		const response = await axios.post(createRoute, newPivot);
		pivot_id = response.data.pivot_id;

	});


	test('Send offline while not running, expect nothing', async() => {
		const update = {
			power: "OFF",
			water: "NULL",
			direction: "NULL",
			connection: "ONLINE",
			curr_angle: 0,
			percentimeter: 0
		}

		const response = await axios.put(`${updateRoute}/${pivot_id}`, update);
		const data = response.data;

		expect(data).toStrictEqual([]);
	})

	test('valid data1', async() => {
		const update = {
			power: "ON",
			water: "DRY",
			direction: "CLOCKWISE",
			connection: "ONLINE",
			curr_angle: 0,
			percentimeter: 0
		}

		const response = await axios.put(`${updateRoute}/${pivot_id}`, update);
		const data = response.data;

		expect(data.length).toBe(3);
	})

	test('valid data2', async() => {
		const update = {
			power: "ON",
			water: "DRY",
			direction: "CLOCKWISE",
			connection: "ONLINE",
			curr_angle: 1,
			percentimeter: 5
		}

		const response = await axios.put(`${updateRoute}/${pivot_id}`, update);
		const data = response.data;


		expect(data.length).toBe(1);
	})

	test('valid data3', async() => {
		const update = {
			power: "ON",
			water: "DRY",
			direction: "CLOCKWISE",
			connection: "ONLINE",
			curr_angle: 3,
			percentimeter: 10
		}

		const response = await axios.put(`${updateRoute}/${pivot_id}`, update);
		const data = response.data;

		expect(data.length).toBe(1);
	})

	test('valid data4', async() => {
		const update = {
			power: "ON",
			water: "DRY",
			direction: "CLOCKWISE",
			connection: "ONLINE",
			curr_angle: 5,
			percentimeter: 10
		}

		const response = await axios.put(`${updateRoute}/${pivot_id}`, update);
		const data = response.data;

		expect(data.length).toBe(1);
	})

	test('valid data5', async() => {
		const update = {
			power: "ON",
			water: "DRY",
			direction: "CLOCKWISE",
			connection: "ONLINE",
			curr_angle: 5,
			percentimeter: 10
		}

		const response = await axios.put(`${updateRoute}/${pivot_id}`, update);
		const data = response.data;

		expect(data.length).toBe(1);
	})

	afterAll(async () => {
		await axios.delete(`${baseURL}/${pivot_id}`);
	})
});