const {chain}  = require('stream-chain');
 
const {parser} = require('stream-json');
const {pick}   = require('stream-json/filters/Pick');
const {ignore} = require('stream-json/filters/Ignore');
const {streamValues} = require('stream-json/streamers/StreamValues');
const {streamer} = require("stream-json/streamers/StreamObject");

const fs = require('fs');
const os = require('os'); 

exports.getData = async function(file) {
    return new Promise(function(resolve, reject) {
        const pipeline = chain([
              fs.createReadStream(file),
              parser(),
              pick({filter: 'versions'}),
              ignore({filter: /\b_meta\b/i}),
              streamValues(),
              data => {
                  const value = data.value;
                let param_list = [];
                for (x in value) {
                    let obj = value[x].param
                    param_list.push({
                        key: value[x].id,
                        value: value[x].url
                    });
                }
                resolve(param_list);
                this.destroy();
            }
        ])
        .on('error', function(err) {
            throw err;
        })
        .on('end', function() {
            ;
        })
        .on('data', function() {
            ;
        })
        .catch(err => {
            console.error("Something happend: ", err);
        });
    });
};
