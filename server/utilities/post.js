const axios = require("axios");
const { URL, TOPIC } = require("../constants");

const getTopicOfPost = async ({ data }) => {
  try {
    const res = await axios({
      method: "post",
      url: `${URL}/predict`,
      data: {
        data,
      },
    });
    const index = TOPIC.findIndex((topic) => topic.value === res.data);
    if (index !== -1) {
      return TOPIC[index].display;
    }
    return res.data;
  } catch (error) {}
};

module.exports = { getTopicOfPost };
