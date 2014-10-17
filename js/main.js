// An example Parse.js Backbone application based on the todo app by
// [Jérôme Gravel-Niquet](http://jgn.me/). This demo uses Parse to persist
// the todo items and provide user authentication and sessions.
// python -m SimpleHTTPServer 8000


$.fn.serializeObject = function()
    {
        var o = {};
        var a = this.serializeArray();
        console.log(a);
                $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

function stripVowels(rawString)
{
  var newString = '';
  for(j=0; j<rawString.length; j++) {
    if(rawString.charCodeAt(j)<1425
       || rawString.charCodeAt(j)>1479)
    { newString = newString + rawString.charAt(j); }
  }
  return(newString);
}

function validateImage(file,validWidth,validHheight,maxSize)
{
  var reader = new FileReader();
        var image  = new Image();
      
        reader.readAsDataURL(file);  
        reader.onload = function(_file) {
            image.src    = _file.target.result;
            image.onload = function() {
                var n = file.name;
                if (this.width != validWidth && this.height != validHheight) { alert("על התומנה להיות בגודל 140 על 140")}
                else if(file.type != "image/png" && file.type != "image/jpeg" ) { alert("על התמונה להיות מסוג png או jpg בלבד")}
                else if(~~(file.size/1024) > maxSize) { alert("גודל קובץ התמונה צריך להיות נמוך או שווה ל " + maxSize +'KB')}
                else {$('#update-poet-image-botton').removeAttr('disabled')}; 
            };
            image.onerror= function() {
                alert('Invalid file type: '+ file.type);
            };      
        };
}




$(function() {


  Parse.$ = jQuery;



  // Initialize Parse with your Parse application javascript keys
   Parse.initialize("D6P9U6ClTipkBAuQwolXlc4DiypwVjK9oq9x9pjh", "3ck5fpFYusIvStUkucUV6H3ILcx6B1uU0E3FyXCG");


  // Models
  // ----------

 var Poet = Parse.Object.extend("Poet", {

    initialize: function() {
      // if (!this.get("content")) {
      //   this.set({"content": this.defaults.content});
      // }
    },
   
  });

  var Song = Parse.Object.extend("Song", {

    initialize: function() {
      // if (!this.get("content")) {
      //   this.set({"content": this.defaults.content});
      // }
    },
   
  });

  var Tag = Parse.Object.extend("Tag", {

    initialize: function() {
      // if (!this.get("content")) {
      //   this.set({"content": this.defaults.content});
      // }
    },
   
  });

  var HomePage = Parse.Object.extend("HomePage", {

    initialize: function() {
      // if (!this.get("content")) {
      //   this.set({"content": this.defaults.content});
      // }
    },
   
  });

  var Banner = Parse.Object.extend("Banner", {

    initialize: function() {
      // if (!this.get("content")) {
      //   this.set({"content": this.defaults.content});
      // }
    },
   
  });

  
 



  //  Collections
  // ---------------

  var SongsCollection = Parse.Collection.extend({

    // Reference to this collection's model.
    model: Song,

    comparator: function(song) {
      return song.get('name');
    }

  });


   var PoetsCollection = Parse.Collection.extend({

    // Reference to this collection's model.
    model: Poet,

    // Todos are sorted by their original insertion order.
    comparator: function(poet) {
      return poet.get('name');
    }
  });

   var TagsCollection = Parse.Collection.extend({

    // Reference to this collection's model.
    model: Tag,

    // Todos are sorted by their original insertion order.
    comparator: function(tag) {
      return tag.get('text');
    }
  });

   var SongTagsCollection = Parse.Collection.extend({
       model: Tag,
       query: function(song) {
          var relation = model.relation("songs");
          var query = relation.query;
          query.equalTo("song", song);
          return query; 
       }
    });



//Views

  // Poet List View
  // --------------
  var PoetsListView = Parse.View.extend({

  events: {
      "click .editPoet": "editPoet",
      "click .showPoetSongs": "showSongs",
      "keyup .filter" : "filter"
    },


    el: ".content",

     initialize: function() {
        headerView.render();
    },

    filter: function(event)
    {
      console.log("filter poets");
            var rex = new RegExp($(event.currentTarget).val(), 'i');
            $('.searchable tr').hide();
            $('.searchable tr').filter(function () {
                return rex.test($(this).text());
            }).show();
    },

    showSongs: function()
    {
      console.log("show poet songs");
    },

     editPoet: function()
    {
      console.log("edit poet tapped");
    },

    render: function(poets) {

      var self = this;
      var collection = new PoetsCollection();
          collection.fetch({
            success: function(poets) {
                 self.$el.html(_.template($("#poets-list-template").html(), {poets:poets.models}));
            },
            error: function(collection, error) {

            }
          });
    }
  });
  // ---------------



  var EditPoetView = Parse.View.extend({

  events: {
      "submit form.edit-poet": "create",
      "click .delete-poet" : "delete",
      "click .update-image-btn" : "updateImage",
      "change #poet-image-file" : "validatePoetImage"
    },

    el: ".content",
    initialize: function() {
       var currentPoetId = null;
    },
    create: function(event)
    {
      event.preventDefault();

      var poetName = this.$("#poet-name").val();
      var poetBiography = this.$("#poet-biography").val();
      var poetId = this.$("#poet-id").val();
      var updater = Parse.User.current().escape("username");
      console.log("id - " + poetId);
      var poet = new Poet();
         
      poet.save({id:poetId, name:poetName, biography:poetBiography, updatedBy:updater}, {
      success: function(object) {
            appRouter.navigate('#/poets', {trigger:true});
      },
      error: function(model, error) {
            console.log(error.message);
      }
     });
    },

    delete: function(event) {
      console.log("jhgjhgjhg");
      var poet = new Poet();
      poet.id = currentPoetId;

      poet.destroy({
        success: function(deletedPoet) {
          appRouter.navigate('#/poets', {trigger:true});
          alert(deletedPoet.get('name') + 'נמחק בהצלחה');
        },
        error: function(song, error) {
             alert('מחקית' + deletedPoet.get('name') + 'נכשלה');
        }
      });
    },

    validatePoetImage: function(event) {
      $('#update-poet-image-botton').attr('disabled','disabled');
      var file = $("#poet-image-file").prop('files')[0];
      validateImage(file,140,140,500);
    },
    updateImage: function(event) {
      $('#update-poet-image-botton').attr('disabled','disabled');

       event.preventDefault();
       var file = $("#poet-image-file").prop('files')[0];

      if (file) {
        var name = "photo.png";
        var parseFile = new Parse.File(name, file);
        parseFile.save().then(function(parseFile) 
        {
            var poet = new Poet();
            poet.id = currentPoetId;
            poet.set("image", parseFile);
            poet.save();
            $('#poet-image').attr('src', parseFile.url());
            alert("התמונה עודכנה בהצלחה");
          }, 
          function(error) {
            alert("Error: " + error.code + " " + error.message);
          });
      }
      else
      {
        alert("יש לבחור תמונה");
      }
    },

    render: function(options) {
      if (options.id) {

        var self = this;
        var query = new Parse.Query(Poet);

        query.get(options.id,{
          success: function(poet){
              self.$el.html(_.template($("#edit-poet-template").html(), {poet:poet}));
             var poetImage = poet.get("image");
             currentPoetId = poet.id;
             if (poetImage) 
             {
              $('#poet-image').attr('src', poetImage.url());
            }

          },
          error: function(object, error) {
            console.log(error.message);
          }
        });

      }else{
          this.$el.html(_.template($("#edit-poet-template").html(), {poet:null}));
      };
    }
  });
  // ---------------







  // Song List View
  // --------------
  var SongsListView = Parse.View.extend({
   events: {
      "click .deleteSong" : "delete",
      "keyup .filter" : "filter"
    },
    el: ".content",

     initialize: function() {
      
    },

    delete: function(event) {
      var song = new Song();
      var songId = Parse.$(event.currentTarget).data('song-id');
      console.log('song id = ',songId);

      song.id = songId;

      song.destroy({
        success: function(deletedSong) {
          alert(deletedSong.get('name') + 'נמחק בהצלחה');
          $('#'+songId).remove();
        },
        error: function(song, error) {
             alert('מחקית' + song.get('name') + 'נכשלה');
        }
      });
    },

    filter: function(event)
    {
      console.log("filter songs");
            var rex = new RegExp($(event.currentTarget).val(), 'i');
            $('.searchable tr').hide();
            $('.searchable tr').filter(function () {
                return rex.test($(this).text());
            }).show();
    },

    render: function(options) {
     var self = this;
    var query = new Parse.Query(Song);
    var poet = new Poet();
    poet.id = options.id;
    query.equalTo("poet", poet);
    var collection = query.collection();
          collection.fetch({
            success: function(songs) {
                 self.$el.html(_.template($("#songs-list-template").html(), {songs:songs.models, poetId:options.id, poetName:options.name}));
            },
            error: function(collection, error) {
              // The collection could not be retrieved.
            }
          });
    }
  });
  // ---------------





  var EditSongView = Parse.View.extend({

    initialize: function()
    {
        var songTags = null; 
        var allTags = null;
        var poetId = null;
        var poetName = null;
        var songId = null;
        var currentSong = null;
    },

    events: {
      "submit form.edit-song": "create",
      "click .showTags" : "showTags",
      "click .publish" : "publish"
    },

    el: ".content",

    create: function(event)
    {
      var self = this;
      event.preventDefault();
   
      var songNmae = this.$("#song-name").val();
      var songBody = this.$("#song-text").val();
      var songBook = this.$("#song-book").val();
      var songDate = this.$("#song-date").val();
      var songYear = this.$("#song-year").val();
      var songDedication = this.$("#song-dedication").val();
      var songNote = this.$("#song-note").val();
      var songId = this.$("#song-id").val();

      var poet = new Poet();
      poet.id = poetId;


      var selectedTags = $("#song-tags-select").select2("data");

      var tagsToSave =[];
       for (var i = selectedTags.length - 1; i >= 0; i--) {
         var tag = new Tag();
         tag.set("text", selectedTags[i].text);
         tag.id = selectedTags[i].id;
         tagsToSave.push(tag);
       };
   

      var updater = Parse.User.current().escape("username");
      var song = new Song();

      song.save({id:songId, name:songNmae, updatedBy:updater, text:songBody, book:songBook, date:songDate, year:songYear, note:songNote, dedication:songDedication, poet:poet, poetName:poetName, tags:tagsToSave}, {
      success: function(object) {
            appRouter.navigate('songs/' + poetId  + '/' + poetName, {trigger:true});
      },
      error: function(model, error) {
            console.log(error.message);
      }
     });

    },

    showTags: function(event){
        event.preventDefault();
        new TaggingView();
    },

    publish: function(event){
         if (currentSong.get("public")) {
            var name = currentSong.get("name");
            var body = currentSong.get("text");
            if (name.length == 0 && body.length == 0) {
               alert("לא ניתן לפרסם את השיר ללא שם וטקסט");
               return;
            };

            currentSong.set("public", false);
            console.log("unpublic song");
         } else {
            currentSong.set("public", true);
            console.log("make song public");
         };
         currentSong.save();
    },

    render: function(options) {

      songId = options.songId;
      poetId = options.poetId;
      poetName = decodeURIComponent(options.poetName);
      console.log('id = ' + songId, poetId);
      if (options.songId) {
        var self = this;
        var query = new Parse.Query(Song);
        query.include("tags");
        query.get(options.songId,{
          success: function(song){
              currentSong = song;
              var tags  =  song.get("tags");
              var currentTags = [];
              for (var i = tags.length - 1; i >= 0; i--) 
              {
                var tag = tags[i];
                var currentTagDic = {"id":tag.id,"text":tag.get("text")};
                currentTags.push(currentTagDic);
              };
              var collection = new TagsCollection();
              collection.fetch({
                  success: function(tags) {
                        self.$el.html(_.template($("#edit-song-template").html(), {song:song, poetName:options.poetName, poetId:options.poetId, tags:tags.models}));
                         $("#song-tags-select").select2({
                            width:600
                         });
                         $("#song-tags-select").select2("data", currentTags);
                  },
                  error: function(collection, error) {
                      console.log(error.message);
                  }
                });

          },
          error: function(object, error) {
            console.log(error.message);
          }
        });

      }else{
        var self = this;
         songTags = null;
         var collection = new TagsCollection();
              collection.fetch({
                  success: function(tags) {
                         self.$el.html(_.template($("#edit-song-template").html(), {song:null,  poetName:options.poetName,  poetId:options.poetId, tags:tags.models}));
                         $("#song-tags-select").select2({
                            width:600
                         });
                  },
                  error: function(collection, error) {
                      console.log(error.message);
                  }
                });
      };
    }
  });
  // ---------------


   var TaggingView = Parse.View.extend({

     events: {
       "submit form.add-new-tag": "create",
      },

     el: ".tagging",

      initialize: function(options) {
       
        this.render();
      },

      render: function() {   
         this.$el.html(_.template($("#tagging-template").html()));
      },

      create: function(){
        event.preventDefault();
        var self = this;

        var tagText = this.$("#tag-text").val();
        var updater = Parse.User.current().escape("username");
        var tag = new Tag();
           
        tag.save({text:tagText, updatedBy:updater}, {
        success: function(object) {
               alert("התג נוסף בהצלחה");
        },
        error: function(model, error) {
              console.log(error.message);
        }
      });
     }

  });




  var HomePageView = Parse.View.extend({

    events: {
      "click .update-daily-song-btn" : "updateDailySong",
      "click .update-shabat-song-btn" : "updateShabatSong",
    },

        el: ".content",

      initialize: function() {
        this.render();
        var dailySongSelect = null;
        var shabatSongSelect = null;
        var currentHomePage = null;
      },
      render: function() {
        var self = this;
        var query = new Parse.Query(HomePage);
        query.include("banners");

        query.get("Ae14lgSKLk" ,{
          success: function(homePage){
              currentHomePage = homePage;
              var dailySong = homePage.get("dailySong");
              console.log(dailySong);

              var banners = homePage.get("banners");
              console.log(banners);
              //get all songs
              var query = new Parse.Query(Song);
              query.find({
                 success: function(songs) {
                  console.log("songs = " + songs);
                     self.$el.html(_.template($("#home-page-template").html(), {homePage:homePage, songs:songs, banners:banners}));

                     dailySongSelect = $("#daily-song").select2({
                        width:400
                     });

                     shabatSongSelect = $("#shabat-song").select2({
                        width:400
                     });

                  },
                  error: function(user, error) {
                 
                  }
              })
          },
          error: function(object, error) {
            console.log(error.message);
          }
        });
      },
      updateDailySong: function(){
        console.log("day = " + dailySongSelect.select2("val"));
        var song = new Song();
        song.id = dailySongSelect.select2("val");
        currentHomePage.set("dailySong", song);
        currentHomePage.save();
      },
      updateShabatSong: function(){
        console.log("shabat = " + shabatSongSelect.select2("val"));
        var song = new Song();
        song.id = shabatSongSelect.select2("val");
        currentHomePage.set("shabatSong", song);
        currentHomePage.save();
      },
  });



 var EditBannerView = Parse.View.extend({

  events: {
      "submit form.edit-banner": "create",
      "click .delete-banner" : "delete",
      "click .update-image-btn" : "updateImage",
      "change #banner-image-file" : "validateBannerImage"
    },

    el: ".content",
    initialize: function() {
       var currentBannerId = null;
    },
    create: function(event)
    {
      event.preventDefault();

      var targetObjectName = this.$("#banner-target-name").val();
      var targetObjectId = this.$("#banner-target-id").val();
      var targetObjectType =  this.$("select#banner-type").val();
      console.log("targetObjectType = " + this.$("select#banner-type").val());
      var bannerId = this.$("#banner-id").val();
      var updater = Parse.User.current().escape("username");
      console.log("id - " + bannerId);
      var banner = new Banner();
         
      banner.save({id:bannerId, updatedBy:updater, targetObjectName:targetObjectName, targetObjectId:targetObjectId, targetObjectType:targetObjectType}, {
      success: function(object) {
            appRouter.navigate('#/', {trigger:true});
      },
      error: function(model, error) {
            console.log(error.message);
      }
     });
    },

    delete: function(event) {
      var banner = new Banner();
      banner.id = currentBannerId;

      banner.destroy({
        success: function(deletedBanner) {
          appRouter.navigate('#/', {trigger:true});
          alert('נמחק בהצלחה');
        },
        error: function(song, error) {
             alert('מחקית נכשלה');
        }
      });
    },

    validateBannerImage: function(event) {
      $('#update-banner-image-botton').attr('disabled','disabled');
      var file = $("#banner-image-file").prop('files')[0];
      validateImage(file,140,140,500);
    },
    updateImage: function(event) {
      $('#update-banner-image-botton').attr('disabled','disabled');

       event.preventDefault();
       var file = $("#banner-image-file").prop('files')[0];

      if (file) {
        var name = "photo.png";
        var parseFile = new Parse.File(name, file);
        parseFile.save().then(function(parseFile) 
        {
            var banner = new Banner();
            banner.id = currentPoetId;
            banner.set("image", parseFile);
            banner.save();
            $('#banner-image').attr('src', parseFile.url());
            alert("התמונה עודכנה בהצלחה");
          }, 
          function(error) {
            alert("Error: " + error.code + " " + error.message);
          });
      }
      else
      {
        alert("יש לבחור תמונה");
      }
    },

    render: function(options) {
      if (options.id) {

        var self = this;
        var query = new Parse.Query(Banner);

        query.get(options.id,{
          success: function(banner){
              self.$el.html(_.template($("#edit-banner-template").html(), {banner:banner}));
             var bannerImage = banner.get("image");
             currentBannerId = banner.id;
             if (bannerImage) 
             {
              $('#banner-image').attr('src', bannerImage.url());
            }
            $("#banner-type").select2({
                        width:400
            });

          },
          error: function(object, error) {
            console.log(error.message);
          }
        });

      }else{
          this.$el.html(_.template($("#edit-banner-template").html(), {banner:null}));
      };
    }
  });


  // The main view that lets a user manage their todo items
  
//python -m SimpleHTTPServer 8000
  var LogInView = Parse.View.extend({
    events: {
      "submit form.login-form": "logIn",
    },

    el: ".content",
    
    initialize: function() {
      _.bindAll(this, "logIn");
      this.render();
    },

    logIn: function(e) {
      var self = this;
      var username = this.$("#login-username").val();
      var password = this.$("#login-password").val();
      
      Parse.User.logIn(username, password, {
        success: function(user) {
          new HomePageView ();
          headerView.render();
          delete self;
        },

        error: function(user, error) {
          self.$(".login-form .error").html("Invalid username or password. Please try again.").show();
          self.$(".login-form button").removeAttr("disabled");
        }
      });

  
      return false;
    },

    render: function() {
      this.$el.html(_.template($("#login-template").html()));
    }
  });




  var HeaderView = Parse.View.extend({

    initialize: function() {
      this.render();
    },
    events: {
      "click .log-out": "logOut",
    },
    el: ".header-view",

    logOut: function(e) {
      Parse.User.logOut();
      new LogInView();
      delete this;
    },

     render: function() {
      this.$el.html(_.template($("#header-template").html()));
    }
        
  });
  // The main view for the app
  var AppView = Parse.View.extend({

    el: $("#shiaraApp"),

    // initialize: function() {
    //   this.render();
    // },

    render: function() {
      if (Parse.User.current()) {
        headerView.render();
        new HomePageView();
      } else {
        new LogInView();
      }
    }
  });

  var AppRouter = Parse.Router.extend({
    routes: {
      "": "home",
      "editbanner/:id": "editBanner",
      "newbanner": "editBanner",
      "poets": "poets",
      "new": "editPoet",
      "edit/:id": "editPoet",
      "songs/:id/:name" : "showSongs",
      ":poetId/:poetName/song/new" : "editSong",
      ":poetId/:poetName/song/:songId/edit" : "editSong"
    }
  });

  var headerView = new HeaderView;
  var newAppView = new AppView;
  var poetsListView = new PoetsListView;
  var editPoetView = new EditPoetView;
  var songsListView = new SongsListView;
  var editSongView = new EditSongView;
  var editBannerTemplate = new EditBannerView;
  var appRouter = new AppRouter;

  appRouter.on('route:home', function(){
    newAppView.render();
  });

  appRouter.on('route:editBanner', function(id){
    editBannerTemplate.render({id:id});
  });

  appRouter.on('route:poets', function(){
     poetsListView.render();
  });

  appRouter.on('route:editPoet', function(id){
     editPoetView.render({id:id});
  });

  appRouter.on('route:showSongs', function(id, name){
     songsListView.render({id:id, name:name});
  });

  appRouter.on('route:editSong', function(poetId,poetName,songId){
     editSongView.render({poetId:poetId, poetName:poetName, songId:songId});
  });


  Parse.history.start();
});

