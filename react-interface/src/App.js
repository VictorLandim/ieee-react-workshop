import React, { Component } from 'react';
import {
  Container,
  Header,
  Button,
  Segment,
  Dropdown,
  Grid,
  Card,
  Loader,
  Label
} from 'semantic-ui-react';
import api from './api';

import MovieCard from './components/MovieCard';
import AppHeader from './components/AppHeader';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      theaters: [],

      loading: false,

      // filtragem
      displayTheaters: [],
      selectedTheater: '',
      dropdownTheaters: []
    };
  }

  async componentDidMount() {
    this.setState(
      {
        loading: true
      },
      async () => {
        const { data } = await api.get('/api/movies');

        const dropdownTheaters = data.map(theater => ({
          text: theater.name,
          id: theater.id,
          value: theater.name
        }));

        this.setState({
          theaters: data,
          displayTheaters: data,
          dropdownTheaters,
          loading: false
        });
      }
    );
  }

  onTheaterChange = (e, { value }) => {
    const { theaters } = this.state;

    if (!value) {
      this.setState({
        displayTheaters: theaters,
        selectedTheater: ''
      });
    } else {
      this.setState({
        displayTheaters: theaters.filter(theater => theater.name === value),
        selectedTheater: value
      });
    }
  };

  renderFilters() {
    const { dropdownTheaters, selectedTheater } = this.state;

    return (
      <Grid divided="vertically">
        <Grid.Row columns={2} centered>
          <Grid.Column>
            <Header size="small">Filtrar cinema:</Header>
            <Dropdown
              placeholder="Digite um cinema"
              noResultsMessage="Tente outra busca"
              fluid
              search
              clearable
              options={dropdownTheaters}
              value={selectedTheater}
              onChange={this.onTheaterChange}
              selection
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  renderTheaters() {
    const { displayTheaters, loading } = this.state;

    if (loading) {
      return (
        <Segment padded="very">
          <Loader active content="Carregando filmes..." />
        </Segment>
      );
    }

    return displayTheaters.map((t, i) => (
      <>
        <Segment attached="top">
          <Header key={t.id} as="h2">
            {t.name}
          </Header>
          <Button icon="map marker alternate" content="Ver no mapa" color="blue" />
        </Segment>

        <Segment attached loading={loading}>
          <Card.Group itemsPerRow={5}>
            {t.movies.map(m => (
              <MovieCard
                imageUrl={m.imageUrl}
                title={m.title}
                duration={m.duration}
                trailerUrl={m.trailerUrl}
                rooms={m.rooms}
              />
            ))}
          </Card.Group>
        </Segment>
      </>
    ));
  }

  render() {
    return (
      <div className="App">
        <Container>
          <AppHeader text="O que tá passando em BSB hoje?" />
          {this.renderFilters()}
          {this.renderTheaters()}
        </Container>
      </div>
    );
  }
}
