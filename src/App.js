import {
  BrowserRouter, Switch,
  Route,
  Link,
} from 'react-router-dom'
import EditLevel from './EditLevel';
import LevelList from './LevelList';
import PuzzleForm from './PuzzleForm'
import BasicForm from './BasicForm'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div><ul>
          <li><Link to="/new/puzzle">Create Puzzle</Link></li>
          <li><Link to="/new/basic">Create from scratch</Link></li>
          <li><Link to="/">List</Link></li>
        </ul></div>
        <div>
          <Switch>
            <Route exact path="/new/puzzle">
              <PuzzleForm />
            </Route>
            <Route exact path="/new/basic">
              <BasicForm />
            </Route>
            <Route path="/edit/:levelId">
                <EditLevel />
            </Route>
            <Route exact path="/">
              <LevelList />
            </Route>
          </Switch>
        </div>

      </BrowserRouter>
    </div>
  );
}

export default App;
