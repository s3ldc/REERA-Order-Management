/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3018484464")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\" && @request.auth.record.role = \"Admin\"",
    "deleteRule": "@request.auth.id != \"\" && @request.auth.record.role = \"Admin\"",
    "updateRule": "@request.auth.id != \"\" && @request.auth.record.role = \"Admin\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3018484464")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\" && @request.auth.record.role = \"admin\"",
    "deleteRule": "@request.auth.id != \"\" && @request.auth.record.role = \"admin\"",
    "updateRule": "@request.auth.id != \"\" && @request.auth.record.role = \"admin\""
  }, collection)

  return app.save(collection)
})
