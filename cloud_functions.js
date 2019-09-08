var BigQuery = require('@google-cloud/bigquery'); 
var projectId = '<project_id>'; 
 
var bigquery = new BigQuery({ 
  projectId: projectId, 
}); 
 
var datasetName = '<registry_name>'; 
var tableName = '<table_name>'; 
 
exports.pubsubToBQ = function(event, callback) { 
  var msg = event.data; 
  var data = JSON.parse(Buffer.from(msg.data, 'base64').toString()); 
  // console.log(data); 
  bigquery 
    .dataset(datasetName) 
    .table(tableName) 
    .insert(data) 
    .then(function() { 
      console.log('Inserted rows'); 
      callback(); // task done 
    }) 
    .catch(function(err) { 
      if (err && err.name === 'PartialFailureError') { 
        if (err.errors && err.errors.length > 0) { 
          console.log('Insert errors:'); 
          err.errors.forEach(function(err) { 
            console.error(err); 
          }); 
        } 
      } else { 
        console.error('ERROR:', err); 
      } 
 
      callback(); // task done 
    }); 
};
