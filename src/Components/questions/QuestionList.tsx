import React from 'react';
import { List, ListItem, ListItemText, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface Question {
  id?: number;
  text: string;
  question_type: string;
  options?: string;
}

interface QuestionListProps {
  questions: Question[];
  onDelete: (id: number) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({ questions, onDelete }) => {
  return (
    <List>
      {questions.map((question) => (
        <ListItem
          key={question.id}
          sx={{
            borderRadius: 1,
            mb: 1,
            bgcolor: '#F8FAFC',
            '&:hover': {
              bgcolor: '#F1F5F9',
            },
          }}
          secondaryAction={
            <IconButton 
              edge="end" 
              aria-label="delete"
              onClick={() => question.id && onDelete(question.id)}
              sx={{
                color: '#EF4444',
                '&:hover': {
                  bgcolor: 'rgba(239, 68, 68, 0.1)',
                }
              }}
            >
              <DeleteIcon />
            </IconButton>
          }
        >
          <ListItemText 
            primary={question.text}
            sx={{
              '& .MuiListItemText-primary': {
                fontSize: '14px',
                color: '#1F2937',
              }
            }}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default QuestionList;

