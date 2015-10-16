import caminte from 'caminte'
let Schema = caminte.Schema;
let config = {
  driver: 'redis',
  password: '',
  host: 'localhost',
  port: '6379'
};

export new Schema(config.driver, config);

