<@received>
  const data = await axios.get("todolist");
  const result = data[0];
  return result;
</@received>

<@expected>
{
  "id": "3",
  "text": "sdfsdf"
}
</@expected>
