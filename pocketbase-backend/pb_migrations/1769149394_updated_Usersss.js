/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3018484464")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_tokenKey_lczgwadww4` ON `users` (`tokenKey`)",
      "CREATE UNIQUE INDEX `idx_email_lczgwadww4` ON `users` (`email`) WHERE `email` != ''"
    ],
    "name": "users"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3018484464")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_tokenKey_lczgwadww4` ON `Usersss` (`tokenKey`)",
      "CREATE UNIQUE INDEX `idx_email_lczgwadww4` ON `Usersss` (`email`) WHERE `email` != ''"
    ],
    "name": "Usersss"
  }, collection)

  return app.save(collection)
})
