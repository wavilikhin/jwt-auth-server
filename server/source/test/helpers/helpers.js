const test = require('ava');
const { validateEmail } = require('../../helpers/validateEmail');
const { ErrorResponse } = require('../../helpers/errorResponse');

test('validateEmail returns true on valid email', (t) => {
  t.is(validateEmail('test@email.com'), true);
  t.is(validateEmail('le@ki.dj'), true);
  t.is(validateEmail('ri@jeguzse.fr'), true);
  t.is(validateEmail('osupeno@nid.gd'), true);
  t.is(validateEmail('pujufu@ededuszi.su'), true);
  t.is(validateEmail('gejdavkim@diojbem.sd'), true);
});

test('validateEmail returns false on invalid email', (t) => {
  t.is(validateEmail('testemail.com'), false);
  t.is(validateEmail('le@kidj'), false);
  t.is(validateEmail('2@.r'), false);
  t.is(validateEmail('asdasdasdasd'), false);
  t.is(validateEmail('1231'), false);
  t.is(validateEmail('dsasd>.2123>@ma.ri'), false);
});

test('ErrorResponse without arguments works correctly', (t) => {
  const err = new ErrorResponse();
  t.is(err.name, 'CridentialsError');
  t.is(err.statusCode, 403);
});

test('ErrorResponse with arguments works correctly', (t) => {
  const err = new ErrorResponse('TestError', 1337);
  t.is(err.name, 'TestError');
  t.is(err.statusCode, 1337);
});
