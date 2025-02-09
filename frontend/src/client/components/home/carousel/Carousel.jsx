import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Box, Typography } from '@mui/material';
import ParticlesBg from 'particles-bg';

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
    label: 'Education is not preparation for life,Education is life itself',
    imgPath: 'https://t4.ftcdn.net/jpg/05/18/65/75/360_F_518657595_keQdDMCfv8SgYvjOgPMe8BCx7hkuplIf.jpg',
  },
];

function Carousel() {
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = carouselItems.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prevStep) => (prevStep + 1) % maxSteps);
    }, 4000);
    return () => clearInterval(interval);
  }, [maxSteps]);

  const handleNext = () => {
    setActiveStep((prevStep) => (prevStep + 1) % maxSteps);
  };

  const handlePrev = () => {
    setActiveStep((prevStep) => (prevStep - 1 + maxSteps) % maxSteps);
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

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
        {...handlers}
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          textAlign: 'center',
          margin: 'auto',
          mt: 4,
          fontFamily: 'Courier New',
        }}
      >
        <Box
          component="img"
          sx={{
            height: 400,
            display: 'block',
            maxWidth: '100%',
            overflow: 'hidden',
            margin: 'auto',
            borderRadius: 2,
            transition: 'transform 0.5s ease-in-out',
          }}
          src={carouselItems[activeStep].imgPath}
          alt={carouselItems[activeStep].label}
        />
        <Typography variant="h6" sx={{ mt: 2 }}>
          {carouselItems[activeStep].label}
        </Typography>
      </Box>
    </Box>
  );
}

export default Carousel;
