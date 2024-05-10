const hbs = require('hbs');

hbs.registerHelper('formatDate', function(date) {
  return date ? date.toISOString().split('T')[0] : '';
});
