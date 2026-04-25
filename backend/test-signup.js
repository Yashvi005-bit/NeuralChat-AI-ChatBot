const axios = require('axios');
axios.post('http://localhost:5000/api/v1/user/signup', {
  name: "TestUser",
  email: `test${Date.now()}@example.com`,
  password: "password123"
}).then(res => console.log(res.data))
  .catch(err => {
    if (err.response) {
      console.log('Error status:', err.response.status);
      console.log('Error data:', err.response.data);
    } else {
      console.log('Error:', err.message);
    }
  });
