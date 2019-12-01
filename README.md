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
  "apitest": "node node_modules/wil-api-test"
}
```

#### Create file wiloke.test.api.json at the root directory
```js
{
  "baseUrl": "API base url",
  "path": "src"
}
```

#### Create file testing: example foo.test.api.js
```js
<@received>
  const data = getData("API ENDPOINT OR URL");
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