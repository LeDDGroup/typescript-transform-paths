const target = process.env.TEST_TARGET === 'dist' ? 'dist' : 'src';

module.exports = require(`tstp/${target}`);
