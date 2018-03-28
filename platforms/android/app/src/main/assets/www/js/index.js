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
  var testData;
  document.addEventListener("deviceready", onDeviceReady, false);
  function onDeviceReady() {
        if (device.platform=='amazon-fireos'){
          $.getJSON("file:///android_asset/www/data/mainMenu.json", function(result){
            mainMenu = result;
          }).done(parsePage);
        }
        else {
          $.getJSON("/data/mainMenu.json", function(result){
            mainMenu = result;
          }).done(parsePage);
        }
    }
  var parsePage = function(){

    var menuNumber = mainMenu.number;

    var itemList = [];

    for (var item in mainMenu.items){
      itemList.push(item);
    }

    for (var item = 0; item < menuNumber; item ++){
      if (item % 2 == 0){
        $("<div></div>").appendTo($(".menuContainer")).addClass("grid-x");
      }
      $("<a></a>").attr("href", "/"+itemList[item]+"SubMenu.html").appendTo($(".menuContainer").children().last()).addClass("cell medium-6 large-6 small-6");
      $("<center></center>").appendTo($(".menuContainer").children().last().children().last());
      $('<img />').attr({
            'src': mainMenu.items[itemList[item]].imgSrc,
            'alt': itemList[item] + "image logo",
        }).appendTo($(".menuContainer").children().last().children().last().find($("center")));
      console.log(mainMenu.items[itemList[item]]);
      $("<br/>").appendTo($(".menuContainer").children().last().children().last().find($("center")));
      $("<bold></bold>").text(itemList[item]).css('text-transform', 'capitalize').
      appendTo($(".menuContainer").children().last().children().last().find($("center")));
    }


  $(document).foundation();

  };
});
