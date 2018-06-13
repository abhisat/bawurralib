/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

$(document).ready(function() {
  var mainMenu;
  document.addEventListener("online", online, false);
  document.addEventListener("offline", offline, false);


  function online(){
    document.addEventListener("deviceready", database, false);
  }
  function database(){
    var proms = [];
    var data = {};
    proms.push(new Promise(function(resolve, reject){
      $.getJSON("http://bawurralibrary.appspot.com/serveculture").done(function(d){
        data.culture = d;
        resolve();
      });
    }));
    proms.push(new Promise(function(resolve, reject){
      $.getJSON("https://bawurralibrary.appspot.com/serveelders").done(function(d){
        data.elders = d;
        resolve();
      });
    }));
    // proms.push(new Promise(function(resolve, reject){
    //   $.getJSON("https://bawurralibrary.appspot.com/servelanguages").done(function(d){
    //     data.languages = d;
    //     resolve();
    //   });
    // }));
    proms.push(new Promise(function(resolve, reject){
      $.getJSON("https://bawurralibrary.appspot.com/servehistory").done(function(d){
        data.history = d;
        resolve();
      });
    }));
    proms.push(new Promise(function(resolve, reject){
      $.getJSON("https://bawurralibrary.appspot.com/servefuture").done(function(d){
        data.future = d;
        resolve();
      });
    }));
    // proms.push(new Promise(function(resolve, reject){
    //   $.getJSON("https://bawurralibrary.appspot.com/servenations").done(function(d){
    //     data.nations = d;
    //     resolve();
    //   });
    // }));
    proms.push(new Promise(function(resolve, reject){
      $.getJSON("http://bawurralibrary.appspot.com/servedreams").done(function(d){
        data.dreams = d;
        resolve();
      });
    }));
    proms.push(new Promise(function(resolve, reject){
      $.getJSON("http://bawurralibrary.appspot.com/servearts").done(function(d){
        data.arts = d;
        resolve();
      });
    }));
    proms.push(new Promise(function(resolve, reject){
      $.getJSON("http://bawurralibrary.appspot.com/servesocialemotional").done(function(d){
        data.socialemotional = d;
        resolve();
      });
    }));
    // proms.push(new Promise(function(resolve, reject){
    //   $.getJSON("http://bawurralibrary.appspot.com/servespoken").done(function(data){
    //     data.spoken = d;
    //     resolve();
    //   });
    // }));


  Promise.all(proms).then(function(){
    changeToDataURL(data);
  });
}

function changeToDataURL(data){
  console.log(data)
  var promises = [];
  for (var key in data){
    for (var j = 0; j < data[key].length; j++){
      promises.push(new Promise(function(resolve, reject){
        var t = key;
        var k = j;

        if (data[t][k].media_1 != 'No Image'){
          toDataURL(data[t][k].media_1, function(d){
              data[t][k].media_1 = d;
              resolve();
            });
        }
        else{
          resolve();
        }
      }));
      promises.push(new Promise(function(resolve, reject){
        var t = key;
        var k = j;
        if (data[t][k].media_2 != 'No Image'){
          toDataURL(data[t][k].media_2, function(d){
              data[t][k].media_2 = d;
              resolve();
            });
        }
        else{
          resolve();
        }
      }));
    }
  }
  Promise.all(promises).then(function() {
    var prom = new Promise(function(resolve, reject){
      resolve();
    });

    prom.then(function(){
      for (var key in data){
        for (var j = 0; j < data[key].length; j++){
          var x = key;
          var y = j;
          data[x][y] = JSON.stringify(data[x][y]);
        }
      }
    }).then(function(){
      entryToDatabase(data);
    }).then(function(){
      console.log(here);
      onDeviceReady();
    });
  });
}

function entryToDatabase(data){
console.log(data);
  var bawurradb = null;
  var backenddata = [];
  var st_data = null;
  console.log(JSON.stringify(data));
    if (device.platform == 'amazon-fireos' || device.platform == 'windows') {
      bawurradb = window.sqlitePlugin.openDatabase({
        name: 'bawurradb',
        location: 'default',
        androidDatabaseImplementation: 2
      });
    }
    else if (device.platform == 'ios') {
      bawurradb = window.sqlitePlugin.openDatabase({
        name: 'bawurradb.sqlite',
        iosDatabaseLocation: 'Library'
      });
    }
      bawurradb.transaction(function (tx){
      for (var key in data){
        var k = key;
        console.log(key);
        tx.executeSql('DROP TABLE IF EXISTS ' + key + ';', [], function(res) {
          console.log("DATABASE DROPPED");
        }, function(error) {
            console.log('SELECT SQL statement ERROR: ' + error.message);
        });

        tx.executeSql('CREATE TABLE IF NOT EXISTS ' + key + '(data);', [], function(res) {
          console.log("DATABASE CREATED");
        }, function(error) {
            console.log('SELECT SQL statement ERROR: ' + error.message);
        });

        for (var d = 0; d < data[k].length; d++){
          tx.executeSql('INSERT INTO '+ key + '(data) VALUES (?)', [data[k][d]], function(rs, dat) {
            console.log("INSERTED");
          }, function(error) {
              console.log('SELECT SQL statement ERROR: ' + error.message);
          });
        }

      }
    });
}

function toDataURL(url, callback){
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var reader = new FileReader();
    reader.onloadend = function() {
      callback(reader.result);
    }
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
}


  function offline(){
      onDeviceReady();
  }



function onDeviceReady() {

    $.getJSON("data/mainMenu.json", function(result) {
      mainMenu = result;
    }).done(parsePage);
  }




var parsePage = function() {

    var menuNumber = mainMenu.number;

    var itemList = [];

    for (var item in mainMenu.items) {
      itemList.push(item);
    }

    for (var item = 0; item < menuNumber; item++) {
      if (item % 2 == 0) {
        $("<div></div>").appendTo($(".menuContainer")).addClass("grid-x");
      }
      $("<a></a>").attr("href", itemList[item].replace(/\s/g, '') + "SubMenu.html", "class", "mainMenuItems").appendTo($(".menuContainer").children().last()).addClass("cell medium-6 large-6 small-6")
      .css({
        'color': '#4B0000',
        'font-size': '1.5em',
        'height': '7.4em',
        'font-weight': '400',
        'border': 'none'
      }).append("<style type=\"text/css\">" +
                                "@font-face {\n" +
                                    "\tfont-family: \"Raleway\";\n" +
                                    "\tsrc: local('☺'), url('../css/fonts/Raleway/Raleway-Regular.ttf');\n" +
                                "}\n" +
                                    "\t.mainMenuItems {\n" +
                                    "\tfont-family: Raleway !important;\n" +
                                "}\n" +
                            "</style>");;
      $("<center></center>").appendTo($(".menuContainer").children().last().children().last());
      $('<img />').attr({
        'src': mainMenu.items[itemList[item]].imgSrc,
        'alt': itemList[item] + "image logo",
      }).css({
        'width': '3em',
        'height': '3em',
        'margin-top': '2em'
      }).appendTo($(".menuContainer").children().last().children().last().find($("center")));
      $("<br/>").appendTo($(".menuContainer").children().last().children().last().find($("center")));
      $("<bold></bold>").text(itemList[item]).css('text-transform', 'capitalize').
      appendTo($(".menuContainer").children().last().children().last().find($("center")));
    }

    $(document).foundation();

  };
});
