const moment = require('moment');
const _ = require('lodash');
const urlencode = require('urlencode');
const approot = require('app-root-path');
const readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var modes = [
  'regex',
  'regex_special',
  'moment2date',
  'configstore'
];

var show_mode= function(reshow=false){
  console.log('[+] Available mode:');
  _.forEach(modes, function(mode, idx){
    console.log((idx+1)+'. '+mode);
  });
};

var show_main= function(){
  show_mode();
  rl.question('\n\r>>> Enter Mode : ', function(mode_number) {
    if(isNaN(mode_number)){
      console.log('Invalid mode!');
      show_main();
    }else{
      mode_number= parseInt(mode_number);
      if(_.isUndefined(modes[mode_number-1])){
        console.log('Invalid mode!');
        show_main();
      }else{
        exec_commands(modes[mode_number-1]);
        setTimeout(function(){
          rl.question('\n\r>>> Try another mode? (y/n) ', function(is_try) {
            if(is_try.toLowerCase() == 'y'){
              show_main();
              // setTimeout(show_main, 1000);
            }else{
              rl.close();
              process.exit(0);
            }
          });
        }, 3000);
      }
    }
  });
}

var exec_commands = function(mode) {
  switch (mode) {
    case 'regex':
      let data = [
        'I love docs.html',
        'I like docs.odt',
        'I hate docs.ods',
        'I really like docs.pdf',
        'https//drive.google.com/file/abcdefghijklmnop/edit?usp=drivesdk'
      ];

      _.forEach(data, function(each) {
        // let mod=_.replace(each, /(docs\.html|docs\.odt|docs\.ods|docs\.pdf|edit\?usp=drivesdk)/ig, 'x');
        let mod = _.replace(each, '/edit?usp=drivesdk', '/xyz');
        // console.log('>> replaced as: '+ urlencode(mod));
        console.log('>> replaced as: ' + mod);
      });
      break;
    case 'regex_special':
      let pattern = 'archipelago';
      let sample = ['find archipelago documentation', 'Archipelago team member'];
      _.forEach(sample, function(each) {
        // let pattern_exp=/pattern/i;
        let regex = new RegExp(pattern, 'i');
        let find = regex.test(each);
        console.log('>> test regex special (pattern: ' + pattern + ' || data: ' + each + '): ', find);
      });
      break;
    case 'moment2date':
      let dt = '2020-03-19T01:57:02.911Z';

      let utc_datetime = moment.utc(dt).format('YYYY-MM-DDTHH:mm:ss.SSSSZ');
      // let localtime= datetime.toDate();
      var localdate = moment(utc_datetime).local();
      var localdate_obj = localdate.toDate('UTC+7');
      var localdatestr = localdate.format('YYYY-MM-DD HH:mm:ss');

      console.log('Moment \\ Check:', {
        dt: dt,
        localdate: localdate,
        localdatestr: localdatestr,
        localdate_obj: localdate_obj,
        utc_datetime: utc_datetime
      });
      break;
    case 'configstore':
      const config = require(approot + '/helpers/config.js');
      console.log('Config Content: ', config.all);
      console.log('Scheduler Queue Storage: '+ config.get('scheduler.queue.storage'));
      break;
    default:
      console.log('do nothing');
  }
}

// Execute main
show_main();
