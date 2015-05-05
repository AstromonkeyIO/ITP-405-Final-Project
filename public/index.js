    if(user.username == "david" && user.password == "laravel")
    {
        document.getElementById("admin-access").style.visibility = "visible";
    }
    else
    {
        document.getElementById("admin-access").style.visibility = "hidden";    
    }

    setTimeout(function()
    { 
        $('#report-button').html("Searching for your location...").hide().fadeIn(300);
    },2000); 
  function codeLatLng(lat, lng) {
    var geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
      console.log(results)
        if (results[1]) {
         //formatted address
         //alert(results[0].formatted_address)
        //find country name
             for (var i=0; i<results[0].address_components.length; i++) {
            for (var b=0;b<results[0].address_components[i].types.length;b++) {

            //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
                if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                    //this is the object you are looking for
                    city= results[0].address_components[i];
                    break;
                }
            }
        }
            //city data
            console.log(city);
            console.log(results[0].formatted_address);
            $('#location').val(results[0].formatted_address);
            //alert(results[0].formatted_address);
        } else {
          //alert("No results found");
        }
      } else {
        //alert("Geocoder failed due to: " + status);
      }
    });
  }

function postGig()
{
    
    window.scrollTo(0,0);
    document.getElementById('light').style.display='block';
    document.getElementById('fade').style.display='block';     
    
}

function lightbox_close()
{

    document.getElementById('light').style.display='none';
    document.getElementById('fade').style.display='none';
    
}

function showCommentPopup(virus_id)
{

    $('#comment-virus-id').val(virus_id);
    var url = "/globe/api/get_comments?virus_id=" + virus_id;
    $.getJSON(url, function(comments) {
        
        var list = '';
        comments.reverse();
        for(var i = 0; i < comments.length; i++)
        {
            list += '<li id="comment-container"><label style="color:steelblue;">' + comments[i].user.username + '<label>: "' + comments[i].comment + '"</li>';
        }
        
        $('#comments-list').html(list).hide().fadeIn(300);
    });


    window.scrollTo(0,0);
    document.getElementById('comment-popup-show').style.display='block';
    document.getElementById('comment-popup-fade').style.display='block';
            

 
}

function fadeCommentPopup()
{

    $('#comments-list').html('');
    document.getElementById('comment-popup-show').style.display='none';
    document.getElementById('comment-popup-fade').style.display='none';
    
}



    var latitude;
    var longitude;
	// check whether browser supports geolocation api
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(positionSuccess, positionError, { enableHighAccuracy: true });
	} else {
		//$(".map").text("Your browser is out of fashion, there\'s no geolocation!");
	}

	function positionSuccess(position) {
                //alert("position sucess!");
                $('#report-button').html("Your current location found!").hide().fadeIn(300);
                $("#report-button").css("background-color", "#90EE90");

                setTimeout(function()
                { $('#report-button').html("Report Virus!").hide().fadeIn(300);
                  $("#report-button").css("background-color","#EE3B3B");
                  $('#report-button').prop('disabled', false);

                },2000);                

		latitude = position.coords.latitude;
		longitude = position.coords.longitude;
		accuracy = position.coords.accuracy; 
                console.log("lat" + $('#latitude').val());
                console.log("long" + $('#longitude').val());
                $('#latitude').val(latitude);
                $('#longitude').val(longitude);
                console.log("lat" + $('#latitude').val());
                console.log("long" + $('#longitude').val());
                codeLatLng(latitude, longitude);

         };

	function positionError(error) {
		var errors = {
			1: "Authorization fails", // permission denied
			2: "Can\'t detect your location", //position unavailable
			3: "Connection timeout" // timeout
		};
		showError("Error:" + errors[error.code]);
	}


    var temp_data;

    $('form#addVirus').submit(function(e){
        //e.preventDefault();

            console.log("temp data");
            console.log(temp_data);
            console.log(globe);

        var $this = $(this); // `this` refers to the current form element
        $.post(
            $this.attr("action"), // Gets the URL to sent the post to
            $this.serialize(), // Serializes form data in standard format
            function(data) {  },
            "json" // The format the response should be in
        );
        lightbox_close();

    });

    $( "#send-comment-button" ).click(function() {
        var url = "/globe/api/send_comment?virus_id=" + $('#comment-virus-id').val() + "&comment=" + $('#comment-box').val() + "&user_id=" + user_id;
        $('#comment-box').val('');        
        $.getJSON(url, function(comments) {
            comments.reverse();
            var list = '';
            for(var i = 0; i < comments.length; i++)
            {
                list += '<li id="comment-container"><label style="color:steelblue;">' + comments[i].user.username + '<label>:"' + comments[i].comment + '"</li>';
            }

            $('#comments-list').html(list).hide().fadeIn(300);

        });        

    });

    $( "#admin-access" ).click(function() {
        window.location="/globe/admin";     
    });
 
   if(!Detector.webgl){
      Detector.addGetWebGLMessage();
    } else {

      var years = ['1990','1995','2000'];
      var container = document.getElementById('container');
      var globe = new DAT.Globe(container);
      
       /*
       var globe = DAT.Globe(document.getElementById('container'), function(label) {
      return new THREE.Color([
      0xd9d9d9, 0xb6b4b5, 0x9966cc, 0x15adff, 0x3e66a3,
      0x216288, 0xff7e7e, 0xff1f13, 0xc0120b, 0x5a1301, 0xffcc02,
      0xedb113, 0x9fce66, 0x0c9a39,
      0xfe9872, 0x7f3f98, 0xf26522, 0x2bb673, 0xd7df23,
      0xe6b23a, 0x7ed3f7][label]);
  });
    */

      console.log(globe);
      var i, tweens = [];
      
      var settime = function(globe, t) {
        return function() {
          new TWEEN.Tween(globe).to({time: t/years.length},500).easing(TWEEN.Easing.Cubic.EaseOut).start();
        /*  
        var y = document.getElementById('year'+years[t]);
          if (y.getAttribute('class') === 'year active') {
            return;
          }
          var yy = document.getElementsByClassName('year');
          for(i=0; i<yy.length; i++) {
            yy[i].setAttribute('class','year');
          }
          y.setAttribute('class', 'year active');
          */
        };
      };
      
        var y = document.getElementById('ebola');
        y.addEventListener('mouseover', settime(globe,0), false);
        var x = document.getElementById('measles');
        x.addEventListener('mouseover', settime(globe,1), false);
        var z = document.getElementById('malaria');
        z.addEventListener('mouseover', settime(globe,2), false);

        /*
        $.getJSON( "/globe/api.json", function( data ) {
            console.log("here!");
            console.log(data);
            console.log("after!");
            console.log(data); 
            //var data = JSON.parse(data.responseText);
          
            
            for (i=0;i<data.length;i++) {
              globe.addData(data[i][1], {format: 'magnitude', name: data[i][0], animated: true});
            }
            globe.createPoints();
            settime(globe,0)();
            globe.animate();
            document.body.style.backgroundImage = 'none';
            
            
        });
      */ 
      
      var xhr;
      TWEEN.start();
      xhr = new XMLHttpRequest();
      xhr.open('GET', 'population909500.json', true);
      //xhr.open('GET', 'virusData.json', true);
      //xhr.open("GET", "/globe/api.json", true);
      xhr.onreadystatechange = function(e) {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            console.log("xhr");
            console.log(xhr);
            var data = JSON.parse(xhr.responseText);
            console.log("parsed json" + data);
            window.data = data;
            console.log("data " + data);
            
            for (i=0;i<data.length;i++) {
              globe.addData(data[i][1], {format: 'magnitude', name: data[i][0], animated: true});
            }
            globe.createPoints();
            settime(globe,0)();
            globe.animate();
            document.body.style.backgroundImage = 'none';
            
          }
        }
      };
      xhr.send(null);
     
    }

