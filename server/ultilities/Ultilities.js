const sortID = (s1, s2) => {
  if (s1.localeCompare(s2) === 1) {
    return `${s2}_${s1}`;
  }
  return `${s1}_${s2}`;
};

module.exports = { sortID };
