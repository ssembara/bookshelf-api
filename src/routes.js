const {
  create,
  index,
  show,
  destroy,
  update,
} = require('./bookHandler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: create,
  },
  {
    method: 'GET',
    path: '/books',
    handler: index,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: show,
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: destroy,
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: update,
  },
];

module.exports = routes;
