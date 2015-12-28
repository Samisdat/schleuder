{
   "_id": "_design/image",
   "_rev": "3-f7f954a0a32837ed6f3f8fc310733da5",
   "views": {
       "hash": {
           "map": "function(doc){ \n\tif('image' === doc.type){\n\t\temit(doc.hash, doc._id)\n\t}\n}"
       }
   },
   "language": "javascript"
}