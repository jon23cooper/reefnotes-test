function(doc) {
if (type="log"){
  emit(doc._id, doc);
}
}