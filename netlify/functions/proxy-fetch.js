const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  try {
    const { startsWith, username } = event.queryStringParameters

    const response = await fetch(`http://api.geonames.org/searchJSON?q=united+states&name_startsWith=${startsWith}&maxRows=10&username=${username}`)
    const data = await response.json()

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch data" })
    };
  }
};