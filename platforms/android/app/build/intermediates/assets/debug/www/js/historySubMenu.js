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
  var data = {};
  var key = 'history';
  document.addEventListener("deviceready", online, false);

  // function offline(){
  //   var key = 'CULTURE';
  //   var data = [];
  //   var bawurradb = null;
  //     if (device.platform == 'amazon-fireos' || device.platform == 'windows') {
  //       bawurradb = window.sqlitePlugin.openDatabase({
  //         name: 'bawurradb',
  //         location: 'default',
  //         androidDatabaseImplementation: 2
  //       });
  //     }
  //     else if (device.platform == 'ios') {
  //       bawurradb = window.sqlitePlugin.openDatabase({
  //         name: 'bawurradb.sqlite',
  //         iosDatabaseLocation: 'Library'
  //       });
  //     }
  //
  //     var promise = new Promise(function(resolve, reject){
  //     resolve()
  //   });
  //     promise.then(function(){
  //       data[key] = {};
  //     }).then(function(){
  //       bawurradb.transaction(function(tx){
  //           retrieve(tx, key, data).then(function(dat){
  //             for (var c = 0; c < dat.rows.length; c++){
  //               var num = c;
  //               var d = JSON.parse(dat.rows.item(num).data)
  //               console.log(d);
  //               data[key][d.title] = d;
  //             }
  //           }).then(function(){
  //             parsePage(data, key);
  //           });
  //       });
  //     }).then(function(){
  //       $.getJSON("data/disclaimer.json", function(result){
  //           disclaimer = result;
  //         })
  //         .done(parseDisclaimer);
  //     })
  // }
  //
  // function retrieve(tx, key, data){
  //   return new Promise(function(resolve, reject){
  //     tx.executeSql('SELECT * FROM '+ key + ';', [], function(tr, dt) {
  //       resolve(dt);
  //     }, function(error){
  //       console.log('SELECT SQL statement ERROR: ' + error.message);
  //       reject();
  //     });
  //   });
  // }

  function online(){
    var promise = new Promise(function(res, rej){
      $.getJSON("http://bawurralibrary.appspot.com/servehistory").done(function(d){
        data[key] = d;
        res();
      });
    });
    promise.then(parsePage)
    .then(function(){
      $.getJSON("data/disclaimer.json", function(result){
        disclaimer = result;
      }).done(parseDisclaimer);
    });

  }

    var parsePage = function(){
console.log(data);
      for (var t in data[key]){
        $("<div></div>").appendTo($(".menuContainer")).addClass("grid-x menuItem");
        $("<a></a>").attr({
          'class': "menuLink",
          'href': "historyItem.html",
          'id': JSON.stringify(data[key][t]),
        }).click(function(){
          localStorage.setItem('data', this.id)
        }).appendTo($(".menuContainer").children().last()).addClass("cell medium-12 large-12 small-12");
        $('<img />').attr({
              'src': data[key][t].media_1,
              'alt': data[key][t].title + "image logo",
          }).appendTo($(".menuContainer").children().last().children().last());
        $("<bold></bold>").text(data[key][t].title).css('text-transform', 'capitalize').
        appendTo($(".menuContainer").children().last().children().last());
      }
  }
  var parseDisclaimer = function(){
    $("<a></a>").attr({
      'href': "index.html"
    }).html("&#8592;").appendTo($(".backButton"));

    $("<div></div>").prependTo($(".menuContainer")).css('width', '100%').addClass("grid-x disclaimer");
    $("<h1>Section Disclaimer &raquo;</h1>").attr({
      'class': "button",
      'id': 'disclaimer',
      'data-dropdown': "drop"
    }).css('width', '100%').prependTo($(".menuContainer").on('click',
    function(){
      if($('.disclaimerDrop').css('display') == 'none'){
          $('.disclaimerDrop').show();
      }
      else {
        $('.disclaimerDrop').hide();
      }
    }).find($(".disclaimer")));
    $("<p></p>").addClass('disclaimerDrop').text(disclaimer.disclaimer).hide().appendTo($(".menuContainer").find($(".button")));

    }
  $(document).foundation();

  });
