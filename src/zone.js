import Promise from 'bluebird'
import Location from './location'
import mongoose from 'mongoose'
let Schema = mongoose.Schema;

let zoneSchema = new Schema({
  width: Number,
  height: Number,
  locations: [{type: Schema.Types.ObjectId, ref: 'Location'}]
});

/**
 * Generates and saves a map and its locations
 * using the width/height properties of the instance.
 */
zoneSchema.methods.genMap = function(){
  const self = this;
  return new Promise(function(resolve, reject){

    genMapAsync(0, 0, self)
      .then(function() {
        self.save(function(err){
          if(err){
            console.error(err);
            return reject(err);
          }
          return resolve();
        });
      })
      .catch(function(err){
        reject(err);
      });
  });
};

/**
 * returns a valid zone location when given valid coordinates
 */
zoneSchema.methods.getLocation = function(x, y){
  const self = this;
  return new Promise(function(resolve, reject){
    Location
      .findOne({zone: self.id, x: x, y: y}, function(err, loc){
        if(err){
          reject(err);
        }
        resolve(loc);
      });
  });

};


let Zone;
if (mongoose.models.Zone){
  Zone = mongoose.model('Zone');
} else {
  Zone = mongoose.model('Zone', zoneSchema);
}
export default Zone

function genMapAsync(startCol=0, startRow=0, zoneContext){
  let col, row;
  return new Promise(function(resolve, reject){
    const startTime = Date.now();

    for(col = startCol; col < zoneContext.width; col++){
      if(Date.now() - startTime > 15){
        return resolve(setTimeout(()=>{
          genMapAsync(col, row, zoneContext);
        },0));
      }
      for (row = startRow; row < zoneContext.height; row++){
        let type;
        if (col === 0 || col === zoneContext.width - 1 || row === 0 || row === zoneContext.width - 1){
          type = 'water';
        } else if (Math.random() >= 0.95){
          type = 'wall';
        } else {
          type = 'grass';
        }

        let loc = new Location({
          x: col,
          y: row,
          type: type,
          zone: zoneContext.id
        })
        loc.save();
        zoneContext.locations.push(loc);
      }
    }
    resolve();
  });
};
