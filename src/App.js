import {
  BrowserRouter, Switch,
  Route,
  Link,
} from 'react-router-dom'
import EditLevel from './level-edit/EditLevel';
import LevelList from './LevelList';
import PuzzleForm from './level-edit/PuzzleForm'
import BasicForm from './level-edit/BasicForm'
import EditPlaylist from './EditPlaylist';
import PlaylistList from './PlaylistList';
import { Button, Paper } from '@mui/material'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Paper>
          <Button component={Link} to="/playlist">Playlists</Button>
          <Button component={Link} to="/level">Levels</Button>
        </Paper>
        <div>
          <Switch>
            <Route exact path="/level/create/puzzle">
              <PuzzleForm />
            </Route>
            <Route exact path="/level/create/basic">
              <BasicForm />
            </Route>
            <Route path="/level/edit/:levelId">
                <EditLevel />
            </Route>
            <Route path="/playlist/edit/:playlistName">
                <EditPlaylist />
            </Route>
            <Route path="/playlist/create">
                <EditPlaylist />
            </Route>
            <Route exact path={["/", "/level"]}>
              <LevelList />
            </Route>
            <Route exact path="/playlist">
              <PlaylistList />
            </Route>
          </Switch>
        </div>

      </BrowserRouter>
    </div>
  );
}

export default App;
