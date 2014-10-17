$.fn.serializeObject=function(){var e={},t=this.serializeArray();return console.log(t),$.each(t,function(){void 0!==e[this.name]?(e[this.name].push||(e[this.name]=[e[this.name]]),e[this.name].push(this.value||"")):e[this.name]=this.value||""}),e},$(function(){Parse.$=jQuery,Parse.initialize("D6P9U6ClTipkBAuQwolXlc4DiypwVjK9oq9x9pjh","3ck5fpFYusIvStUkucUV6H3ILcx6B1uU0E3FyXCG");var e=Parse.Object.extend("Poet",{initialize:function(){}}),t=Parse.Object.extend("Song",{initialize:function(){}}),n=Parse.Object.extend("Tag",{initialize:function(){}}),o=Parse.Collection.extend({model:t,comparator:function(e){return e.get("name")}}),i=Parse.Collection.extend({model:e,comparator:function(e){return e.get("name")}}),s=Parse.Collection.extend({model:n,comparator:function(e){return e.get("text")}}),r=Parse.View.extend({events:{"click .editPoet":"editPoet","click .showPoetSongs":"showSongs"},el:".content",initialize:function(){f.render()},showSongs:function(){console.log("show poet songs")},editPoet:function(){console.log("edit poet tapped")},render:function(e){var t=this,n=new i;n.fetch({success:function(e){t.$el.html(_.template($("#poets-list-template").html(),{poets:e.models}))},error:function(e,t){}})}}),a=Parse.View.extend({events:{"submit form.edit-poet":"create"},el:".content",create:function(t){t.preventDefault();var n=this.$("#poet-name").val(),o=this.$("#poet-biography").val(),i=this.$("#poet-id").val(),s=Parse.User.current().escape("username");console.log("id - "+i);var r=new e;r.save({id:i,name:n,biography:o,updatedBy:s},{success:function(e){b.navigate("#/poets",{trigger:!0})},error:function(e,t){console.log(t.message)}})},render:function(t){if(t.id){var n=this,o=new Parse.Query(e);o.get(t.id,{success:function(e){n.$el.html(_.template($("#edit-poet-template").html(),{poet:e}))},error:function(e,t){console.log(t.message)}})}else this.$el.html(_.template($("#edit-poet-template").html(),{poet:null}))}}),l=Parse.View.extend({events:{"click .deleteSong":"delete"},el:".content",initialize:function(){},"delete":function(e){var n=new t,o=Parse.$(e.currentTarget).data("song-id");console.log("song id = ",o),n.id=o,n.destroy({success:function(e){alert(e.get("name")+"נמחק בהצלחה"),$("#"+o).remove()},error:function(e,t){alert("מחקית"+e.get("name")+"נכשלה")}})},render:function(n){var o=this,i=new Parse.Query(t),s=new e;s.id=n.id,i.equalTo("poet",s);var r=i.collection();r.fetch({success:function(e){o.$el.html(_.template($("#songs-list-template").html(),{songs:e.models,poetId:n.id,poetName:n.name}))},error:function(e,t){}})}}),c=Parse.View.extend({events:{"submit form.edit-song":"create","click .showTags":"showTags"},el:".content",create:function(n){var o=this;n.preventDefault();var i=this.$("#song-name").val(),s=this.$("#song-text").val(),r=this.$("#song-book").val(),a=this.$("#song-date").val(),l=this.$("#song-year").val(),c=this.$("#song-dedication").val(),d=this.$("#song-note").val(),u=this.$("#song-id").val(),m=new e;m.id=this.poetId;var g=Parse.User.current().escape("username"),h=new t;h.save({id:u,name:i,text:s,book:r,date:a,year:l,note:d,dedication:c,poet:m},{success:function(e){b.navigate("songs/"+o.poetId+"/"+o.poetName,{trigger:!0})},error:function(e,t){console.log(t.message)}})},showTags:function(e){e.preventDefault(),new d},render:function(e){if(this.poetId=e.poetId,this.poetName=e.poetName,console.log("poet id = "+this.poetId),console.log("poet name = "+this.poenName),e.songId){var n=this,o=new Parse.Query(t);o.get(e.songId,{success:function(t){n.$el.html(_.template($("#edit-song-template").html(),{song:t,poetName:e.poetName,poetId:e.poetId}))},error:function(e,t){console.log(t.message)}})}else this.$el.html(_.template($("#edit-song-template").html(),{song:null,poetName:e.poetName,poetId:e.poetId}))}}),d=Parse.View.extend({events:{"submit form.add-new-tag":"create","submit form.edit-tags":"edit"},el:".tagging",initialize:function(){this.render()},render:function(){var e=this,t=new s;t.fetch({success:function(t){console.log(t),e.$el.html(_.template($("#tagging-template").html(),{tags:t.models}))},error:function(e,t){}})},create:function(){event.preventDefault();var e=this,t=this.$("#tag-text").val(),o=Parse.User.current().escape("username"),i=new n;i.save({text:t,updatedBy:o},{success:function(t){e.render()},error:function(e,t){console.log(t.message)}})},edit:function(e){e.preventDefault();var o=Parse.$("input[name=tag-checkbox]:checked").map(function(e){console.log("checkValues"+$(this).parent().text())}).get();return;var i=new t;i.id="";var s=i.relation("tags"),r=new n;r.id="",r.text="",s.add(r),i.save({updatedBy:updater},{success:function(e){self.render()},error:function(e,t){console.log(t.message)}})}}),u=Parse.View.extend({el:".content",initialize:function(){this.render()},render:function(){this.$el.html(_.template($("#home-page-template").html()))}}),m=Parse.View.extend({events:{"submit form.login-form":"logIn"},el:".content",initialize:function(){_.bindAll(this,"logIn"),this.render()},logIn:function(e){var t=this,n=this.$("#login-username").val(),o=this.$("#login-password").val();return Parse.User.logIn(n,o,{success:function(e){new u,f.render(),delete t},error:function(e,n){t.$(".login-form .error").html("Invalid username or password. Please try again.").show(),t.$(".login-form button").removeAttr("disabled")}}),!1},render:function(){this.$el.html(_.template($("#login-template").html()))}}),g=Parse.View.extend({initialize:function(){this.render()},events:{"click .log-out":"logOut"},el:".header-view",logOut:function(e){Parse.User.logOut(),new m,delete this},render:function(){this.$el.html(_.template($("#header-template").html()))}}),h=Parse.View.extend({el:$("#shiaraApp"),render:function(){Parse.User.current()?(f.render(),new u):new m}}),p=Parse.Router.extend({routes:{"":"home",poets:"poets","new":"editPoet","edit/:id":"editPoet","songs/:id/:name":"showSongs",":poetId/:poetName/song/new":"editSong",":poetId/:poetName/song/:songId/edit":"editSong"}}),f=new g,v=new h,w=new r,P=new a,x=new l,I=new c,b=new p;b.on("route:home",function(){v.render()}),b.on("route:poets",function(e){w.render()}),b.on("route:editPoet",function(e){P.render({id:e})}),b.on("route:showSongs",function(e,t){x.render({id:e,name:t})}),b.on("route:editSong",function(e,t,n){I.render({poetId:e,poetName:t,songId:n})}),Parse.history.start()});