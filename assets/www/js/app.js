function onDeviceReady() {
    'use strict';
    setupOnIframeLoad();
	initIframes();
    
    $('.menuLink').click(function() {
        $(document).one('pagechange', function() {
            refreshCurrentIframe();
        });
    });
    
    $('#logout').click(function() {
        launchChildBrowser('http://www.flexprocrm.com/Account/LogOn?App=true');
    });
    
    changeContentHeight();
}

function initIframes() {
	$('#newAccountPageiframe').attr('src', 'http://www.flexprocrm.com/Customer/Create');
	$('#myContactsPageiframe').attr('src', 'http://www.flexprocrm.com/Customer');
	$('#myRoutesPageiframe').attr('src', 'http://www.flexprocrm.com/Route/Detail');
	$('#routeManagementPageiframe').attr('src', 'http://www.flexprocrm.com/Route/Management');
	$('#reportsPageiframe').attr('src', 'http://www.flexprocrm.com/Reports/Viewer');
	$('#myContactsMapPageiframe').attr('src', 'http://www.flexprocrm.com/Customer/IndexMap');
}

function showPayment( returnSuccess ) {
    PaymentPlugin.callNativeFunction( nativePluginResultHandler, nativePluginErrorHandler, returnSuccess );
}

function showUpload( returnSuccess ) {
    UploadPlugin.callNativeFunction( nativePluginResultHandler, nativePluginErrorHandler, returnSuccess );
}

function nativePluginResultHandler (result) {
   //alert("SUCCESS: \r\n"+result );
}

function nativePluginErrorHandler (error) {
   alert("ERROR: \r\n"+error );
}

$(document).on('pagechange', function() {
    'use strict';
    changeContentHeight();
});

$(window).on('resize', function() {
    'use strict';
    changeContentHeight();
});

/*Alerts Widget*/
$('#alertWidget').on('expand', function() {
    'use strict';
    getAlerts();
});

function getAlerts() {
    'use strict';
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'http://www.flexprocrm.com/Api/GetUserNotification',
        error : function() {
            alert('getAroundMeMarkers Ajax Error');
        },
        success: function(data) {
            populateAlerts(data);
        }
    });
}

function populateAlerts(data) {
    'use strict';

    var markup = '';
    if (data.length <= 0) {
        $('#alertsCount').hide();
        return false;
    } else {
        $('#alertsCount').show().text(data.length);
        $.each(data, function(idx, alert) {
            var date = new Date();
            date.setTime(alert.start*1000);
            var month = date.getMonth()+1,
                day = date.getDate();

            markup += '<li><a class="alertLink" href="#" data-url="'+alert.url+'" data-transition="none"><div>'+alert.title+'</div><span>'+month+'/'+day+'</span></a></li>';
        });
        
        $('#alertsWidgetList').html(markup);
        
        $('.alertLink').off().on('click', function(event) {
            event.preventDefault();
            var url = 'http://www.flexprocrm.com'+$(this).attr('data-url'),
                title = $(this).find('div').text();
            slidemenu($($(":jqmData(slidemenu)").data('slidemenu')), true);
            makePage(title, url);
        });
    }
}

/*Alerts Widget*/

/*Around Me Widget*/
//on expansion
var aroundMeMapObject = null;

$('#aroundMeWidget').on('expand', function() {
    'use strict';
    navigator.geolocation.getCurrentPosition(
        function(position) {
            if (aroundMeMapObject === null) {
            
                $('#aroundMeMap').gmap3(
                    {   action: 'init',
                            options:{
                              center:[position.coords.latitude, position.coords.longitude],
                              zoom:12,
                              mapTypeControl: false,
                              navigationControl: false,
                              scrollwheel: false,
                              streetViewControl: false
                            }
                    }
                );
                aroundMeMapObject = $('#aroundMeMap').gmap3({action:'get', name:'map'});
                populateAroundMeMap(position);
            } else {
                var userLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                $('#aroundMeMap').gmap3({action:'panTo', args:[userLatlng]});
                populateAroundMeMap(position);
            }
        },
        function() {
            //do something on error
        }
    );
    
});
//on collapse
$('#aroundMeWidget').on('collapse', function() {
    'use strict';
    $('#aroundMeMap').gmap3(
        {action:'clear', name:'marker'},
        {action:'clear', name:'overlay'}
    );
});

function populateAroundMeMap(position) {
    'use strict';
    addAroundMeMarker({
        'lat':position.coords.latitude,
        'lng':position.coords.longitude,
        'markerUrl':'http://www.flexprocrm.com/Content/themes/website/images/MyLocation_Blue.png'
    });
    getAroundMeMarkers(position, function(data) {
        $.each(data, function(idx, marker) {
            setTimeout(function() {
                addAroundMeMarker({
                    'lat':marker.LatLng.Latitude,
                    'lng':marker.LatLng.Longitude,
                    'markerUrl':'http://www.flexprocrm.com/'+marker.IconUrl,
                    'name': marker.Name,
                    'address': marker.Address,
                    'locality': marker.City+','+marker.State+' '+marker.Zip,
                    'id': marker.id
                });
            },idx*200);
        });
    });
}

function addAroundMeMarker(values) {
    'use strict';
    var markerImage = new google.maps.MarkerImage(values.markerUrl, null, null, null, null);
    $('#aroundMeMap').gmap3({
            action: 'addMarker',
            latLng:[values.lat,values.lng],
            marker: {
                options: {
                    icon: markerImage,
                    animation: google.maps.Animation.DROP
                },
                events:{
                    click: function(marker){
                        $(this).gmap3(
                            {action:'panTo', args:[marker.position]},
                            {action:'clear', name:'overlay'},
                            {   action:'addOverlay',
                                content:  '<div class="aroundMeOverlay" data-name="'+values.name+'" data-id="'+values.id+'" onclick="openContact(this)"><p><strong>'+values.name+'</strong></p><p>'+values.address+'</p><p>'+values.locality+'</p><div class="point"></div></div>',
                                latLng: marker.position,
                                offset:{
                                    x: -102,
                                    y: -90
                                }
                            }
                        );
                    }
                }
            }
        }
    );
}

function openContact(link) {
    'use strict';
    var id = $(link).attr('data-id'),
        name = $(link).attr('data-name');
 
    slidemenu($($(":jqmData(slidemenu)").data('slidemenu')), true);
    makePage(name, 'http://www.flexprocrm.com/Customer/Detail/'+id);
 
    return false;
}

function getAroundMeMarkers(position, callback) {
    'use strict';
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'http://www.flexprocrm.com/Api/GetContactsAroundMe/?lat='+position.coords.latitude+'&lon='+position.coords.longitude+'&miles=10&statusIds=1|2',
        error : function() {
            //!add some error handling
            alert('getAroundMeMarkers Ajax Error');
        },
        success: function(data) {
            callback(data);
        }
    });
}

/*End Around Me Widget*/

/* Mobile View Link Handling */
$(document).on('viewLinkTap', function(data) {
    'use strict';
    navigator.notification.alert(JSON.stringify(data));
    //makePage('test Page','http://www.flexprocrm.com/Customer');
});

$(window).on('message', function(e) {
    'use strict';
    console.log(JSON.stringify(e.originalEvent.data));
    var message = e.originalEvent.data;
    if (message.action === 'linkclick') {
        if (message.data.pageTitle === 'BRAZILIAN PACKAGES') {
            return false;  //work around automatic click sin the directv module
        } else {
            makePage(message.data.pageTitle,message.data.linkUrl);
        }
    } else if (message.action === 'formSave_CalendarItem') {
        //alert(JSON.stringify(message.data));
        $('#salesHomePageiframe').attr('src', 'http://www.flexprocrm.com/Dashboard/Sales');
        $('.backBtn').click();
//                setTimeout(function() {
//                    $('.backBtn').click();
//                },750); //work around for multiple history ticks on new cal entry
    } else if (message.action === 'photoUpload') {
        $.mobile.activePage.jqmData('customerId',message.data.customerId);
        invokeImageUpload();
    } else if (message.action === 'formSave_CustomerNoteCreate') {
        $(document).one('pagechange',function() {
            refreshCurrentIframe();
        });
        $('div').focus();
        $.mobile.activePage.find('.backBtn').click();
    }

});

function invokeImageUpload() {
    'use strict';
    
    showUpload($.mobile.activePage.jqmData('customerId'));
    
//    navigator.notification.confirm(
//        '',  // message
//        function(btnIndex) {
//            var sourceType = (btnIndex === 1) ? Camera.PictureSourceType.SAVEDPHOTOALBUM : Camera.PictureSourceType.CAMERA;
//            launchCamera(sourceType);
//        },              // callback to invoke with index of button pressed
//        'Upload Photo From',            // title
//        'Library,Camera'          // buttonLabels
//    );
    
}

function launchCamera(sourceType) {
    'use strict';
    
    navigator.camera.getPicture(uploadImage, function(){
        console.log('FAIL!');
        
    }, {
        destinationType : Camera.DestinationType.DATA_URL,
        quality:40,
        sourceType:sourceType,
        encodingType: Camera.EncodingType.JPEG,
        allowEdit:true
    });
}

function uploadImage(imageData) {
    'use strict';

    var postData = {
        base64Image:imageData,
        customerId:$.mobile.activePage.jqmData('customerId')
    };
    
    $.ajax({
        type: 'POST',
        url: 'http://www.flexprocrm.com/Api/UploadImage',
        data: postData,
        error : function() {
            navigator.notification.alert('Image Upload Failed');
        },
        success: function() {
            //do something
            navigator.notification.alert('Image Successfully Uploaded');
        }
    });
    
//            console.log(imageData);
}

//Xiatron Base Tech
function makePage(pageTitle, iframeURL) {
    'use strict';
    var time = new Date().getTime();
    var currentPageId = $.mobile.activePage.attr('id');
    var newPage = $('<div id="'+time+'Page" class="injectedPage" data-role="page" style="background-color: #fff;"><div data-role="header" data-theme="b"><a class="backBtn" href="#'+currentPageId+'" data-icon="back" data-transition="slide" data-direction="reverse">Back</a><h1>'+pageTitle+'</h1></div><div data-role="content" style="background: #fff; overflow: auto; -webkit-overflow-scrolling: touch; height: 400px;"><iframe id="'+time+'Pageiframe" src="" width="990px" height="100%" style="border:0px;"></iframe></div></div>');
    
    newPage.appendTo($.mobile.pageContainer);
    $(newPage).page();
    
    $.mobile.changePage(newPage, {
        'transition':'slide',
        'dataUrl':time
    });
    
    setupOnIframeLoad();
    
    //window.frames[time+'Pageiframe'].location.replace(iframeURL);
    $('#'+time+'Pageiframe').attr('src', iframeURL);
}

/*search input handling*/
$('#searchInput').bind('keyup', function() {
    'use strict';
    $('#slidemenuSubA').hide();
    $('#slidemenuSearch').html('<h3><a id="advancedSearchLink" href="#" style="text-decoration: none; color: #fff;">Advanced Search</a></h3>').show();
    getSearchResults($(this).val());
    $('#advancedSearchLink').off().on('click', function(event) {
        event.preventDefault();
        resetSearch();
        slidemenu($($(":jqmData(slidemenu)").data('slidemenu')), true);
        makePage('Advanced Search', 'http://www.flexprocrm.com/Customer/Search?sc='+$('#searchInput').val());
    });
});

$('#searchInput').bind('blur', function() {
    'use strict';
    $('#searchInput').val('');
});

function resetSearch() {
    'use strict';
    $('#searchInput').val('');
    $('#slidemenuSubA').show();
    $('#slidemenuSearch').hide();
}

function getSearchResults(searchString) {
    'use strict';
    console.log(searchString);
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'http://www.flexprocrm.com/Api/Search?searchCriteria='+searchString,
        error : function() {
            //!add some error handling
        },
        success: function(data) {
            populateSearchResults(data);
        }
    });
}

function populateSearchResults(data) {
    'use strict';
    var markup = '<ul class="overflow:auto;">';
    $.each(data, function(idx, result) {
        markup += '<li><a class="searchLink" href="#" data-name="'+result.name+'" data-id="'+result.id+'" >'+result.name+'</a></li>';
    });
    markup += '</ul>';
    $('#slidemenuSearch').append(markup);
    
    $('.searchLink').off().on('click', function(event) {
        event.preventDefault();
        resetSearch();
        openContact(this);
    });
}

var childbrowserLaunched = false;
function launchChildBrowser(url) {
    'use strict';
    if (window.plugins.childBrowser !== null) {
        window.plugins.childBrowser.onClose = function() {
            childbrowserLaunched = false;
        };
        
        window.plugins.childBrowser.onLocationChange = function(webLoc) {
            if (webLoc.indexOf('/Home/AppLogin') > -1) {                        
                getUserRoles();
                //getAlerts();
            }
        };
        
        if (!childbrowserLaunched) {
            childbrowserLaunched = true;
            window.plugins.childBrowser.showWebPage(url);
        }
    }
}

// Setup Roles
function getUserRoles() {
    'use strict';
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'http://www.flexprocrm.com/Api/GetUserRoles',
        error : function() {
            //!add some error handling
        },
        success: function(data) {
            $('#salesHomePageiframe').hide();
            if (data.indexOf('Sales') !== -1) {
                $('#salesHomePageiframe').attr('src', 'http://www.flexprocrm.com/Dashboard/Sales');
                $('#salesHomePage h1').text('Sales Dashboard');
                                        
                $('.salesResource').show();
                $('.serviceResource').hide();
                $('.serviceManagementResource').hide();
            } else if (data.indexOf('Service') !== -1) {
                $('#salesHomePageiframe').attr('src', 'http://www.flexprocrm.com/Route/Detail');
                $('#salesHomePage h1').text('Service Dashboard');
            
                $('.salesResource').hide();
                $('.serviceResource').show();
                $('.serviceManagementResource').hide();
            } else if (data.indexOf('ServiceManager') !== -1) {
                $('#salesHomePageiframe').attr('src', 'http://www.flexprocrm.com/Route/Management');
                $('#salesHomePage h1').text('Service Management Dashboard');
            
                $('.salesResource').hide();
                $('.serviceResource').show();
                $('.serviceManagementResource').show();
            }     
           
           document.getElementById('salesHomePageiframe').onload = function() {
               refreshCurrentIframe();
               $('#salesHomePageiframe').show();
               document.getElementById('salesHomePageiframe').onload = null;
           };
           
            startLocationUpdates();
            window.plugins.childBrowser.close();
        }
    });
}

// Location Updates
var watchID = null;
function startLocationUpdates() {
    'use strict';
    var options = {frequency:900000};
    navigator.geolocation.watchPosition(postPosition, positionError, options);
}

function positionError() {
    'use strict';
    alert('error getting position!');
}

function postPosition(position) {
    'use strict';
    
    // Get Service Calls
    $.ajax({
        type: 'POST',
        url: 'http://www.flexprocrm.com/api/GetServiceCallsByUser',
        data: '',
        success: function(response) {
            for (var x in response) {
                var lat2 = response[x].ServiceLatitude,
                    lon2 = response[x].ServiceLongitude,
                    dist = distance(position.coords.latitude, position.coords.longitude, lat2, lon2, 'M');
                    
                if (dist <= .1) {
                	$.ajax({
				        type: 'POST',
				        url: 'http://www.flexprocrm.com/Api/GeoFenceUserLocation',
				        data: {ServiceCallId:response[x].ServiceCallId, ActionType:'CheckIn', lat:response[x].ServiceLatitude, lon:response[x].ServiceLongitude},
				        success: function(response) {
				            console.log(response);
				        }
				    }, true);
                }        
            }
        }
    }, true);
    
    
    $.ajax({
        type: 'POST',
        url: 'http://www.flexprocrm.com/api/AddUserlocation',
        data: {lat:position.coords.latitude, lon:position.coords.longitude},
        success: function() {
            //alert(JSON.stringify(response));
        }
    }, true);
    return false;
}

// Setup iFrame
var bInitialLaunched = false;
function setupOnIframeLoad() {
    'use strict';
    $('iframe').off();
	if  (!bInitialLaunched) {
		launchChildBrowser('http://www.flexprocrm.com/Account/LogOn?App=true');
		bInitialLaunched = true;
	}
	
    $('iframe').on('load',function() {
        if (this.contentWindow.location.href.indexOf('http://www.flexprocrm.com/Account/LogOn') > -1) {
            this.contentWindow.location.replace('blank.html');
			launchChildBrowser('http://www.flexprocrm.com/Account/LogOn?App=true');
            return false;
        }
        
        var b = this.contentWindow.document.body,
            div = $(document.createElement('div')),
            divCSS = {'height' : $(this.parentNode).height(), 'min-width':'100%', 'overflow' : 'scroll'};
        
        div.css(divCSS);
        
        while (b.firstChild) {
            div.append(b.firstChild);
        }

        $(b).append(div);
    });
}

function getCurrentLocation(callback) {
    'use strict';
    navigator.geolocation.getCurrentPosition(
        function(position){
            callback(position);
        },
        function() {
            //error handling here
        });
}

function refreshCurrentIframe() {
    'use strict';
    $('#loadingMask').hide();
    
    var params = '',
        pageId = $.mobile.activePage.attr('id');
    
    if (pageId === 'newAccountPage' || pageId === 'myContactsMapPage') {
        getCurrentLocation(function(position){
            params = '?lat='+position.coords.latitude+'&lon='+position.coords.longitude;
            window.frames[pageId+'iframe'].location.replace($('#'+pageId+'iframe').attr('src')+params);
        });
        return false;
    }
    window.frames[pageId+'iframe'].document.location.replace($('#'+pageId+'iframe').attr('src')+params);
}

function changeContentHeight() {
    'use strict';
    if(window.innerHeight > window.innerWidth){
        $.mobile.activePage.find('div[data-role="content"]').height(930);
    } else {
        $.mobile.activePage.find('div[data-role="content"]').height(674);
    }
}

function distance(lat1, lon1, lat2, lon2, unit) {
	'use strict';
    var radlat1 = Math.PI * lat1/180;
    var radlat2 = Math.PI * lat2/180;
    var radlon1 = Math.PI * lon1/180;
    var radlon2 = Math.PI * lon2/180;
    var theta = lon1-lon2;
    var radtheta = Math.PI * theta/180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit==="K") { dist = dist * 1.609344; }
    if (unit==="N") { dist = dist * 0.8684; }
    return dist;
}


// Init
document.addEventListener('deviceready', onDeviceReady, false);