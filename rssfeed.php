<?php
/*
 * rssFeed - Your rss feed on your website
 *
 * http://noprobweb.com/rss_feed_flux_jquery.php
 *
 * Version : 1.6
 *
 * Copyright (c) 2014 NoProbWeb (http://www.noprobweb.com)
 *
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * 
 * Built on top of the jQuery library
 * http://jquery.com
 * 
 */
$url = $_POST['feed'];
$ch = curl_init();
$timeout = 5;
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; Windows NT 6.1; fr; rv:1.9.2.13) Gecko/20101203 Firefox/3.6.13'); 
curl_setopt ($ch, CURLOPT_URL, $url);
curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
$file_contents = curl_exec($ch);
echo $file_contents;
curl_close($ch);
?>