const axios = require('axios');
const express = require('express');
const cheerio = require('cheerio');
const { response } = require('express');

const app = express();

const url = 'https://www.theguardian.com/';

app.get('/', (req, res) => {
	res.json('Welcome');
});

const articles = [];

const publications = [
	{
		pubName: 'The Guardian',
		address: 'https://www.theguardian.com/environment/global-climate-talks',
		baseUrl: '',
	},
	{
		pubName: 'The Guardian',
		address: 'https://www.theguardian.com/environment/global-climate-talks',
		baseUrl: '',
	},
	{
		pubName: 'The Guardian',
		address: 'https://www.theguardian.com/environment/global-climate-talks',
		baseUrl: '',
	},
];

publications.forEach((publication) => {
	axios
		.get(publication.address)
		.then((response) => {
			const html = response.data;
			const $ = cheerio.load(html);

			$('a:contains("climate")', html).each(function () {
				const title = $(this).text();
				const url = $(this).attr('href');

				articles.push({
					title,
					url: publication.baseUrl + url,
					source: publication.pubName,
				});
			});
		})
		.catch((err) => console.log(err));
});

app.get('/news', (req, res) => {
	res.json(articles);
});

app.get('/news/:pubId', (req, res) => {
	const pubId = req.params.pubId;

	const pubAddress = publications.filter((pub) => pub.pubName == pubId)[0]
		.address;
	const pubBase = publications.filter((pub) => pub.pubName == pubId)[0].baseUrl;

	axios.get(pubAddress).then((response) => {
		const html = response.data;
		const $ = cheerio.load(html);
		const pubArticles = [];

		$('a:contains("climate")', html)
			.each(function () {
				const title = $(this).text();
				const url = $(this).attr('href');

				pubArticles.push({
					title,
					url: pubBase + url,
					source: pubId,
				});
			})
			.catch((err) => console.log(err));
		res.json(pubArticles);
	});

	res.json(articles);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});
