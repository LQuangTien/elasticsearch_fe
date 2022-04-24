import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { getInitialData } from "./actions";
import "./App.css";
import Layout from "./components/Layout";
import Home from "./containers/Home";
import Query from "./containers/Query";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getInitialData());
  }, [dispatch]);
  return (
    <div className="App">
      <Layout>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/query">
            <Query />
          </Route>
        </Switch>
      </Layout>
    </div>
  );
}

export default App;
