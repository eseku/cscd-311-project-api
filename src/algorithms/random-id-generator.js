
const rand = () => {
  let charset = new String;
  let charset1 = new String;
  let time = Date.now().toString();
  let datePosition;

  for (let i = 0; i < 8; i++) {
    let rand = Math.floor(Math.random() * 8)
    charset = charset + rand;
  }

  for (var i = 0; i < charset.length; i++) {
    let time = Date.now().toString();
    charset[i] = String(Number(charset[i]) * Number(time[i]))
  }
  return charset
}

  module.exports = rand;
