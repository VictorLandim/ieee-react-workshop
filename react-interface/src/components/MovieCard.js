import React from 'react';
import {
  Card,
  Image,
  Button,
  Divider,
  Icon,
  Grid,
  GridColumn,
  Label,
  Header
} from 'semantic-ui-react';

export default ({ title, imageUrl, trailerUrl, duration, rooms }) => {
  const renderHours = room => {
    const { name, sessions, types } = room;

    return (
      <>
        <Grid columns={2} centered>
          <GridColumn>
            <Header as="h4" sub color="grey">
              {name}
            </Header>
          </GridColumn>

          <GridColumn>
            {types.map(type => (
              <Label basic color="blue" size="mini">
                {type}
              </Label>
            ))}
          </GridColumn>
        </Grid>

        <Divider horizontal></Divider>

        {sessions.map(session => (
          <Button
            style={{ margin: 5 }}
            as="a"
            href={session.ticketUrl}
            target="_blank"
            size="tiny"
            color="green"
          >
            {session.time}
          </Button>
        ))}
      </>
    );
  };

  return (
    <Card raised fluid inverted>
      <Image src={imageUrl} wrapped ui={false} />
      <Card.Content>
        <Card.Header>{title}</Card.Header>
        <Card.Meta>{`${duration} min`}</Card.Meta>

        <Divider></Divider>

        <Card.Description>{rooms.map(room => renderHours(room))}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        {
          <Button
            icon
            labelPosition="left"
            as="a"
            href={trailerUrl}
            target="_blank"
            color="red"
            size="tiny"
          >
            <Icon name="play" />
            Ver trailer
          </Button>
        }
      </Card.Content>
    </Card>
  );
};
