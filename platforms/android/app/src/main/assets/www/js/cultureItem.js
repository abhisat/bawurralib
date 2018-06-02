$(document).ready(function(){
  var mainMenu;
  var temp_data;
  var disclaimer;
  document.addEventListener("deviceready", offline, false);

  function offline(){
    var key = 'CULTURE';
    var data = {};
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
        data[key] = [];
      }).then(function(){
          bawurradb.transaction(function(tx){
              retrieve(tx, key, data);
          });
          console.log("here");

      }).then(function(){
        console.log(data);
      }).then(function(){
        console.log(localStorage.getItem("data"));
      });
  }

  function retrieve(tx, key, data){
  tx.executeSql('SELECT * FROM '+ key + ';', [], function(tr, dt) {
    for (var c = 0; c < dt.rows.length; c++){
      var num = c;
      data[key].push(JSON.parse(dt.rows.item(num).data));
    }
  }, function(error){
    console.log('SELECT SQL statement ERROR: ' + error.message);
  });
  }


  //   var parsePage = function(){
  //   $("<button></button>").attr({
  //     'type':"button",
  //     'class':"backButton"
  //   }).appendTo($(".top-bar-left"));
  //   $("<a></a>").attr({
  //     'href': "index.html"
  //   }).html("&#8592;").appendTo($(".backButton"))
  //
  //   var menuNumber = mainMenu.number;
  //
  //   var itemList = [];
  //
  //   for (var item in mainMenu.items){
  //     itemList.push(item);
  //   }
  //
  //   for (var item = 0; item < menuNumber; item ++){
  //     $("<div></div>").appendTo($(".menuContainer")).addClass("grid-x");
  //     $("<a></a>").attr('href', "#").appendTo($(".menuContainer").children().last()).addClass("cell medium-12 large-12 small-12");
  //     $('<img />').attr({
  //           'src': mainMenu.items[itemList[item]].imgSrc,
  //           'alt': itemList[item] + "image logo",
  //       }).appendTo($(".menuContainer").children().last().children().last());
  //     $("<bold></bold>").text(itemList[item]).css('text-transform', 'capitalize').
  //     appendTo($(".menuContainer").children().last().children().last());
  //   }
  // }
  //
  // var parseDisclaimer = function(){
  //   $("<div></div>").prependTo($(".menuContainer")).addClass("grid-x disclaimer");
  //   $("<a>Section Disclaimer &raquo;</a>").attr({
  //     'href': "#",
  //     'class': "button",
  //     'data-dropdown': "drop"
  //   }).prependTo($(".menuContainer").find($(".disclaimer")));
  //   $("<p></p>").text(disclaimer.disclaimer).appendTo($(".menuContainer").find($(".button")));
  //   }


  $(document).foundation();

  });
