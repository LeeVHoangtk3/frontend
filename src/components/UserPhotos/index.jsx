import React, { useContext, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Divider,
  Link as MuiLink,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  TextField,
  Button,
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';

import './styles.css';
import fetchModel from '../../lib/fetchModelData';
import { AppContext } from '../../App';

/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos() {
  const { userId } = useParams();
  const { setTitle } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComments, setNewComments] = useState({});

  useEffect(() => {
    setLoading(true);

    Promise.all([fetchModel(`/user/${userId}`), fetchModel(`/photosOfUser/${userId}`)])
      .then(([userData, photoData]) => {
        setUser(userData);
        setPhotos(photoData);
        setTitle(`Photos of ${userData.first_name} ${userData.last_name}`);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Unable to load photos');
        setLoading(false);
      });
  }, [userId, setTitle]);

  const handleCommentChange = (photoId, value) => {
    setNewComments((prev) => ({
      ...prev,
      [photoId]: value,
    }));
  };

  const handleAddComment = (e, photoId) => {
    e.preventDefault();
    const commentText = newComments[photoId];
    if (!commentText || commentText.trim() === '') return;

    fetch(`/commentsOfPhoto/${photoId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ comment: commentText }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || 'Failed to add comment');
        }
        // Re-fetch photos to display the newly added comment immediately
        return fetchModel(`/photosOfUser/${userId}`);
      })
      .then((photoData) => {
        setPhotos(photoData);
        // Clear the text field for this photo
        setNewComments((prev) => ({
          ...prev,
          [photoId]: '',
        }));
      })
      .catch((err) => {
        alert('Error adding comment: ' + err.message);
      });
  };

  if (loading) {
    return <Typography>Loading photos...</Typography>;
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
        Photos of {user.first_name} {user.last_name}
      </Typography>
      {photos.length === 0 && <Typography>No photos available.</Typography>}
      {photos.map((photo) => (
        <Card key={photo._id} sx={{ mb: 3 }}>
          <CardMedia
            component="img"
            image={photo.file_name && photo.file_name.startsWith('data:') ? photo.file_name : `${process.env.PUBLIC_URL}/images/${photo.file_name}`}
            alt={photo.file_name}
          />
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              {new Date(photo.date_time).toLocaleString()}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Comments:
            </Typography>
            <List>
              {(photo.comments || []).map((comment) => (
                <React.Fragment key={comment._id}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={comment.comment}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {new Date(comment.date_time).toLocaleString()}
                          </Typography>
                          {' — '}
                          <MuiLink component={Link} to={`/users/${comment.user._id}`}>
                            {comment.user.first_name} {comment.user.last_name}
                          </MuiLink>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>

            <Box component="form" onSubmit={(e) => handleAddComment(e, photo._id)} sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Write a comment..."
                value={newComments[photo._id] || ''}
                onChange={(e) => handleCommentChange(photo._id, e.target.value)}
              />
              <Button type="submit" variant="contained" size="small">
                Post
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default UserPhotos;
