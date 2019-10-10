const mongoose = require('mongoose');
const chalk = require('chalk')

mongoose.connect('mongodb://127.0.0.1/cscd-311-project-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => {
  console.log(chalk.green('Successful Connection'));
}).catch((e) => {
  console.log(chalk.red('Error'));
})
