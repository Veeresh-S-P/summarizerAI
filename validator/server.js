const express = require('express');
const app = express();
app.use(express.json());

const PORT = 3000;


const schema = [
  {
    label: 'Name',
    type: 'text',
    name: 'name',
    required: true,
    minLength: 3
  },
  {
    label: 'Email',
    type: 'email',
    name: 'email',
    required: true
  },
  {
    label: 'Age',
    type: 'number',
    name: 'age',
    required: false,
    min: 18,
    max: 100
  }
];


const submissions = [];


const validators = {
  text: value => typeof value === 'string',
  email: value =>
    typeof value === 'string',
  number: value => typeof value === 'number'
};

app.post('/submit-form', (req, res) => {
  const data = req.body;
  const errors = [];

  schema.forEach(field => {
    const { name, type, required, minLength, min, max } = field;
    const value = data[name];

    if (required && (value === undefined || value === null || value === '')) {
      errors.push(`${name} is required.`);
      return;
    }

    if (value === undefined || value === null || value === '') return;

    const validType = validators[type] && validators[type](value);
    if (!validType) {
      errors.push(`${name} must be a valid ${type}.`)
      return;
    }

    
    if (type === 'text' && minLength && value.length < minLength) {
      errors.push(`${name} is min length ${minLength} characters.`)
    }

    if (type === 'number') {
      if (min !== undefined && value < min) {
        errors.push(`${name} must be at least ${min}.`);
      }
      if (max !== undefined && value > max) {
        errors.push(`${name} must be at most ${max}.`);
      }
    }
  });

  if (errors.length > 0) {
    return res.json({errors });
  }

  submissions.push(data);
  res.json({ message:data });
})


app.get('/submissions', (req, res) => {
  res.json({ submissions })
})

app.listen(PORT,()=>{
  console.log(`Server running${PORT}`)
})
