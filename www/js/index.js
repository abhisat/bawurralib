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
    var p1 = new Promise(function(resolve, reject){
      $.getJSON("http://bawurralibrary.appspot.com/serveculture").done(function(data){
        resolve(data);
    });
  });
  p1.then(function(data){
    changeToDataURL(data);
  });
  onDeviceReady();
}

function changeToDataURL(data){
  var promises = [];
  var k = [];
  for (var i = 0; i < data.length; i++){
    promises.push(new Promise(function(resolve, reject){
      var k = i;
      if (data[i].media_1 != 'No Image'){
        toDataURL(data[k].media_1, function(d){
            data[k].media_1 = d;
            resolve();
          });
      }
      else{
        resolve();
      }
    }));
    promises.push(new Promise(function(resolve, reject){
      var k = i;
      if (data[i].media_2 != 'No Image'){
        toDataURL(data[k].media_2, function(d){
            data[k].media_2 = d;
            resolve();
          });
      }
      else{
        resolve();
      }
    }));
    }

  Promise.all(promises).then(function() {
    var dataArray = [];
    new Promise(function(resolve, reject){
      for (var i = 0; i < data.length; i++){
        var x = i;
        dataArray.push(JSON.stringify(data[x]));
      }
      console.log("Here"+dataArray);
      resolve(dataArray);
    }).then(function(dataArray){
      entryToDatabase(dataArray);
    });
  });
}

function entryToDatabase(data){
  console.log(data);
  var bawurradb = null;
  var backenddata = null;
  var st_data = null;
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
        tx.executeSql('DROP TABLE IF EXISTS CULTURE;');
        tx.executeSql('CREATE TABLE IF NOT EXISTS CULTURE (data);', [], function(res) {
          console.log("DATABASE CREATED");
        }, function(error) {
            console.log('SELECT SQL statement ERROR: ' + error.message);
        });

        tx.executeSql('INSERT INTO CULTURE(data) VALUES (?)', [data], function(rs, dat) {
          console.log("INSERTED");
        }, function(error) {
            console.log('SELECT SQL statement ERROR: ' + error.message);
        });

        tx.executeSql('SELECT * FROM CULTURE;', [], function(tr, dt) {
          backenddata = dt.rows.item(0).data;
          console.log(backenddata);
          new Promise(function(resolve, reject){
            for(var i = 0; i < backenddata.length; i++){
              var a = i;
              console.log(backenddata[a])
              JSON.parse(backenddata[a])
            }
            resolve();
          }).then(function(){
            console.log(backenddata);
          });

        }, function(error) {
          console.log('SELECT SQL statement ERROR: ' + error.message);
        });
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
    document.addEventListener("deviceready", onDeviceReady, false);
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
      $("<a></a>").attr("href", itemList[item] + "SubMenu.html", "class", "mainMenuItems").appendTo($(".menuContainer").children().last()).addClass("cell medium-6 large-6 small-6")
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
