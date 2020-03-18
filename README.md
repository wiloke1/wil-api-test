# API test

**npm**

```bash
npm install wil-api-test --save-dev
```

**yarn**

```bash
yarn add wil-api-test --save-dev
```

### Example

#### package.json
```js
"scripts": {
  ...
  "api-test": "wil-api-test src --baseURL axios_base_url"
}
```

#### Create file testing: example foo.test.api.js
```js
<@received>
  // using axios ( not import )
  const { data } = axios.get("API ENDPOINT OR URL");
  const result = data[0];
  return result;
</@received>

<@expected>
{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
  "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
}
</@expected>
```

#### Cli test all files `yarn api-test` or `npm run api-test`

### Cli test only file `yarn api-test --file foo.test.api.js` or `npm run api-test --file foo.test.api.js`