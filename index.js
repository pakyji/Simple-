const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send('Bot is running successfully!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
