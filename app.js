const express = require('express')
const app = express() 
const Joi = require('joi') // returns a Class. 

app.use(express.json()); 

let courses = [
{id: 1, name: 'course1' },
{id: 2, name: 'course2' },
{id: 3, name: 'course3' },]

app.get('/', (req,res) => {
	res.send('Hello world')
})
app.get('/api/courses', (req,res) => {
	res.send(courses)
})

app.get('/api/courses/:id', (req,res) => {
	
	let course = findCourse(req.params.id)
	if (!course) // if course is not found. 
	{
		return res.status(404).send('The course with given ID is not found.') // SEND 404 ERROR MESSAGE
	}
	res.send(course.name)
})
 
app.post('/api/courses', (req,res) => {
	 
	/*
	course name validation WITHOUT using Joi: 

	if (!req.body.name || req.body.name.length <3 ) {
		//400 bad request
		res.status(400).send('Name is required and should be minimum 3 characters.')
		return; // return because DON'T WANT THE REST OF THE FUNCTION TO BE EXECUTED IF THERE IS AN ERROR!! 
	}*/ 
	 
	const {error} = validateCourse(req.body); 

	if (error) {
		return res.status(400).send(error.details[0].message); 
		   
	}
	const course = {
		id: courses.length + 1, 
		name: req.body.name
	}; 
	courses.push(course); 
	res.send(course)
})
//edit course 
app.put('/api/courses/:id', (req,res) => {
	//look up course
	//if course not found, return error 404 
	let course = findCourse(req.params.id)

	if (!course) {
		return res.status(404).send('Course not found')
		 
	}

	//validate course 
	// if invalid, return 400 - bad request
	
	const {error} = validateCourse(req.body); 
	// OBJECT DESTRUCTURING = use {error} instead of result.error

	if (error) {
		return res.status(400).send(error.details[0].message); 
		 
	}
	

	//update course
	//return the updated course 
	course.name = req.body.name; 
	res.send(course)
})
// adding delete
app.delete('/api/courses/:id', (req,res) => {
	//look up course
	// if not existing, return 404
	let course = findCourse(req.params.id)
	// course = {id: 1, name:'math'}
	console.log(course)
	if (!course) // if course is not found. 
	{
		return res.status(404).send('The course with given ID is not found.') // SEND 404 ERROR MESSAGE
	}

	//Delete
	const index = courses.indexOf(course) // 
	courses.splice(index,1); // DELETE ONE

	// Return the same course 
	res.send(course)
})
function validateCourse(course) {
	const schema = {
		name: Joi.string().min(3).required()
	}
	return Joi.validate(course, schema)
}

function findCourse(course) {
	return course = courses.find( x => {
		return x.id === Number(course)
	})

}
const port = process.env.PORT || 3000; 
app.listen( port, () => {
	console.log('listening on port: ' + port)
})