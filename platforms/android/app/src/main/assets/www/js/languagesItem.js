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

  var data = JSON.parse(localStorage.getItem('data'));
  var mainMenu;
  var disclaimer;
  document.addEventListener("deviceready", buildPage, false);

  function buildPage(){
    $("<button></button>").attr({
      'type':"button",
      'class':"backButton"
    }).appendTo($(".top-bar-left"));
    $("<a></a>").attr({
      'href': "languagesSubMenu.html"
    }).html("&#8592;").appendTo($(".backButton"));
    console.log(data);

    $("<div></div>").appendTo($(".menuContainer")).addClass('title');
    $("<h1></h1>").text(data.title).css('text-transform', 'capitalize').appendTo($(".title"));

    for (var item = 0; item < 15; item++) {
      var body = "body_"+(item+1);
      console.log(body);
      if (item % 2 == 0) {
        $("<div></div>").appendTo($(".menuContainer")).addClass("grid-x");
      }
      $("<p></p>").text(data[body]).addClass("cell medium-6 large-6 small-6")
      .appendTo($(".menuContainer").children().last());
    }
  }

  $(document).foundation();

  });
