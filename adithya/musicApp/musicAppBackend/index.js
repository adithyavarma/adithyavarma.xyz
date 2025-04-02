  const express = require('express');
  const bodyParser = require('body-parser');
  const cors = require('cors');
  const playlistsRoutes = require('./routes/playlists');
  const songsRoutes = require('./routes/songs');

  const app = express();
  const port = process.env.PORT || 3000;

  app.use(cors());
  app.use(bodyParser.json());
  app.use('/playlists', playlistsRoutes);
  app.use('/songs', songsRoutes);

  app.listen(port, () => {
      console.log(`Server running on port ${port}`);
  });
