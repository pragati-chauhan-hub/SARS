import React from 'react';
import { Card, CardContent, CardHeader, CardActions, Box } from '@mui/material';

const Card_Component = ({ title, subtitle, children, actions, ...props }) => {
  return (
    <Card {...props} sx={{ height: '100%', ...props?.sx }}>
      {(title || subtitle) && (
        <CardHeader
          title={title}
          subheader={subtitle}
          sx={{ borderBottom: '1px solid #e0e0e0' }}
        />
      )}
      <CardContent>
        <Box>{children}</Box>
      </CardContent>
      {actions && <CardActions>{actions}</CardActions>}
    </Card>
  );
};

export default Card_Component;
