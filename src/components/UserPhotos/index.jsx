import React, { useState, useEffect } from "react";
import { Typography, Card, CardMedia, CardContent, List, ListItem, ListItemText, Divider, Button, Box, TextField } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import axiosClient, { baseServerURL } from "../../api/axiosClient";
import "./styles.css";

function UserPhotos() {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [newComments, setNewComments] = useState({});

  const loadPhotos = React.useCallback(() => {
    fetchModel(`/photo/photosOfUser/${userId}`)
      .then(res => setPhotos(res.data))
      .catch(err => console.error("loi khi lay danh sach anh, ", err));
  }, [userId]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  const handleAddComment = async (photoId) => {
    const commentText = newComments[photoId];
    if (!commentText?.trim()) return;

    try {
      await axiosClient.post(`/photo/commentsOfPhoto/${photoId}`, { comment: commentText });
      setNewComments(prev => ({ ...prev, [photoId]: "" }));
      loadPhotos();
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "da xay ra loi khi them binh luan");
    }
  };

  return (
    <Box>
      {photos.length > 0 ? (
        photos.map((photo) => (
          <Card key={photo._id} sx={{ mb: 4 }}>
            <CardMedia
              component="img"
              image={`${baseServerURL}/images/${photo.file_name}`}
              alt="User upload"
              sx={{ maxHeight: 500, objectFit: "contain", backgroundColor: "#f5f5f5" }}
            />
            <CardContent>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                Posted on: {new Date(photo.date_time).toLocaleString()}
              </Typography>

              {photo.comments?.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6">Comments:</Typography>
                  <List>
                    {photo.comments.map((comment) => (
                      <React.Fragment key={comment._id}>
                        <ListItem alignItems="flex-start">
                          <ListItemText
                            primary={
                              comment.user ? (
                                <Link to={`/users/${comment.user._id}`}>
                                  {comment.user.first_name} {comment.user.last_name}
                                </Link>
                              ) : (
                                "Unknown User"
                              )
                            }
                            secondary={
                              <>
                                <Typography component="span" variant="body2" color="text.primary" sx={{ mr: 1 }}>
                                  {new Date(comment.date_time).toLocaleString()} -
                                </Typography>
                                {comment.comment}
                              </>
                            }
                          />
                        </ListItem>
                        <Divider component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                </Box>
              )}

              <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Add a comment..."
                  value={newComments[photo._id] || ""}
                  onChange={(e) => setNewComments(prev => ({ ...prev, [photo._id]: e.target.value }))}
                />
                <Button
                  variant="contained"
                  onClick={() => handleAddComment(photo._id)}
                  disabled={!newComments[photo._id]?.trim()}
                >
                  Post
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body1">No photos available for this user.</Typography>
      )}
    </Box>
  );
}

export default UserPhotos;