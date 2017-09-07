# App for testing schema stitching in graphql-tools
Install:
```sh
$ yarn
```
Run:
```sh
$ node server.sh
```

Graphiql will be available on localhost:3001

This query:

```graphql
{
  author(id:1) {
    id, children {
      ... on SingerChild {
        name
      }
      ... on SongwriterChild {
        bestSong
      }
    }
  }
}
```

Will produce this data: 

```json
{
  "errors": [
    {
      "message": "Unknown type \"SingerChild\".",
      "locations": [
        {
          "line": 4,
          "column": 12
        }
      ]
    },
    {
      "message": "Unknown type \"SongwriterChild\".",
      "locations": [
        {
          "line": 7,
          "column": 12
        }
      ]
    }
  ]
}
```

But we expect this:
```json
{
  "data": {
    "author": {
      "id": 1,
      "children": [
        {
          "name": "Bob"
        },
        {
          "name": "Nemo"
        },
        {
          "bestSong": "You"
        }
      ]
    }
  }
}
```
