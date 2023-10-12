const { Octokit } = require("octokit");
const dotenv = require('dotenv');


dotenv.config();

const octokit = new Octokit({
  baseUrl: 'https://api.github.com',
  auth: process.env.GITHUB_TOKEN,
  request: {
    fetch: fetch
  }
});

const search_query = '"exports.handler = async function (event, context)"';

async function search(query) {
  let results = new Set();
  let page = 1;
  while (true) {
    try {
      const result = await octokit.request('GET /search/code', {
        q: query,
        page: page,
      });
      result.data.items.forEach((item) => {
        results.add(item.repository.url);
      });
      page++;
    } catch(e) {
      break;
    }
  }
  return results;
}

search(search_query).then((result) => {
  console.log(JSON.stringify(Array.from(result)));
}).catch((err) => {
  console.log(err);
});
