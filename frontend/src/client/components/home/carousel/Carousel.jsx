import React, { useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import { Box, Typography, MobileStepper, Button } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import ParticlesBg from 'particles-bg';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const carouselItems = [
  {
    label: 'Welcome to School Management System',
    imgPath: 'https://images.unsplash.com/photo-1524069290683-0457abfe42c3?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZWxlbWVudGFyeSUyMHNjaG9vbHxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    label: 'Manage Your School Effortlessly',
    imgPath: 'https://static.vecteezy.com/system/resources/thumbnails/038/000/694/small_2x/ai-generated-happy-african-american-schoolchildren-running-through-the-school-yard-photo.jpg',
  },
  {
    label: 'Keep Everything Organized',
    imgPath: 'https://assets.thehansindia.com/h-upload/2022/07/05/1301444-students.webp',
  },
  {
    label: 'Education is not preparation for life; education is life itself',
    imgPath: 'https://t4.ftcdn.net/jpg/05/18/65/75/360_F_518657595_keQdDMCfv8SgYvjOgPMe8BCx7hkuplIf.jpg',
  },
];

function Carousel() {
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = carouselItems.length;

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '80vh',
        overflow: 'hidden',
      }}
    >
      {/* Particles Background */}
      <ParticlesBg className="particles" color='blue' type="square" bg={true} />

      {/* Carousel Container */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          flexGrow: 1,
          textAlign: 'center',
          margin: 'auto',
          mt: 4,
          fontFamily: 'Courier New'
        }}
      >
        <AutoPlaySwipeableViews
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
          interval={5000} 
        >
          {carouselItems.map((step, index) => (
            <div key={step.label}>
              {Math.abs(activeStep - index) <= 2 ? (
                <Box
                  component="img"
                  sx={{
                    height: 400,
                    display: 'block',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    margin: 'auto',
                    borderRadius: 2,
                  }}
                  src={step.imgPath}
                  alt={step.label}
                />
              ) : null}
              <Typography variant="h6" sx={{ mt: 2 }}>
                {step.label}
              </Typography>
            </div>
          ))}
        </AutoPlaySwipeableViews>

        {/* <MobileStepper
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          sx={{ backgroundColor: 'transparent', mt: 2 }}
         
        /> */}
      </Box>
    </Box>
  );
}

export default Carousel;
