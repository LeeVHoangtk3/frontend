import React, { useState, useEffect } from "react";
import { Typography, Button, Card, CardContent } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

function UserDetail() {
  const { userId } = useParams();
  const [userDetail, setUserDetail] = useState(null);

  useEffect(() => {
    fetchModel(`/user/${userId}`)
      .then(res => setUserDetail(res.data))
      .catch(err => console.error("Lỗi khi lấy chi tiết người dùng:", err));
  }, [userId]);

  return (
    userDetail && (
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {userDetail.first_name} {userDetail.last_name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <strong>Location:</strong> {userDetail.location}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <strong>Occupation:</strong> {userDetail.occupation}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Description:</strong> {userDetail.description}
          </Typography>
          <Button variant="contained" color="primary" component={Link} to={`/photos/${userId}`}>
            View Photos
          </Button>
        </CardContent>
      </Card>
    )
  );
}

export default UserDetail;