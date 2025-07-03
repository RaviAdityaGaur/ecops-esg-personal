import React from 'react'
import { Paper, Box } from '@mui/material'

interface FormLayoutProps {
  children: React.ReactNode
}

export function FormLayout({ children }: FormLayoutProps) {
  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>
      <Paper sx={{ p: 4, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {children}
      </Paper>
    </Box>
  )
}

