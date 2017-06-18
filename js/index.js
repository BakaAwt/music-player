var $playBtn;
var $pauseBtn;
var $nextBtn;
var $preBtn;
var $stopBtn;
var $muteBtn;
var $firstBtn;
var $lastBtn;
var $shuffleMode;
var $listMode;
var $loopMode;
var myAudio;
var controllArm;
var $cdCover;
var iStartDeg;
var iEndDeg;
var iIncrement;
var songsListIndex;//the index of song in the songslist
var playMode;//list shuffle loop
var shuffleIndex;
var shuffleIndexCount;
var title;
var artist;
var coverURL;
var musicURL;

$().ready(function ()
{
	init();
	for(var i = 0; i < songsList.length; i++)
	{
		songsList[i].musicURL = encodeURI(songsList[i].musicURL);
	}
	myAudio.src = decodeURI(songsList[songsListIndex].musicURL);
	/*^_^------------------some event listeners-------------------^_^*/
	myAudio.addEventListener('ended', function ()
	{
		controllArm.style.transform="rotate(-140deg)";
		if(playMode === "list")
		{
			songsListIndex++;
			if (songsListIndex >= songsList.length + 1)
				songsListIndex = 0;
		}
		else if(playMode === "shuffle")
		{
			songsListIndex = shuffle();
		}
		else
		{
			songsListIndex = songsListIndex;
		}
		myAudio.src = decodeURI(songsList[songsListIndex].musicURL);
		myAudio.load();
		iStartDeg = -120;
		iEndDeg = -140;
		myAudio.play();
	}, false);

	myAudio.addEventListener("timeupdate", function ()
	{
		var $myCon = $("#myConsole");
		if (!isNaN(myAudio.duration))
		{
			var progressValue = myAudio.currentTime/myAudio.duration;
			if(myAudio.paused)
				return;//confrim the controllerArm can be rotated immediately
			//iStartDeg = -95 - 25 * progressValue;
			controllArm.style.transform = "rotate(" + iStartDeg +"deg)";
			$myCon.text(songsList[songsListIndex % songsList.length].title + "-" + songsList[songsListIndex % songsList.length].artist);
		}
		else
			$myCon.text("停止");
	}, false);
});
function AwAsSky()
{
	//title="Sky";
	//artist="Alan Walker,Alex Skrindo";
	//coverURL="http://p4.music.126.net/Vx4M2DcQkR2J_fywgkDj5Q==/18586144557880349.jpg";
	//musicURL="http://awtupdateserve.oss-cn-shanghai.aliyuncs.com/Alan%20Walker%2CAlex%20Skrindo%20-%20Sky.mp3";
	songsList = 
		[
			{
				"title" : "Sky",
				"artist" : "Alan Walker,Alex Skrindo",
				"coverURL" : "http://p4.music.126.net/Vx4M2DcQkR2J_fywgkDj5Q==/18586144557880349.jpg",
				"musicURL" : "http://awtupdateserve.oss-cn-shanghai.aliyuncs.com/Alan%20Walker%2CAlex%20Skrindo%20-%20Sky.mp3"
			}
		];
	play();
}
function MSSD()
{
	//title="START：DASH!!";
	//artist="μ's";
	//coverURL="http://p4.music.126.net/F2rL7lYi3KcSpgym-O81pQ==/5888984278646723.jpg",
	//musicURL="http://awtupdateserve.oss-cn-shanghai.aliyuncs.com/%CE%BC%27s%20-%20START%EF%BC%9ADASH%21%21.mp3"
	songsList = 
		[
			{
				"title" : "START：DASH!!",
				"artist" : "μ's",
				"coverURL" : "http://p4.music.126.net/F2rL7lYi3KcSpgym-O81pQ==/5888984278646723.jpg",
				"musicURL" : "http://awtupdateserve.oss-cn-shanghai.aliyuncs.com/%CE%BC%27s%20-%20START%EF%BC%9ADASH%21%21.mp3"
			}
		];
	play();
}
function PlaySelected()
{
	title=document.getElementById("title").value;
	artist=document.getElementById("artist").value;
	coverURL=document.getElementById("coverURL").value;
	musicURL=document.getElementById("musicURL").value;
	if (coverURL === "") {
		cdCover.style.background = "url(\"imgs/logo.png\") no-repeat";
		coverURL = "url(\"imgs/logo.png\") no-repeat";
	}
	else {
		cdCover.style.background = "url(\"" + coverURL + "\") no-repeat";
		coverURL = "url(\"imgs/logo.png\") no-repeat";
	}
	songsList = 
		[
			{
				"title" : title,
				"artist" : artist,
				"coverURL" : coverURL,
				"musicURL" : musicURL
			}
		];
		play();
}
function play()
{
		//alert("url(\"" + coverURL + "\") no-repeat");
	iIncrement = (iStartDeg - iEndDeg);
	controllArm.style.transform="rotate(" + iStartDeg +"deg)";
	if($cdCover.hasClass("cdPause"))
	{
		$cdCover.removeClass("cdPause");
		$cdCover.removeClass("cdStart");
	}
	if(!$cdCover.hasClass("cdStart"))
		$cdCover.addClass("cdStart");
	myAudio.src = decodeURI(musicURL);
	myAudio.load();
	changeSong("next");
	myAudio.play();
}
function initEventClick()
{
	/*^_^------------------some click events-------------------^_^*/
	$playBtn.click(function ()
	{
		iIncrement = (iStartDeg - iEndDeg);
		controllArm.style.transform="rotate(" + iStartDeg +"deg)";
		if($cdCover.hasClass("cdPause"))
		{
			$cdCover.removeClass("cdPause");
			$cdCover.removeClass("cdStart");
		}
		if(!$cdCover.hasClass("cdStart"))
			$cdCover.addClass("cdStart");
		myAudio.play();
	});
	$pauseBtn.click(function ()
	{
		controllArm.style.transform="rotate(-140deg)";
		if(!$cdCover.hasClass("cdPause"))
			$cdCover.addClass("cdPause");
		myAudio.pause();
	});
	$nextBtn.click(function ()
	{
		changeSong("next");
	});
	$preBtn.click(function ()
	{
		changeSong("pre");
	});

	$stopBtn.click(stop);
	function stop()
	{
		controllArm.style.transform="rotate(-140deg)";
		$cdCover.removeClass("cdPause");
		$cdCover.removeClass("cdStart");
		myAudio.load();
	}

	$muteBtn.click(function ()
	{
		myAudio.muted = !myAudio.muted;
		if(myAudio.muted)
			$(this).css({"color":'red'});
		else
			$(this).css({"color":'#b1b9c6'});
	});
	$firstBtn.click(function ()
	{
		changeSong("first");
	});
	$lastBtn.click(function ()
	{
		changeSong("last");
	});

	$shuffleMode.click(function ()
	{
		playMode = "shuffle";
		$("#playMode").find("div").css({"color":"#b1b9c6"});
		$(this).css({"color":"#e74d3c"});
	});
	$listMode.click(function ()
	{
		playMode = "list";
		$("#playMode").find("div").css({"color":"#b1b9c6"});
		$(this).css({"color":"#e74d3c"});
	});
	$loopMode.click(function ()
	{
		playMode = "loop";
		$("#playMode").find("div").css({"color":"#b1b9c6"});
		$(this).css({"color":"#e74d3c"});
	});

	/*^_^------------------some buttons' hover-------------------^_^*/
	$muteBtn.hover
	(
		function ()
		{
			if(!myAudio.muted)
				$(this).css({"color":'#ffffff'});
		},
		function ()
		{
			$(this).css({"color":'#b1b9c6'});
			if(myAudio.muted)
				$(this).css({"color":'red'});
		}
	);
}

function initComponents()
{
	$playBtn = $("#playBtn");
	$pauseBtn = $("#pauseBtn");
	$nextBtn = $("#nextBtn");
	$preBtn = $("#preBtn");
	$stopBtn = $("#stopBtn");
	$muteBtn = $("#muteBtn");
	$firstBtn = $("#firstBtn");
	$lastBtn = $("#lastBtn");
	$shuffleMode = $("#shuffleMode");
	$listMode = $("#listMode");
	$loopMode = $("#loopMode");
	myAudio = $("#myAudio")[0];
	controllArm = $("#cdControllerArm")[0];
	$cdCover = $("#cdCover");
	iStartDeg = -120;
	iEndDeg = -140;
	iIncrement = 30;
	songsListIndex = 0;//the index of song in the songslist
	playMode = "list";//list shuffle loop
	$("#listMode").css({"color":"#e74d3c"});
	shuffleIndex = [];
	shuffleIndexCount = songsList.length - 1;
	initShuffleGenerator();
}

function initShuffleGenerator()
{
	for(var i = 0; i < songsList.length; i++)
	{
		shuffleIndex[i] = i;
	}
}

function init()
{
	initComponents();
	initEventClick();
}

/*^_^------------------some core functions-------------------^_^*/
//var shuffleIndex = [0, 1, 2, 3, 4, 5, 6];
//var shuffleIndexCount = 6;
function shuffle()
{
	var tem = getRandom(shuffleIndexCount);
	var tem2 = shuffleIndex[tem];
	shuffleIndex[tem] = shuffleIndex[shuffleIndexCount];

	shuffleIndexCount--;
	if(shuffleIndexCount < 0)
	{
		shuffleIndexCount = songsList.length;
	}
	return tem2;
}

function changeSong(whatDirection)
{
	if(myAudio.currentTime != 0)
	{
		if(!myAudio.paused)
		{
			if ($cdCover.hasClass("cdPause")) {
				$cdCover.removeClass("cdPause");
				$cdCover.removeClass("cdStart");
			}
			if (!$cdCover.hasClass("cdStart"))
				$cdCover.addClass("cdStart");
			controllArm.style.transform = "rotate(-140deg)";
			if (whatDirection == "pre") {
				songsListIndex--;
				if (songsListIndex <= -1)
					songsListIndex = songsList.length;
			}
			else if (whatDirection === "next") {
				songsListIndex++;
				if (songsListIndex >= songsList.length + 1) 
					songsListIndex = 0;
			}
			else if (whatDirection === "first") {
				songsListIndex = 0;
			}
			else if(whatDirection === "last")
			{
//                alert(songsList.length);
				songsListIndex = songsList.length - 1;
//                alert(songsListIndex);
			}
			else
			{
			}
			myAudio.src = decodeURI(songsList[songsListIndex].musicURL);
			myAudio.load();
			myAudio.play();
		}
	}
}

/*^_^------------------some assistant functions-------------------^_^*/
//generate random
function getRandom(n)
{
	return Math.floor(Math.random()*n+1);
}

//convert float/double to percent
Number.prototype.toPercent = function(n)
{
	n = n || 2;
	return ( Math.round( this * Math.pow( 10, n + 2 ) ) / Math.pow( 10, n ) ).toFixed( n ) + '%';
};

/*^_^-------------------------songs list--------------------------^_^*/
var songsList =
[
	{
		"title" : "Sunkissed (Teaser)",
		"artist" : "EnV",
		"coverURL" : "",
		"musicURL" : "audio/EnV - Sunkissed (Teaser).mp3"
	}
];