import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';

import './styles.css';
import fetchModel from '../../lib/fetchModelData';
import { AppContext } from '../../App';

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
  const { userId } = useParams();
  const { setTitle } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchModel(`/user/${userId}`)
      .then((data) => {
        setUser(data);
        setTitle(`${data.first_name} ${data.last_name}`);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Unable to load user');
        setLoading(false);
      });
  }, [userId, setTitle]);

  if (loading) {
    return <Typography>Loading user details...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!user) {
    return <Typography>User not found.</Typography>;
  }

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        {user.first_name} {user.last_name}
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="Location" secondary={user.location} />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary="Description" secondary={user.description} />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary="Occupation" secondary={user.occupation} />
        </ListItem>
      </List>
      <Button component={Link} to={`/photos/${user._id}`} variant="contained" sx={{ mt: 2 }}>
        View Photos
      </Button>
    </div>
  );
}

export default UserDetail;
