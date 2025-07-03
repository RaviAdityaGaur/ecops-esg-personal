import React from 'react'
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Box,
  Stack,
  Typography,
} from '@mui/material'
import { FormLayout } from './form-layout'

interface FrequencyFormProps {
  onNext: () => void;
  onBack: () => void;  // Add back handler prop
  updateFormData: (data: { frequency: string }) => void;
}

export function FrequencyForm({ onNext, onBack, updateFormData }: FrequencyFormProps) {
  const [frequency, setFrequency] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateFormData({ frequency });
    onNext()
  }

  return (
    <FormLayout>
      <form onSubmit={handleSubmit}>
      <Box sx={{ 
          height: '55vh', 
          display: 'flex', 
          flexDirection: "column"
        }}>
          <Box flex="1">
          <Typography variant="h5" fontWeight="medium">
            Frequency
          </Typography>

          <FormControl fullWidth sx={{ mt: 4 }}>
            <InputLabel>Select Frequency</InputLabel>
            <Select
              value={frequency}
              label="Select Frequency"
              onChange={(e) => setFrequency(e.target.value)}
            >
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="quarterly">Quarterly</MenuItem>
              <MenuItem value="annually">Annually</MenuItem>
            </Select>
          </FormControl>
          </Box>
          <Box
            display="flex"
            justifyContent="flex-end"
            gap={2}
          >
            <Button
              onClick={onBack}
              variant="contained"
              sx={{ 
                width: 120,
                bgcolor: '#868687',
                textTransform: 'capitalize' ,
                '&:hover': {
                  bgcolor: '#767677'
                }
              }}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ width: 120, textTransform: 'capitalize' }}
            >
              Next
              
            </Button>
          </Box>

        </Box>
      </form>
    </FormLayout>
  )
}

