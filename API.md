HTTP API
========

The main interface to NextEPC is a RESTful HTTP API. The API can perform basic OAM functions on NextEPC daemons.


* ### MME SEND API

SEND API can forcely send a signalling message.

<table>
  <thead>
    <tr>
      <th>Method
      <th>Path
  </thead>
  <tr>
    <td>PUT
    <td>/send/s1ap
</table> 

Sample Requst

```bash
curl \
    --request PUT \
    --data @WriteReplaceWarningRequest.json \
    --header "Content-Type: application/json" \
    http://127.0.0.1:3001/send/s1ap    
```
