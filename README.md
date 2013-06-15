# tvcom

A simple way to get data from the tv.com website.

## Usage

tvcom is pretty straight forward. It has three methods, `shows`, `episodes`, `summary`.


### shows(number, callback)

Returns a sorted array of the `number` most popular tv-shows.

``` js
var tvcom = require('tvcom');
tvcom.shows(10, function(err, shows) { ... });

/*
[
	{
		id: 'game-of-thrones',
		title: 'Game of Thrones',
		icon: 'http://im0n.clkimg.com/i/sm/069/69088.jpg',
		description: 'Game of Thrones is an ...'
	},
 	{
 		id: 'greys-anatomy',
		title: 'Grey\'s Anatomy',
		icon: 'http://im1n.clkimg.com/i/sm/000/227.jpg',
		description: 'Grey\'s Anatomy is a ...'
	},
	...
]
*/
```

### episodes(id, callback)

Returns an array with all the seasons, with an array of all the episodes of that season.

``` js
var tvcom = require('tvcom');
tvcom.episodes('game-of-thrones', function(err, episodes) { ... });

/*
[
	[
		{
			title: 'A Hard Day\'s Night',
			firstAired: '3/27/05',
			season: '1',
			episode: '1',
			rating: '9.3',
			description: 'Meet Meredith Grey. Daughter of ...'
		},
		{
			title: 'The First Cut Is the Deepest',
			firstAired: '4/3/05',
			season: '1',
			episode: '2',
			rating: '9.1',
			description: 'The surgical staff tries to ...'
		},
		...
	],
	[
		{
			title: 'Raindrops Keep Falling On My Head',
			firstAired: '9/25/05',
			season: '2',
			episode: '1',
			rating: '9.3',
			description: 'Picks up where ...'
		},
		...
	],
	...
]
*/
```

### summary(id, callback)

Returns an object with a description, some images, videos, and news. The data is from http://www.tv.com/shows/greys-anatomy

``` js
var tvcom = require('tvcom');
tvcom.summary('game-of-thrones', function(err, summary) { ... });

/*
{
	title: 'Grey\'s Anatomy',
	rating: '8.8',
	description: 'Grey\'s Anatomy is a ...' }
	cast: [
		{
			name: 'Camilla Luddington',
			role: 'Dr. Jo Wilson (Season 10+)',
			icon: '//dw.com.com/clear/c.gif?sid=1003&ptid=6138'
		},
		...
	],
	news: [
		{
			teaser: 'TV IN DA CLUBUPFRONTS 2013',
			title: 'News Briefs: Starz and 50 Cent Are Powering Up for a New DramaABC\'s 2013-2014 Schedule: S.H.I.E.L.D. on Tuesdays, Less DWTS, and OUAT \'s New Spinoff on Thursdays',
			link: 'http://tv.com/news/news-briefs-starz-and-50-cent-are-powering-up-for-a-new-drama-137124191630/',
			icon: '//dw.com.com/clear/c.gif?sid=1003&ptid=6138',
			comments: '7',
			date: '10 hours ago',
		    by: {
		    	name: 'Tim Surette',
				link: 'http://tv.com/news/author/TimSpot/'
			}
		},
		...
	],
	photos: [
		{
			icon: 'http://static.tvtome.com/images/misc/grey.gif',
			link: 'http://tv.com/shows/greys-anatomy/photos/image-1684/',
			title: 'Patrick Dempsey and Ellen Pompeo on Grey...',
			credit: '© 2013 American Broadcasting Companies, Inc.'
		},
		...
	],
	clips: [
		{
			icon: 'http://im0n.clkimg.com/i/em/2/325/2325054.jpg',
			link: 'http://tv.com/shows/greys-anatomy/watch/jessica-capshaw-interview-1882579/',
			title: 'Jessica Capshaw Interview',
			date: '9/25/09',
			time: '02:58'
		},
		...
	]
*/
```

## License

MIT
