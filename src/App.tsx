import logo from './assets/logo.svg';
import './App.css';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import swal from 'sweetalert';
import { getUsersSavedTracks } from './lib/spotify/api/tracks/tracks';
import { GetUsersSavedTracksParams } from './lib/spotify/model';

const apiToken = 'BQBeHcBEer2BbO_nXOODV6fWGxIa_QH6g9vMmTZdAavfFFNrLVgUyFq7hW-3TKO7LyRfAc1WplnaStIYl52QgrnPnmfV2cYBU69pBd4eafftixAjjT5WJuEHld4FqdrP_D1qdbL5lZtPDPl0O0B1AUDAe4ItQ-IO8VjPyT1dwP5YrWxKSzlK_ZNr7xvprKrHhz4tzfnQ4ElH4bXYpulygBljNp00mAIuY-_JY5T8YjOoUkszMt16E8myOCyNpFz7Svb9nVJqiZDzJkt0lOtgD1yQbOWNCxIYnleGXTo9aTprVQKYrltW2PRwNFgX3cfJ_5iQ';

const getDeezerPreview = async (
  trackName: string,
  artistName: string,
): Promise<string | null> => {
  try {
    const query = encodeURIComponent(`${artistName} ${trackName}`);
    // Utiliser le proxy Vite configuré
    const url = `/api/deezer/search?q=${query}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.data && data.data.length > 0) {
      return data.data[0].preview;
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la recherche sur Deezer:', error);
    return null;
  }
};

const fetchTracks = async () => {
  const response = await fetch('https://api.spotify.com/v1/me/tracks', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + apiToken,
    },
  });

  if (!response.ok) {
    throw new Error(`Fetching tracks failed with status ${response.status}`);
  }
  const data = (await response.json()) as { items: any[] };

  return data.items;
};

const pickRandomTrack = (tracks: any[]) => {
  return tracks[Math.floor(Math.random() * tracks.length)]!;
};

const shuffleArray = (tracks: any[]) => {
  return tracks.sort(() => Math.random() - 0.5);
};

const AlbumCover = ({ track }: { track: any }) => {
  return (
    <img
      src={track.album.images?.[0]?.url ?? ''}
      style={{ width: 200, height: 200 }}
    />
  );
};

const TrackButton = ({
  track,
  onClick,
}: {
  track: any;
  onClick: () => void;
}) => {
  return (
    <div className="App-track-button">
      <AlbumCover track={track.track} />
      <button onClick={onClick}>{track.track?.name}</button>
    </div>
  );
};

const App = () => {
  const {
    data: tracks,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: ['tracks'],
    queryFn: async () => {
      const params: GetUsersSavedTracksParams = { limit: 20 };
      const response = await getUsersSavedTracks(
        { limit: 20 },
        { headers: { Authorization: `Bearer ${apiToken}` } }
      );      
      return response.data.items;
    },
  });

  const [currentTrack, setCurrentTrack] = useState<any | undefined>(undefined);
  const [trackChoices, setTrackChoices] = useState<any[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (!tracks) {
      return;
    }

    const rightTrack = pickRandomTrack(tracks);
    setCurrentTrack(rightTrack);

    const wrongTracks = [pickRandomTrack(tracks), pickRandomTrack(tracks)];
    const choices = shuffleArray([rightTrack, ...wrongTracks]);
    setTrackChoices(choices);
  }, [tracks]);

  const checkAnswer = (track: any) => {
    if (track.track?.id == currentTrack?.track?.id) {
      swal('Bravo !', "C'est la bonne réponse", 'success');
    } else {
      swal('Dommage !', "Ce n'est pas la bonne réponse", 'error');
    }
  };

  useEffect(() => {
    const fetchDeezerPreview = async () => {
      if (!currentTrack?.track) return;

      const trackName = currentTrack.track.name ?? '';
      const artistName = currentTrack.track.artists?.[0]?.name ?? '';

      const preview = await getDeezerPreview(trackName, artistName);
      if (preview) {
        setPreviewUrl(preview);
      }
    };

    fetchDeezerPreview();
  }, [currentTrack]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Bienvenue sur le blind test</h1>
      </header>
      <div className="App-images">
        {isLoading || !isSuccess ? (
          'Loading...'
        ) : (
          <div>
            <div>
              {previewUrl ? (
                <audio key={previewUrl} src={previewUrl} controls autoPlay />
              ) : (
                <p>Chargement de l'extrait audio...</p>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="App-buttons">
        {trackChoices
          .filter(track => track?.track)
          .map(track => (
            <TrackButton track={track} onClick={() => checkAnswer(track)} />
          ))}
      </div>
    </div>
  );
};

export default App;
