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
  console.log("here");
  var mainMenu;
  var disclaimer;
  var route;
  document.addEventListener("deviceready", onDeviceReady, false);
  function onDeviceReady() {

        if (device.platform=='amazon-fireos'){
          route = "file:///android_asset/www";
        }
        else{
          route = '';
        }
        $.getJSON(route+"/data/cultureSubMenu.json", function(result){
          mainMenu = result;
        }).done(parsePage);

        $.getJSON(route+"/data/disclaimer.json", function(result){
            disclaimer = result;
          })
          .done(parseDisclaimer);
    }

    var parsePage = function(){
    $("<button></button>").attr({
      'type':"button",
      'class':"backButton"
    }).appendTo($(".top-bar-left"));
    $("<a></a>").attr({
      'href': route+"/index.html"
    }).html("&#8592;").appendTo($(".backButton"))

    var menuNumber = mainMenu.number;

    var itemList = [];

    for (var item in mainMenu.items){
      itemList.push(item);
    }

    for (var item = 0; item < menuNumber; item ++){
      $("<div></div>").appendTo($(".menuContainer")).addClass("grid-x");
      $("<a></a>").attr('href', "#").appendTo($(".menuContainer").children().last()).addClass("cell medium-12 large-12 small-12");
      $('<img />').attr({
            'src': route+mainMenu.items[itemList[item]].imgSrc,
            'alt': itemList[item] + "image logo",
        }).appendTo($(".menuContainer").children().last().children().last());
      $("<bold></bold>").text(itemList[item]).css('text-transform', 'capitalize').
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