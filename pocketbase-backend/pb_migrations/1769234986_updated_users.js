/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3018484464")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\" && @request.auth.record.role = \"admin\"",
    "deleteRule": "@request.auth.id != \"\" && @request.auth.record.role = \"admin\"",
    "listRule": "@request.auth.id != \"\"",
    "updateRule": "@request.auth.id != \"\" && @request.auth.record.role = \"admin\"",
    "viewRule": "@request.auth.id != \"\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3018484464")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.role = \"admin\"",
    "deleteRule": "@request.auth.role = \"admin\"",
    "listRule": "@request.auth.role = \"admin\"",
    "updateRule": "@request.auth.role = \"admin\"",
    "viewRule": "@request.auth.role = \"admin\""
  }, collection)

  return app.save(collection)
})
