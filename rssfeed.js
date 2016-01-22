/*
 * rssFeed - Your rss feed on your website *
 * http://noprobweb.com/rss_feed_flux_jquery.php *
 * Version : 1.6 *
 * Copyright (c) 2013 NoProbWeb (http://www.noprobweb.com) *
 * Modified by Henry LaFleur Jan 2016 *
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) *
 * Built on top of the jQuery library * http://jquery.com *
 */ 
jQuery.rssFeed = function (urlFeed, options)
{ 
    var rIDs = { titre: 'titre', feed: 'feed', loading: 'loading',
	         title: 'title', time: 'time', resume: 'resume', link: 'link'};

    var rssFeedOpt = jQuery.extend ({ crossFile: "rssfeed/rssfeed.php", 
				  errorMessage: "no Rss Feed, Flux rss manquant", 
				  errorMode: "off", 
				  nextInterval: 4000, 
				  lang: "en", 
				  header : "on", 
				  displayimg: "on", 
				  heightpict : 30, 
				  div : "rssfeed", 
				  position : "relative" 
				}, options); 
    if (rssFeedOpt.div != 'rssfeed')
    {
	rIDs.titre = rIDs.titre + rssFeedOpt.div;
	rIDs.feed = rIDs.feed + rssFeedOpt.div;
	rIDs.loading = rIDs.loading + rssFeedOpt.div;
	rIDs.title = rIDs.title + rssFeedOpt.div;
	rIDs.time = rIDs.time + rssFeedOpt.div;
	rIDs.resume = rIDs.resume + rssFeedOpt.div;
	rIDs.link = rIDs.link + rssFeedOpt.div;
    }

    if (rssFeedOpt.lang == "fr")
    { 
	var linkName = "Lire la Suite"; 
	var localMode = 'mode local (sans http)'; 
	var distantMode = 'mode inter domaine'; 
	var load = 'Chargement en cours...'; 
    } 
    else { 
	var linkName = "Read More"; 
	var localMode = 'localhost mode'; 
	var distantMode = 'Cross-domain mode'; 
	var load = 'Loading Data...'; 
    } 

    if (rssFeedOpt.header == "on") { 
	$("#"+rssFeedOpt.div).replaceWith('<div id="'+rssFeedOpt.div+'"><div id="'+rIDs.titre+'" class="titre"></div><div id="'+rIDs.feed+'" class="feed"><div id="'+rIDs.loading+'" class="loading" align="center"><img src="rssfeed/loading.gif" alt="loading" />'+load+' </div></div>');
    }
    else 
    {
	$("#"+rssFeedOpt.div).replaceWith('<div id="'+rssFeedOpt.div+'"><div id="'+rIDs.feed+'" class="feed"><div id="'+rIDs.loading+'" class="loading" align="center"><img src="rssfeed/loading.gif" alt="loading" />'+load+' </div></div>');
    }
    if(!urlFeed&&urlFeed.length==0) {
	$("#"+rIDs.loading).show();
	$("#"+rIDs.feed).append(rssFeedOpt.errorMessage);
	return false;
    }
    else 
    {
	if(urlFeed.substr(0,7)=='http://' && rssFeedOpt.crossFile!='') {
	    if (rssFeedOpt.errorMode == 'on') {
		alert(distantMode);
	    }
	    urlFeed = 'http://' + urlFeed.substr(7);
	}
	else if(urlFeed.substr(0,8)=='https://' && rssFeedOpt.crossFile!='') 
	{
	    if (rssFeedOpt.errorMode == 'on') {
		alert(distantMode);
	    }
	    urlFeed = 'https://'+urlFeed.substr(8);
	}
	else 
	{
	    if (urlFeed.substr(0,7)!='http://') {
		if (rssFeedOpt.errorMode == 'on') {
		    alert(distantMode);
		}
	    }
	}
    }
    $("#"+rIDs.loading).show();

    // RSS Data
    var i = 0;
    var j = 0;
    var titre = new Array();
    var description = new Array();
    var pubDate = new Array();
    var link = new Array();

    $.ajax({
	type: "POST", url: rssFeedOpt.crossFile, data: {
	    feed : urlFeed}
	, dataType: "xml", success: parseXml }
	  );

    function parseXml(xml) {
	$(xml).find("channel").each(parseTitle);
	$(xml).find("feed").each(parseTitle); // Handle Atom
	$(xml).find("item").each(parseItem);
	$(xml).find("entry").each(parseItem);
	var nb_feed = titre.length;
	j = 0;
	var animation = setInterval( showDiv, rssFeedOpt.nextInterval);

	function parseTitle() {
	    if ($(this).children("image").children("url").text() !="") {
		if (rssFeedOpt.header == "on") {
		    if ($(this).children("link").text() != "") {
			textTitre = '<div id="'+rIDs.titre+'" class="titre"><a href="' + $(this).children("link").text() + '" target="_blank"><img src="' + $(this).children("image").children("url").text() +'" /></a><a href="' + $(this).children("link").text() + '" target="_blank">' + $(this).children("title").text() + '</a></div>';
		    }
		    else 
		    {
			textTitre = '<div id="'+rIDs.titre+'" class="titre"><img src="' + $(this).children("image").children("url").text() +'" />' + $(this).children("title").text() + '</div>';
		    }
		}
	    }
	    else 
	    {
		if ($(this).children("link").text() != "") {
		    textTitre = '<div id="'+rIDs.titre+'" class="titre" align="center"><a href="' + $(this).children("link").text() + '" target="_blank">' + $(this).children("title").text() + '</a></div>';
		}
		else 
		{
		    textTitre = '<div id="'+rIDs.titre+'" class="titre" align="center">' + $(this).children("title").text() + '</div>';
		}
	    }
	    if (rssFeedOpt.header == "on") {
		$('#'+rIDs.titre).replaceWith(textTitre);
	    }
	}
				  

	function parseItem() {
	    $('#'+rIDs.loading).show();
	    titre[i] = $(this).find("title").text();
	    description[i] = $(this).find("description").text();
	    if (!(description[i]) || description[i] <= "")
		description[i] = $(this).find("content").text();
	    pubDate[i] = $(this).find("pubDate").text();
	    if (!(pubDate[i]) || pubDate[i] <= "")
		pubDate[i] = $(this).find("updated").text();
	    link[i] = $(this).find("link").text();
	    i++;
	}
			
	function timePassed(Time){
	    var S = 1000,M=60*S,H=60*M,J=24*H,W=7*J,Mo=4*W,Y=12*M;
	    var t=new Array(S,M,H,J,W,Mo,Y);
	    var pref = new Array('il y a environ','about');
	    var suffrsg = new Array('seconde','minute','heure','jour','semaine','mois','année');
	    var suffrpl = new Array('secondes','minutes','heures','jours','semaines','mois','années');
	    var sufensg = new Array('second ago','minute ago','hour ago','day','week ago','month ago','year ago');
	    var sufenpl = new Array('seconds ago','minutes ago','hours ago','days ago','weeks ago','months ago','years ago');
	    for (var i=0;
		 i<=t.length;
		 i++) {
		if(Time - t[i] <=0) {
		    if (rssFeedOpt.lang == 'fr') {
			if (Math.round(Time/t[i-1]) == 1) var suf = suffrsg[i-1];
			else var suf = suffrpl[i-1];
			var prefixe = pref[0];
		    }
		    else 
		    {
			if (Math.round(Time/t[i-1]) == 1) var suf = sufensg[i-1];
			else var suf = sufenpl[i-1];
			var prefixe = pref[1];
		    }
		    return prefixe +' '+ Math.round(Time/t[i-1]) + ' ' + suf;
		}
	    }
	}
	function stop(){
	    clearInterval(animation);
	}
	function restart(){
	    animation = setInterval( showDiv, rssFeedOpt.nextInterval);
	}
	function delimg(string){
	    var debstring;
	    var endstring;
	    while(string.indexOf('<img',0) != -1) {
		debstring = string.substring(0,string.indexOf("<img",0));
		var posimg = string.indexOf("/>",0) +2;
		endstring = string.substring(posimg);
		string =  debstring+endstring;
	    }
	    return string;
	}
	function setimg(string){
	    var debstring;
	    var endstring;
	    var imgstring;
	    if(string.indexOf("<img",0) != -1) {
		debstring = string.substring(0,string.indexOf("<img",0));
		var posimg = string.indexOf("/>",0) +2;
		var posdegimg = string.indexOf("<img",0);
		imgstring = string.substring(posdegimg,posimg);
		endstring = string.substring(posimg);
		string =  debstring+'<p>'+imgstring+'</p>'+endstring;
	    }
	    return string;
	}
	function calcHeight(){
	    $('#'+rIDs.resume).css('height','auto');
	    var heightresume= $('#'+rIDs.resume).height();
	    if(rssFeedOpt.displayimg == "on"){
		heightresume+=rssFeedOpt.heightpict;
	    }
	    $('#'+rIDs.resume).css('height','0px');
	    return heightresume;
	}
	function onreload(){
	    var heightresume = calcHeight();
	    $('#'+rIDs.feed).mouseenter(function(){
		if ($('#'+rIDs.resume).height()>=0) {
		    var tmpHeight = $('#'+rIDs.resume).height();
		    $('#'+rIDs.resume).stop(true,true);
		    $('#'+rIDs.resume).height(tmpHeight+"px");
		    $('#'+rIDs.resume).animate({
			height: heightresume+"px" }
					 , 1000 ).show();
		    $('.a').hide('slow');
		}
	    }
				 );
	    $('#'+rIDs.feed).mouseleave(function(){
		if ($('#'+rIDs.resume).height()>0) {
		    $('#'+rIDs.resume).animate({
			height: "0px" }
					 , 1000 ).hide('slow');
		    var tmpHeight = $('#'+rIDs.resume).height();
		    $('.a').show('slow');
		}
	    }
				 );
	}
	function showDiv(){
	    $('#'+rIDs.loading).hide();
	    var des = description[j]; 
	    if (!des) 
		des = "";
	    var tit = titre[j];
	    if(rssFeedOpt.displayimg == "on") des= setimg(des);
	    else des = delimg(des);
	    var datePost = pubDate[j];
	    var dateActuel=new Date();

	    var diff = datePost;
	    var feedDiv = '<div id="'+rIDs.feed+'" class="feed"><div id="'+rIDs.title+'"  class="title">'+ tit + '<div id="'+rIDs.time+'" class="time">' + diff + '</div><div class="a"></div></div><div id="'+rIDs.resume+'" class="resume">' +  des + '<div id="'+rIDs.link+'" class="link"><br /><a href="' + link[j] + '" target="_blank">' + linkName+ '</a></div><div class="b"></div></div></div>';
	    $('#'+rIDs.feed).replaceWith(feedDiv);
	    if (rssFeedOpt.position == "absolute" || rssFeedOpt.position == "relative"  || rssFeedOpt.position == "fixed" || rssFeedOpt.position == "Inherit") {
		$('#'+rIDs.feed).css('position',rssFeedOpt.position);
	    }
	    else {
		$('#'+rIDs.feed).css('position','relative');
	    }
	    j = (j + 1) % nb_feed;

	    $('#'+rIDs.feed).hover(stop,restart);

	    onreload();
	}
    }
}
