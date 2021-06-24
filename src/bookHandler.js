const { nanoid } = require('nanoid');
const books = require('./books');
const validation = require('./validation');

const create = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;
  const newBooks = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  const val = validation(newBooks);

  if (val.message !== undefined) {
    const response = h.response(validation(newBooks));
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBooks);

  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const index = (request) => {
  const params = request.query;
  let filterBook;
  let slicing;
  // eslint-disable-next-line eqeqeq
  if (params.reading == 1) {
    filterBook = books.filter((e) => e.reading);
    // eslint-disable-next-line eqeqeq
  } else if (params.reading == 0) {
    filterBook = books.filter((e) => !e.reading);
    // eslint-disable-next-line eqeqeq
  } else if (params.finished == 1) {
    filterBook = books.filter((e) => e.finished);
    // eslint-disable-next-line eqeqeq
  } else if (params.finished == 0) {
    filterBook = books.filter((e) => !e.finished);
    // eslint-disable-next-line eqeqeq
  } else if (params.name != undefined) {
    filterBook = books.filter((e) =>
      e.name.toLowerCase().includes(params.name.toLowerCase()),
    );
  }

  // eslint-disable-next-line eqeqeq
  if (filterBook == undefined) {
    slicing = books.map((item) => ({
      id: item.id,
      name: item.name,
      publisher: item.publisher,
    }));
  } else {
    slicing = filterBook.map((item) => ({
      id: item.id,
      name: item.name,
      publisher: item.publisher,
    }));
  }

  return {
    status: 'success',
    data: {
      books: slicing,
    },
  };
};

const show = (request, h) => {
  const { id } = request.params;

  const book = books.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const update = (request, h) => {
  const { id } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  const findBook = books.findIndex((book) => book.id === id);
  const finished = pageCount === readPage;
  if (findBook !== -1) {
    const val = validation(request.payload);

    if (val.message !== undefined) {
      const response = h.response(validation(request.payload, 'update'));
      response.code(400);
      return response;
    }
    books[findBook] = {
      ...books[index],
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
      finished,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const destroy = (request, h) => {
  const { id } = request.params;

  const findBook = books.findIndex((book) => book.id === id);

  if (findBook !== -1) {
    books.splice(findBook, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  create,
  index,
  show,
  update,
  destroy,
};
