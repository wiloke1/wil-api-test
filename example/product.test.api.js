<@received>
  const data = getData("https://5abe1d53d4c5900014949e9c.mockapi.io/api/product");
  const result = data[0];
  return result;
</@received>

<@expected>
{
  "id": "3",
  "text": "sdfsdf"
}
</@expected>
