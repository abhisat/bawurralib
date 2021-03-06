﻿/*
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
  document.addEventListener("deviceready", onDeviceReady, false);

  function onDeviceReady() {
      var bawurradb = null;
      var backenddata = null;
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
      bawurradb.transaction(function(tx){
        tx.executeSql('SELECT * FROM CULTURE;', [], function(tr, dt) {
          backenddata = dt.rows.item(0).data;
          parsePage(backenddata)

        }, function(error) {
          console.log('SELECT SQL statement ERROR: ' + error.message);
        })
      });

        $.getJSON("data/disclaimer.json", function(result){
            disclaimer = result;
          })
          .done(parseDisclaimer);
    }

    var parsePage = function(data){
      data_parsed = JSON.parse(data);

    $("<button></button>").attr({
      'type':"button",
      'class':"backButton"
    }).appendTo($(".top-bar-left"));

    $("<a></a>").attr({
      'href': "index.html"
    }).html("&#8592;").appendTo($(".backButton"));


    for (var item = 0; item < data_parsed.length; item ++){

      $("<div></div>").appendTo($(".menuContainer")).addClass("grid-x");
      $("<a></a>").attr('href', "#").appendTo($(".menuContainer").children().last()).addClass("cell medium-12 large-12 small-12");
      $('<img />').attr({
            'src': data_parsed[item].media_1,
            'alt': data_parsed[item].title + "image logo",
        }).appendTo($(".menuContainer").children().last().children().last());
      $("<bold></bold>").text(data_parsed[item].title).css('text-transform', 'capitalize').
      appendTo($(".menuContainer").children().last().children().last());
    }
  }

  var parseDisclaimer = function(){
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
