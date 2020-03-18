<@received>
  const { data } = await axios.get("https://5abe1d53d4c5900014949e9c.mockapi.io/api/articles");
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
