/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3018484464")

  // remove field
  collection.fields.removeById("relation4248835376")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3018484464")

  // add field
  collection.fields.addAt(8, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3018484464",
    "hidden": false,
    "id": "relation4248835376",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "distributor_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
