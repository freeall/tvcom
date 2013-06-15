var request = require('request');
var cheerio = require('cheerio');

request = request.defaults({
	jar: false
});

var onresponse = function(onerror, callback) {
	return function(err, response) {
		if (err) return onerror(err);
		if (response.statusCode !== 200) return onerror(new Error('wrong statuscode ', response.statusCode)); 
		callback(cheerio.load(response.body), response);
	};
};
var text = function($elem) {
	return $elem.text().trim().replace(/\r\n/g, '\n').replace(/moreless$/, '');
};
var shows = function(count, callback) {
	var res = {};

	var fetchPage = function(page, onpage) {
		request.get('http://tv.com/shows/page'+page + '/', onresponse(callback, function($, response) {
			$('._bento .show').each(function(_, show) {
				if (Object.keys(res).length >= count) return;

				var $show = $(show);
				var id = $('.info h4 a', $show).attr('href').match(/shows\/(.*)\//)[1];
				res[id] = {
					id: id,
					title: text($('.info h4 a', $show)),
					icon:  $('._image_container img', $show).attr('src'),
					description: text($('.info ._more_less', $show)),
				};
			});

			if (Object.keys(res).length >= count) {
				res = Object.keys(res).sort().map(function(id) {
					return res[id];
				});
				return callback(null, res);
			}

			onpage();
		}));
	};

	var i=1;
	function next() {
		fetchPage(i++, next);
	}
	next();
};
var episodes = function(id, callback) {
	var res = [];

	request.get('http://tv.com/shows/'+id+'/episodes/?printable=1', onresponse(callback, function($, response) {
		var formerSeason = '';
		$('.episodes .episode').toArray().reverse().forEach(function(episode) {
			var $episode = $(episode);
			var $dds = $('.info dd', $episode);
			var season = text($dds.eq(1));
			var episode = text($dds.eq(2));
			var thisEpisode = {
				title: text($('.title', $episode)),
				firstAired: text($dds.eq(0)),
				season: season,
				episode: episode,
				rating: $dds.eq(3).text().match(/(\d\.\d)/)[1],
				description: text($('.description', $episode))
			};

			if (season !== formerSeason) {
				formerSeason = season;
				res.push([]);
			}
			var s = res[res.length-1];
			s.push(thisEpisode);
		});

		callback(null, res);
	}));
};
var summary = function(id, callback) {
	var res = {
		cast: [],
		news: [],
		photos: [],
		clips: []
	};

	request.get('http://tv.com/shows/'+id, onresponse(callback, function($, response) {
		res.title = text($('h1[data-name]'));
		res.rating = text($('.global .score'));
		res.description = text($('.description'));

		$('.persons .person').each(function(_, person) {
			var $person = $(person);
			res.cast.push({
				name: text($('.name', $person)),
				role: text($('.role', $person)),
				icon: $('img').attr('src')
			});
		});
		$('.latest_news ._story_capsule').each(function(_, news) {
			var $news = $(news);
			res.news.push({
				teaser: text($('.info h5'), $news),
				title: text($('.info .title'), $news),
				link: 'http://tv.com' + $('.info .title a').attr('href'),
				icon: $('img').attr('src'),
				comments: text($('.comment_count', $news)),
				date: $('.byline', $news)[0].children[2].data.trim().replace(/^,\s/,''),
				by: {
					name: text($('.byline span', $news)),
					link: 'http://tv.com' + $('.byline a', $news).attr('href')
				}
			});
		});
		$('.photos .photo').each(function(_, photo) {
			var $photo = $(photo);
			res.photos.push({
				icon: $('img', $photo).attr('src'),
				link: 'http://tv.com'+$('.caption a', $photo).attr('href'),
				title: text($('.caption a', $photo)),
				credit: text($('.credit', $photo))
			});
		});
		$('.vid', $('.clips').last()).each(function(_, vid) {
			var $vid = $(vid);
			var dt = text($('.date_time', $vid)).match(/(.+\/.+\/.+)*\s*\((.*\:.+)\)/m) || {}
			res.clips.push({
				icon: $('img', $vid).attr('src'),
				link: 'http://tv.com'+$('.mask', $vid).attr('href'),
				title: text($('.title', $vid)),
				date: dt[1],
				time: dt[2]
			});
		});

		callback(null, res);
	}));
};

module.exports = {
	shows: shows,
	episodes: episodes,
	summary: summary
};
