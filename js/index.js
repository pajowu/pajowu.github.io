"use strict";

var flickr_user_id = "131632812@N04";
var api_key = "da99dfcf77c6a746ffe8a7cf5501f4a2";
var github_username = "pajowu"

function getSummaryString(event){
	console.log(event);
	var repo_name = event["repo"]["name"];
	var base_data = `[<a href="https://github.com/${repo_name}">${repo_name}</a>] <a href="https://github.com/${event["actor"]["login"]}">${event["actor"]["login"]}</a> `
	switch (event["type"]) {
		case "CreateEvent": 
			return base_data + `created a ${event["payload"]['ref_type']}.`

		case "DeleteEvent":
			return base_data + `deleted a ${event["payload"]['ref_type']}.`

		case "IssueCommentEvent":
			var num = event["payload"]["issue"]["number"];
			return base_data + `${event["payload"]['action']} a comment on issue
					<a href="https://github.com/${repo_name}/issues/${num}">#${num}:
					${event["payload"]["issue"]["title"]}</a>`

		case "IssuesEvent":
			return base_data + `${event["payload"]['action']} issue
					#${event["payload"]["issue"]["number"]}:
					${event["payload"]["issue"]["title"]}`

		case "PublicEvent":
			return base_data + `just made the repo public.`

		case "PullRequestEvent":
			var num = event["payload"]["pull_request"]["number"];
          	return base_data +
          		`${event["payload"]["action"]} pull request
          		<a href="https://github.com/${repo_name}/pull/${num}">#${num}:
          		${event["payload"]["pull_request"]["title"]}`

		case "PushEvent":
			return base_data + `pushed ${event["payload"]["commits"].length} commit(s)`

		case "ForkEvent":
			var fork_name = event["payload"]["forkee"]["full_name"];
			return `<a href="https://github.com/${event["actor"]["login"]}">${event["actor"]["login"]}</a>
					forked
					<a href="https://github.com/${repo_name}">${repo_name}</a> to
					<a href="https://github.com/${fork_name}">${fork_name}</a>`

		default:
			return base_data + `did something`
	}
	
}
function resizeFlickr() {
	document.getElementById("latest_flickr_photo").style.height = "0px";
	var heights = [	document.getElementById("latest_tweet").clientHeight,
					document.getElementById("latest_github_event").clientHeight,
					document.getElementById("latest_post").clientHeight];
	console.log(heights);
	//var image_height = document.getElementById("newest_stuff").clientHeight+'px';//-document.getElementById("flickr_image_data").clientHeight+'px';
	var image_height = Math.max.apply(null,heights)+'px';
	console.log(image_height)
	document.getElementById("flickr_image").style.height = image_height;
	document.getElementById("latest_flickr_photo").style.height = image_height; 
}

function newestFlickrPhoto(flickr_resp) {
	if (flickr_resp["stat"] != "ok") {
		console.log("Couldn't load flickr photo")
		return
	}
	var photo = flickr_resp["photos"]["photo"][0];
	console.log(photo);
	var photo_html = photo;

	//document.getElementById("latest_flickr_photo").innerHTML = JSON.stringify(photo_html);
	document.getElementById("flickr_image").style.backgroundImage = `url('${photo["url_l"]}')`;
	
	if (photo["title"] != "") {
		document.getElementById("flickr_image_title_text").innerHTML = photo["title"];
	}

	var date = new Date(photo["datetaken"]).toLocaleDateString();
	document.getElementById("flickr_image_date").innerHTML = date;

	document.getElementById("flickr_image_link").href = `https://www.flickr.com/photos/${photo["owner"]}/${photo["id"]}`

	document.getElementById("flickr_image_data").style.display = "block";
	document.getElementById("flickr_loading_indicator").style.display = "none";
	document.getElementById("newest_stuff").onresize = resizeFlickr;
	resizeFlickr();
}

function loadNewestFlickrPhoto() {
	// request newest flickr photo
	var xmlhttp = new XMLHttpRequest();
	var url = "https://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos"
	url += `&user_id=${flickr_user_id}&api_key=${api_key}`;
	url += "&format=json&per_page=1&extras=url_l,date_taken&nojsoncallback=1";

	xmlhttp.onreadystatechange = function() {
	    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
	        var myArr = JSON.parse(xmlhttp.responseText);
	        newestFlickrPhoto(myArr)
	    }
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function loadNewestGithubAction() {
	// request newest flickr photo
	var xmlhttp = new XMLHttpRequest();
	var url = `https://api.github.com/users/${github_username}/events?per_page=2`;

	xmlhttp.onreadystatechange = function() {
	    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
	        var myArr = JSON.parse(xmlhttp.responseText);
	        newestGithubAction(myArr)
	    }
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function newestGithubAction(github_resp) {

	var github_summaries = github_resp.map(getSummaryString)

	document.getElementById("github_data").innerHTML = github_summaries.join("<hr>");

	document.getElementById("github_data").style.display = "block";
	document.getElementById("github_loading_indicator").style.display = "none";
}

function showTweet(tweets){
	console.log(tweets)

	var tweetObject = tweets[0];
	tweets = [tweets[0]];
	var tweet_total_html = tweets.join("<hr>");

	document.getElementById("tweets").innerHTML = tweet_total_html;

	document.getElementById("twitter_data").style.display = "block";
	document.getElementById("twitter_loading_indicator").style.display = "none";
}

function loadNewestTweet() {
	var config = {
	  "profile": {"screenName": 'pajowu'},
	  "domId": '',
	  "maxTweets": 5,
	  "enableLinks": true, 
	  "showUser": false,
	  "showTime": true,
	  "dataOnly":false,
	  "showRetweet": false,
	  "showInteraction": false,
	  "customCallback":showTweet
	};
	twitterFetcher.fetch(config);
}
loadNewestFlickrPhoto();
loadNewestGithubAction(); // will add later(tm)
loadNewestTweet();