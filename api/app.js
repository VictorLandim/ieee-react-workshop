const express = require('express');
const axios = require('axios');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/api/sessoes/:cityId', async (req, res) => {
  // brasília => 12
  const { cityId } = req.params;

  const theaterResponse = await axios.get(
    `https://api-content.ingresso.com/v0/theaters/city/${cityId}`
  );

  const allTheaters = theaterResponse.data
    .filter(e => e.enabled)
    .map(({ name, id, geolocation }) => ({
      name,
      id,
      mapUrl: `https://www.google.com/maps/place/${geolocation.lat},${geolocation.lng}`
    }));

  const sessionsPromises = allTheaters.map(theater =>
    axios.get(`https://api-content.ingresso.com/v0/sessions/city/${cityId}/theater/${theater.id}`)
  );

  const sessionsResponse = await Promise.all(sessionsPromises);
  const allSessions = sessionsResponse.map(session => session.data);
  const sessions = allTheaters.map((theater, i) => ({
    ...theater,
    movies: allSessions[i]
      .filter(session => session.isToday)[0]
      .movies.map(({ id, title, duration, contentRating, trailers, images, rooms, genres }) => ({
        id,
        title,
        duration,
        contentRating,
        genres,
        imageUrl: images[0].url,
        trailerUrl: trailers.length > 0 ? trailers[0].url : null,
        rooms: rooms.map(({ name, sessions }) => ({
          name,
          types: sessions[0].types.map(t => t.alias),
          sessions: sessions.map(({ id, price, date, time, siteURL }) => ({
            id,
            price,
            date,
            time,
            ticketUrl: siteURL
          }))
        }))
      }))
  }));

  res.json(sessions);
});

const notFoundHandler = (req, res) => res.status(404).send('Not found.');

app
  .get('*', notFoundHandler)
  .post('*', notFoundHandler)
  .put('*', notFoundHandler)
  .delete('*', notFoundHandler)
  .patch('*', notFoundHandler);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
