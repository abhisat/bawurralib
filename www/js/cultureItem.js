$(document).ready(function(){
  var mainMenu;
  var temp_data;
  var disclaimer;
  document.addEventListener("deviceready", onDeviceReady, false);

  function onDeviceReady() {
    var bawurradb = null;
      if (device.platform == 'amazon-fireos' || device.platform == 'windows') {
        bawurradb = window.sqlitePlugin.openDatabase({
          name: 'bawurradb.sqlite',
          location: 'default',
          androidDatabaseImplementation: 2
        });
      }
      else if (device.platform == 'ios') {
        bawurradb = window.sqlitePlugin.openDatabase({
          name: 'bawurradb.sqlite',
          iosDatabaseLocation: 'Library'
        });
      }(parseDisclaimer);

      bawurradb.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS CULTURE (data)');

      });
      console.log(temp_data);
    }

    var parsePage = function(){
    $("<button></button>").attr({
      'type':"button",
      'class':"backButton"
    }).appendTo($(".top-bar-left"));
    $("<a></a>").attr({
      'href': "index.html"
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
            'src': mainMenu.items[itemList[item]].imgSrc,
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
