/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2502130355")

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "number276705148",
    "max": null,
    "min": null,
    "name": "mag",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1948079053",
    "max": 0,
    "min": 0,
    "name": "place",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2502130355")

  // remove field
  collection.fields.removeById("number276705148")

  // remove field
  collection.fields.removeById("text1948079053")

  return app.save(collection)
})
