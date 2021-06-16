const validation = (a, method = null) => {
  const status = 'fail';
  let message;
  if (a.name === undefined) {
    if (method === 'update') {
      message = 'Gagal memperbarui buku. Mohon isi nama buku';
    } else {
      message = 'Gagal menambahkan buku. Mohon isi nama buku';
    }
  }

  return {
    status,
    message,
  };
};

module.exports = validation;
