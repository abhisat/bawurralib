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
$(document).ready(function(){
  var mainMenu;
  var disclaimer;
  document.addEventListener("deviceready", offline, false);

  function offline(){
    var key = 'CULTURE';
    var data = [];
    var bawurradb = null;
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

      var promise = new Promise(function(resolve, reject){
      resolve()
    });
      promise.then(function(){
        data[key] = {};
      }).then(function(){
        bawurradb.transaction(function(tx){
            retrieve(tx, key, data).then(function(){
              parsePage(data, key);
            });
        });
      }).then(function(){
        $.getJSON("data/disclaimer.json", function(result){
            disclaimer = result;
          })
          .done(parseDisclaimer);
      })
  }

  function retrieve(tx, key, data){
    return new Promise(function(resolve, reject){
    tx.executeSql('SELECT * FROM '+ key + ';', [], function(tr, dt) {
      for (var c = 0; c < dt.rows.length; c++){
        var num = c;
        var d = JSON.parse(dt.rows.item(num).data)
        data[key][d.title] = d;
      }
      resolve();
    }, function(error){
      console.log('SELECT SQL statement ERROR: ' + error.message);
      reject();
    });
  });

  }

    var parsePage = function(data, key){

      for (var t in data[key]){
        console.log(data[key][t]);
        $("<div></div>").appendTo($(".menuContainer")).addClass("grid-x");
        $("<a></a>").attr('href', "#").appendTo($(".menuContainer").children().last()).addClass("cell medium-12 large-12 small-12");
        $('<img />').attr({
              'src': data[key][t].media_1,
              'alt': data[key][t].title + "image logo",
          }).appendTo($(".menuContainer").children().last().children().last());
        $("<bold></bold>").text(data[key][t].title).css('text-transform', 'capitalize').
        appendTo($(".menuContainer").children().last().children().last());
      }
  }

  var parseDisclaimer = function(){

    $("<button></button>").attr({
      'type':"button",
      'class':"backButton"
    }).appendTo($(".top-bar-left"));

    $("<a></a>").attr({
      'href': "index.html"
    }).html("&#8592;").appendTo($(".backButton"));
    
    $("<div></div>").prependTo($(".menuContainer")).addClass("grid-x disclaimer");
    $("<a>Section Disclaimer &raquo;</a>").attr({
      'href': "#",
      'class': "button",
      'data-dropdown': "drop"
    }).prependTo($(".menuContainer").find($(".disclaimer")));
    $("<p></p>").text(disclaimer.disclaimer).appendTo($(".menuContainer").find($(".button")));
    }


  $(document).foundation();

  });
